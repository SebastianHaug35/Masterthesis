import json
import os
import re
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

from dotenv import load_dotenv

OPENCLAW_URL = os.getenv("OPENCLAW_URL", "http://72.61.136.246:8080/chat")
MAX_ROUNDS = 3
COMM_LOG_PATH = Path(os.getenv("BUDDY_OPENCLAW_LOG_PATH", "buddy_openclaw_traffic.jsonl"))

BUDDY_SYSTEM_PROMPT = """
Du bist Buddy, ein lokaler Proxy-Agent.
Deine Aufgabe:
1) Nimm die Anforderung des Users entgegen.
2) Beauftrage die OpenClaw-Instanz damit, einen n8n-Workflow zu erstellen.
3) Verlange, dass OpenClaw den Workflow auf seiner n8n-Instanz testet.
4) Verlange als Ergebnis ein funktionsfaehiges n8n-Workflow-JSON.
5) Du darfst bis zu 3 Runden mit OpenClaw iterieren (debuggen, verbessern, erweitern).
6) Nach spaetestens 3 Runden musst du dem User antworten, auch wenn es gescheitert ist.

Wichtig:
- Bestehe auf einem vollstaendigen n8n-Workflow-JSON als Ergebnis.
- Wenn das Ergebnis unvollstaendig ist, gib konkrete Korrekturauftraege.
- Sei technisch praezise und halte den Fokus auf lauffaehigem Workflow.
""".strip()


@dataclass
class BuddyResult:
    success: bool
    rounds_used: int
    message: str
    workflow_json: Optional[Dict[str, Any]] = None
    trace: Optional[List[str]] = None


@dataclass
class BuddySettings:
    timeout_seconds: float
    timeout_retries: int
    retry_delay_seconds: float
    retry_forever_on_timeout: bool


def _append_comm_log(event: Dict[str, Any]) -> None:
    payload = {"ts_utc": datetime.now(timezone.utc).isoformat(), **event}
    COMM_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with COMM_LOG_PATH.open("a", encoding="utf-8") as file:
        file.write(json.dumps(payload, ensure_ascii=False) + "\n")


def _load_env_file(filepath: str = ".env") -> None:
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip().strip('"').strip("'")


def _get_token() -> str:
    load_dotenv(override=False)
    _load_env_file(".env")
    token = os.getenv("TOKEN") or os.getenv("API_TOKEN") or os.getenv("BEARER_TOKEN")
    if not token:
        raise RuntimeError("Kein Token gefunden. Bitte TOKEN/API_TOKEN/BEARER_TOKEN in .env setzen.")
    return token


def _get_settings() -> BuddySettings:
    timeout_seconds = float(os.getenv("OPENCLAW_HTTP_TIMEOUT_SECONDS", "0"))
    timeout_retries = int(os.getenv("OPENCLAW_TIMEOUT_RETRIES", "4"))
    retry_delay_seconds = float(os.getenv("OPENCLAW_RETRY_DELAY_SECONDS", "2"))
    retry_forever = os.getenv("OPENCLAW_RETRY_FOREVER_ON_TIMEOUT", "1").strip().lower() in {"1", "true", "yes", "on"}
    return BuddySettings(
        timeout_seconds=timeout_seconds,
        timeout_retries=timeout_retries,
        retry_delay_seconds=retry_delay_seconds,
        retry_forever_on_timeout=retry_forever,
    )


def _call_openclaw(token: str, message: str, timeout_seconds: float) -> str:
    data = json.dumps({"message": message}).encode("utf-8")
    req = urllib.request.Request(
        url=OPENCLAW_URL,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    if timeout_seconds <= 0:
        response_ctx = urllib.request.urlopen(req)
    else:
        response_ctx = urllib.request.urlopen(req, timeout=timeout_seconds)
    with response_ctx as response:
        return response.read().decode("utf-8", errors="replace")


def _should_retry_http_error(code: int, body: str) -> bool:
    text = body.lower()
    return code in {408, 429, 500, 502, 503, 504} and (
        "timeout" in text or "timed out" in text or "tempor" in text or code in {502, 503, 504, 429}
    )


def _should_retry_url_error(reason: object) -> bool:
    return "timed out" in str(reason).lower()


def _try_parse_json(text: str) -> Optional[Dict[str, Any]]:
    try:
        value = json.loads(text)
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, dict) else None


def _extract_nested_text(value: Optional[Dict[str, Any]]) -> str:
    if not isinstance(value, dict):
        return ""
    for key in ("response", "content", "message", "answer", "reply"):
        nested = value.get(key)
        if isinstance(nested, str) and nested.strip():
            return nested
    return ""


def _is_n8n_workflow(value: Optional[Dict[str, Any]]) -> bool:
    if not isinstance(value, dict):
        return False
    return isinstance(value.get("nodes"), list) and isinstance(value.get("connections"), dict)


def _extract_workflow_json(text: str) -> Optional[Dict[str, Any]]:
    direct = _try_parse_json(text)
    if _is_n8n_workflow(direct):
        return direct

    nested_text = _extract_nested_text(direct)
    if nested_text:
        nested = _try_parse_json(nested_text)
        if _is_n8n_workflow(nested):
            return nested

    fenced = re.findall(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    for candidate in fenced:
        parsed = _try_parse_json(candidate)
        if _is_n8n_workflow(parsed):
            return parsed

    return None


def _format_json_block(value: Dict[str, Any]) -> str:
    return f"```json\n{json.dumps(value, indent=2, ensure_ascii=False)}\n```"


def _format_last_reply_for_chat(last_reply: str) -> str:
    workflow = _extract_workflow_json(last_reply)
    if workflow is not None:
        return _format_json_block(workflow)

    direct = _try_parse_json(last_reply)
    nested_text = _extract_nested_text(direct)
    if nested_text:
        nested_json = _try_parse_json(nested_text)
        if nested_json is not None:
            return _format_json_block(nested_json)
        return f"```text\n{nested_text}\n```"

    if direct is not None:
        return _format_json_block(direct)
    return f"```text\n{last_reply}\n```"


def _build_round_prompt(user_requirement: str, round_idx: int, previous_reply: Optional[str]) -> str:
    if round_idx == 1:
        return (
            f"{BUDDY_SYSTEM_PROMPT}\n\n"
            "User-Anforderung:\n"
            f"{user_requirement}\n\n"
            "Liefere ein getestetes, funktionsfaehiges n8n-Workflow-JSON."
        )
    return (
        f"{BUDDY_SYSTEM_PROMPT}\n\n"
        f"Runde {round_idx} von {MAX_ROUNDS}.\n"
        "Das letzte Ergebnis war nicht als gueltiges n8n-Workflow-JSON verwendbar.\n"
        "Debugge und verbessere den Workflow. Liefere ein vollstaendiges, importierbares n8n-Workflow-JSON.\n\n"
        "Letzte OpenClaw-Antwort:\n"
        f"{previous_reply or ''}"
    )


def _send_with_retries(
    token: str,
    prompt: str,
    round_idx: int,
    settings: BuddySettings,
    on_progress: Optional[Callable[[str], None]] = None,
) -> Tuple[Optional[str], Optional[str]]:
    max_attempts = None if settings.retry_forever_on_timeout else max(1, settings.timeout_retries + 1)
    last_error = ""
    attempt = 0
    while True:
        attempt += 1
        attempt_label = f"{attempt}" if max_attempts is None else f"{attempt}/{max_attempts}"
        if on_progress:
            on_progress(f"Runde {round_idx}: Attempt {attempt_label} gestartet.")
        _append_comm_log(
            {
                "direction": "buddy_to_openclaw",
                "round": round_idx,
                "attempt": attempt,
                "url": OPENCLAW_URL,
                "prompt": prompt,
            }
        )
        try:
            reply = _call_openclaw(token=token, message=prompt, timeout_seconds=settings.timeout_seconds)
            _append_comm_log(
                {
                    "direction": "openclaw_to_buddy",
                    "round": round_idx,
                    "attempt": attempt,
                    "reply": reply,
                }
            )
            if on_progress:
                on_progress(f"Runde {round_idx}: Antwort erhalten (Attempt {attempt}).")
            return reply, None
        except urllib.error.HTTPError as err:
            body = err.read().decode("utf-8", errors="replace")
            _append_comm_log(
                {
                    "direction": "openclaw_error_to_buddy",
                    "round": round_idx,
                    "attempt": attempt,
                    "error_type": "HTTPError",
                    "status_code": err.code,
                    "body": body,
                }
            )
            last_error = f"OpenClaw HTTP-Fehler {err.code}: {body}"
            if on_progress:
                on_progress(f"Runde {round_idx}: HTTP-Fehler {err.code} in Attempt {attempt}.")
            retryable = _should_retry_http_error(err.code, body)
            if retryable and (max_attempts is None or attempt < max_attempts):
                if on_progress:
                    on_progress(
                        f"Runde {round_idx}: Timeout/temporärer Fehler erkannt, Retry nach {settings.retry_delay_seconds}s."
                    )
                time.sleep(settings.retry_delay_seconds)
                continue
            return None, last_error
        except urllib.error.URLError as err:
            _append_comm_log(
                {
                    "direction": "openclaw_error_to_buddy",
                    "round": round_idx,
                    "attempt": attempt,
                    "error_type": "URLError",
                    "reason": str(err.reason),
                }
            )
            last_error = f"OpenClaw Verbindungsfehler: {err.reason}"
            if on_progress:
                on_progress(f"Runde {round_idx}: Verbindungsfehler in Attempt {attempt}: {err.reason}")
            retryable = _should_retry_url_error(err.reason)
            if retryable and (max_attempts is None or attempt < max_attempts):
                if on_progress:
                    on_progress(
                        f"Runde {round_idx}: Netzwerk-Timeout erkannt, Retry nach {settings.retry_delay_seconds}s."
                    )
                time.sleep(settings.retry_delay_seconds)
                continue
            return None, last_error
        except Exception as err:  # noqa: BLE001
            _append_comm_log(
                {
                    "direction": "openclaw_error_to_buddy",
                    "round": round_idx,
                    "attempt": attempt,
                    "error_type": "Exception",
                    "reason": str(err),
                }
            )
            if on_progress:
                on_progress(f"Runde {round_idx}: Unerwarteter Fehler in Attempt {attempt}: {err}")
            return None, f"Unerwarteter OpenClaw-Fehler: {err}"


class BuddyProxy:
    def run(self, user_requirement: str, on_progress: Optional[Callable[[str], None]] = None) -> BuddyResult:
        token = _get_token()
        settings = _get_settings()
        last_reply = ""
        trace: List[str] = []

        def _trace(msg: str) -> None:
            trace.append(msg)
            if on_progress:
                on_progress(msg)

        _trace(
            "Konfiguration: "
            f"client_timeout={'aus' if settings.timeout_seconds <= 0 else settings.timeout_seconds}s, "
            f"retry_forever_on_timeout={settings.retry_forever_on_timeout}, "
            f"retry_delay={settings.retry_delay_seconds}s"
        )

        for round_idx in range(1, MAX_ROUNDS + 1):
            _trace(f"Starte Runde {round_idx}/{MAX_ROUNDS}.")
            prompt = _build_round_prompt(
                user_requirement=user_requirement,
                round_idx=round_idx,
                previous_reply=last_reply if round_idx > 1 else None,
            )
            reply, send_error = _send_with_retries(
                token=token,
                prompt=prompt,
                round_idx=round_idx,
                settings=settings,
                on_progress=_trace,
            )
            if send_error:
                return BuddyResult(
                    success=False,
                    rounds_used=round_idx,
                    message=(
                        f"{send_error}\n\n"
                        "Agent-Log:\n"
                        f"```text\n" + "\n".join(trace) + "\n```\n\n"
                        f"Kommunikationslog: {COMM_LOG_PATH}"
                    ),
                    trace=trace,
                )

            last_reply = reply or ""
            workflow_json = _extract_workflow_json(last_reply)
            if workflow_json is not None:
                _trace(f"Runde {round_idx}: Gueltiges n8n-Workflow-JSON erkannt.")
                return BuddyResult(
                    success=True,
                    rounds_used=round_idx,
                    message=(
                        f"Buddy hat nach {round_idx}/{MAX_ROUNDS} Runden ein n8n-Workflow-JSON erhalten:\n\n"
                        f"{_format_json_block(workflow_json)}\n\n"
                        "Agent-Log:\n"
                        f"```text\n" + "\n".join(trace) + "\n```\n\n"
                        f"Kommunikationslog: {COMM_LOG_PATH}"
                    ),
                    workflow_json=workflow_json,
                    trace=trace,
                )

            _trace(f"Runde {round_idx}: Kein gueltiges n8n-Workflow-JSON, naechste Runde.")

        _trace("Hardlimit erreicht. Antworte mit letzter OpenClaw-Antwort.")
        return BuddyResult(
            success=False,
            rounds_used=MAX_ROUNDS,
            message=(
                f"Buddy hat das Hardlimit von {MAX_ROUNDS} Runden erreicht.\n\n"
                "Letzte OpenClaw-Antwort:\n"
                f"{_format_last_reply_for_chat(last_reply)}\n\n"
                "Agent-Log:\n"
                f"```text\n" + "\n".join(trace) + "\n```\n\n"
                f"Kommunikationslog: {COMM_LOG_PATH}"
            ),
            trace=trace,
        )
