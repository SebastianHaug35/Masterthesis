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

from llm_providers import OpenAILLM

OPENCLAW_DEFAULT_BASE_URL = "http://72.61.136.246:8080"
OPENCLAW_MODEL = os.getenv("OPENCLAW_MODEL", "openai/gpt-5.2")
MAX_ROUNDS = 3
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_COMM_LOG_PATH = PROJECT_ROOT / "artifacts" / "logs" / "buddy_openclaw_traffic.jsonl"
COMM_LOG_PATH = Path(os.getenv("BUDDY_OPENCLAW_LOG_PATH", str(DEFAULT_COMM_LOG_PATH)))

N8N_DB_CONTEXT_PROMPT = """
Beachte folgenden bestehenden Chatverlauf als feste System-Information zur Zielumgebung:

Du hast recht: es gibt bereits die Datenbank (/data/.n8n/database.sqlite). Workflows werden dort gespeichert - man "legt" sie nicht in einen Ordner, sondern importiert sie in die DB.

Ich hab's jetzt genau so gemacht:

Workflow-Datei abgelegt unter:
/data/.n8n/workflows/email-checker.json
Dann per CLI in die bestehende n8n-DB importiert (mit N8N_USER_FOLDER=/data)
Verifikation:

n8n list:workflow zeigt jetzt:
a91eff4d-36b6-4a98-b6de-f9a466ce4a58|email-checker
Falls du es "genau als Anleitung" willst (fuer's naechste Mal)
Datei speichern:
mkdir -p /data/.n8n/workflows
nano /data/.n8n/workflows/email-checker.json
Wichtig: Fuer CLI-Import braucht der JSON-Workflow ein "id" Feld (UUID reicht). Dann import:
N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n import:workflow --input=/data/.n8n/workflows/email-checker.json
Check:
N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n list:workflow | grep -i email-checker
Wenn du die UI neu laedst, sollte der Workflow jetzt im n8n Editor auftauchen.

Leite daraus folgende Regeln fuer alle Antworten ab:
- Die bestehende n8n-Datenbank unter /data/.n8n/database.sqlite ist die massgebliche Zielumgebung.
- Ein Workflow gilt idealerweise erst dann als erstellt, wenn er in die bestehende n8n-DB importiert wurde.
- Wenn du Workflow-JSON zurueckgibst, achte darauf, dass ein importierbares "id"-Feld vorhanden ist.
- Wenn die tatsaechliche Erstellung in n8n nicht sicher bestaetigt werden kann, benenne das klar und liefere trotzdem das bestmoegliche importierbare Workflow-JSON.
""".strip()

BUDDY_SYSTEM_PROMPT = """
Du bist Buddy, ein lokaler Proxy-Agent.
Deine Aufgabe:
1) Nimm die Anforderung des Users entgegen.
2) Beauftrage die OpenClaw-Instanz damit, den Workflow in der n8n-Instanz zu erstellen.
3) Gib klar vor, dass idealerweise ein moeglichst schnell testbarer n8n-Workflow entstehen soll.
4) Verlange, dass OpenClaw uns das n8n-Workflow-JSON erst nach der Erstellung in der n8n-Instanz zurueckgibt.
5) Das Testing ist nachrangig, aber der Workflow soll so aufgebaut sein, dass er auf der n8n-Instanz ausfuehrbar ist.
6) Wenn etwas unklar bleibt oder die Erstellung nicht vollstaendig gelingt, antworte trotzdem mit dem bestmoeglichen Ergebnis.

Wichtig:
- Es ist sehr wichtig, dass der Workflow auf der n8n-Instanz tatsaechlich erstellt wird und erst danach das JSON zurueckgegeben wird.
- Ideal ist als Ergebnis direkt ein vollstaendiges n8n-Workflow-JSON.
- Wenn OpenClaw kein vollstaendiges JSON liefern kann, akzeptiere auch eine erklaerende Antwort, einen unvollstaendigen Entwurf oder eine Fehlermeldung und gib diese an den User weiter.
- Der Workflow soll so modelliert sein, dass er auf der n8n-Instanz ausfuehrbar ist und mit moeglichst wenig Vorarbeit verwendet werden kann.
- Verwende fuer externe Systeme, APIs, Datenbanken, Dateiquellen, Webhooks und sonstige Integrationen nach Moeglichkeit klar erkennbare Platzhalter.
- Nutze fuer externe Aufrufe bevorzugt Placeholder-URLs, Mock-Daten oder vereinfachte HTTP-Request-Knoten, damit der Workflow ohne echte Fremdsysteme schnell testbar bleibt.
- Stelle die gewuenschte Zielrichtung klar dar, aber antworte nach genau einer Anfrage an OpenClaw mit dessen Ergebnis.
- Im Idealfall besteht die Antwort nur aus dem n8n-JSON.
""".strip()

BUDDY_AGENT_SYSTEM_PROMPT = """
Verarbeite die aktuelle User-Anforderung, indem du unter Verwendung des n8n-Skills (n8n-workflow-automation) einen neuen oder geänderten n8n Workflow entwirfst und ihn in erster Linie wirklich in der laufenden n8n-Instanz persistierst (nicht nur als Text/JSON generieren); danach gib uns das vollständige n8n-Workflow-JSON zurück (importierbar und auf der Instanz ausführbar). Gehe dabei von folgendem Persistenz-/Speichermodell aus und wende es korrekt an: Es gibt bereits die n8n Datenbank unter /data/.n8n/database.sqlite; Workflows werden in dieser DB gespeichert und nicht dadurch “automatisch” verfügbar, dass man irgendwo eine Datei ablegt. Eine Workflow-Datei (z.B. /data/.n8n/workflows/<workflow-name>.json) ist optional als Ablage/Backup/Versionierung, aber damit der Workflow in der UI erscheint und in n8n wirklich existiert, muss er in die DB importiert/erstellt werden. Verwende dafür den korrekten User-Folder-Kontext N8N_USER_FOLDER=/data (damit n8n die DB unter /data/.n8n verwendet); starte oder prüfe n8n nur in diesem Kontext. Wenn du den Workflow per CLI importierst, stelle sicher, dass das Workflow-JSON ein "id" Feld enthält (UUID oder bestehende ID), da der CLI-Import sonst mit SQLITE_CONSTRAINT (NOT NULL constraint failed: workflow_entity.id) fehlschlagen kann. Nutze für externe Systeme Platzhalter/Mock-Daten/Placeholder-URLs und füge keine Secrets ein. Implementiere nach Möglichkeit robuste Defaults (Trigger, Logging/Run-ID, Idempotency/Dedup, Error-Handling, Review-Queue/Human-in-the-loop), damit der Workflow nicht stillschweigend fehlschlägt. Dokumentiere und benutze in deiner Ausführung diese exakten Ablage-/Import-Schritte (mit an die konkrete Anforderung angepasstem Dateinamen): 1) mkdir -p /data/.n8n/workflows 2) Workflow-JSON nach /data/.n8n/workflows/<name>.json schreiben (inkl. "id": "<uuid>") 3) Import in die bestehende DB: N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n import:workflow --input=/data/.n8n/workflows/<name>.json 4) Verifikation: N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n list:workflow | grep -i "<name>". Wenn du es nicht vollständig schaffst (z.B. Import/Save scheitert), gib trotzdem das bestmögliche Ergebnis zurück: das Workflow-JSON (mit id), die exakten Commands, und die konkrete Fehlermeldung/Statusausgabe.
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


SERVICE_REQUIREMENTS: Dict[str, List[str]] = {
    "slack": ["slack bot token", "channel id"],
    "gmail": ["google account credential", "oauth client id/client secret"],
    "google sheets": ["google account credential", "spreadsheet id"],
    "notion": ["notion integration token", "database id"],
    "postgres": ["host", "database", "user", "password"],
    "mysql": ["host", "database", "user", "password"],
    "supabase": ["supabase url", "service key oder anon key"],
    "jira": ["jira base url", "email/user", "api token"],
    "telegram": ["bot token", "chat id"],
    "discord": ["bot token oder webhook url"],
    "hubspot": ["private app token"],
    "shopify": ["shop domain", "admin api token"],
}

GENERIC_CREDENTIAL_HINTS = [
    "api key",
    "token",
    "client secret",
    "client id",
    "username",
    "password",
    "webhook",
    "base url",
]


def _append_comm_log(event: Dict[str, Any]) -> None:
    payload = {"ts_utc": datetime.now(timezone.utc).isoformat(), **event}
    COMM_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with COMM_LOG_PATH.open("a", encoding="utf-8") as file:
        file.write(json.dumps(payload, ensure_ascii=False) + "\n")


def _append_llm_instruction_log(user_requirement: str, instruction: str) -> None:
    _append_comm_log(
        {
            "direction": "buddy_llm_to_openclaw_instruction",
            "user_requirement": user_requirement,
            "instruction": instruction,
        }
    )


def _load_env_file(filepath: str = ".env") -> None:
    env_path = Path(filepath)
    if not env_path.is_absolute():
        env_path = PROJECT_ROOT / filepath
    if not env_path.exists():
        return
    with env_path.open("r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip().strip('"').strip("'")


def _get_token() -> str:
    load_dotenv(override=False)
    _load_env_file(".env")
    token = os.getenv("OPENCLAW_TOKEN") or os.getenv("TOKEN") or os.getenv("API_TOKEN") or os.getenv("BEARER_TOKEN")
    if not token:
        raise RuntimeError("Kein Token gefunden. Bitte OPENCLAW_TOKEN/TOKEN/API_TOKEN/BEARER_TOKEN in .env setzen.")
    return token


def _get_openclaw_base_url() -> str:
    configured = (os.getenv("OPENCLAW_BASE_URL") or os.getenv("OPENCLAW_URL") or OPENCLAW_DEFAULT_BASE_URL).strip()
    if configured.endswith("/v1/chat/completions"):
        configured = configured[: -len("/v1/chat/completions")]
    elif configured.endswith("/chat"):
        configured = configured[: -len("/chat")]
    return configured.rstrip("/")


def _get_openclaw_chat_url() -> str:
    return f"{_get_openclaw_base_url()}/v1/chat/completions"


def _get_settings() -> BuddySettings:
    timeout_seconds = float(os.getenv("OPENCLAW_HTTP_TIMEOUT_SECONDS", "300"))
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
    data = json.dumps(
        {
            "model": OPENCLAW_MODEL,
            "messages": [{"role": "user", "content": message}],
            "stream": False,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        url=_get_openclaw_chat_url(),
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
        raw_body = response.read().decode("utf-8", errors="replace")

    parsed = _try_parse_json(raw_body)
    if parsed is None:
        raise RuntimeError(f"OpenClaw lieferte kein gueltiges JSON: {raw_body}")

    choices = parsed.get("choices")
    if not isinstance(choices, list) or not choices:
        raise RuntimeError(f"OpenClaw-Antwort enthaelt keine choices: {raw_body}")

    first_choice = choices[0]
    if not isinstance(first_choice, dict):
        raise RuntimeError(f"OpenClaw-Antwort hat ungueltige choice-Daten: {raw_body}")

    message_obj = first_choice.get("message")
    if not isinstance(message_obj, dict):
        raise RuntimeError(f"OpenClaw-Antwort enthaelt keine message: {raw_body}")

    content = message_obj.get("content")
    if isinstance(content, str) and content.strip():
        return content

    raise RuntimeError(f"OpenClaw-Antwort enthaelt keinen nutzbaren message.content: {raw_body}")


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


def _build_request_prompt(user_requirement: str) -> str:
    return (
        "OpenClaw, erstelle den angeforderten n8n-Workflow in erster Linie wirklich in der n8n-Instanz und gib uns danach das n8n-Workflow-JSON zurueck.\n\n"
        "Anforderungen:\n"
        "- Der Workflow soll auf der n8n-Instanz ausfuehrbar sein.\n"
        "- Die bestehende n8n-Datenbank unter /data/.n8n/database.sqlite ist die Zielumgebung.\n"
        "- Der Workflow soll idealerweise in diese bestehende n8n-Datenbank importiert/erstellt werden.\n"
        '- Das zurueckgegebene Workflow-JSON soll ein importierbares "id"-Feld enthalten.\n'
        "- Fuer externe Systeme sollen nach Moeglichkeit klar erkennbare Platzhalter, Mock-Daten oder Placeholder-URLs verwendet werden.\n"
        "- Wenn die tatsaechliche Erstellung in n8n nicht sicher bestaetigt werden kann, benenne das klar und liefere trotzdem das bestmoegliche importierbare Ergebnis.\n"
        "- Wenn du kein vollstaendiges JSON liefern kannst, gib trotzdem das bestmoegliche Ergebnis zurueck.\n"
        "- Im Idealfall besteht die Antwort nur aus dem n8n-Workflow-JSON.\n\n"
        "Fester Kontext zur Zielumgebung:\n"
        f"{N8N_DB_CONTEXT_PROMPT}\n\n"
        "User-Anforderung:\n"
        f"{user_requirement}"
    )


def _build_openclaw_instruction(user_requirement: str) -> str:
    llm = OpenAILLM()
    instruction = llm.generate(
        BUDDY_AGENT_SYSTEM_PROMPT,
        [
            {
                "role": "user",
                "content": (
                    "Formuliere daraus genau eine Arbeitsanweisung fuer OpenClaw.\n\n"
                    f"{_build_request_prompt(user_requirement)}"
                ),
            }
        ],
    ).strip()
    return instruction or _build_request_prompt(user_requirement)


def _build_context_block(context_docs: Optional[List[Dict[str, str]]]) -> str:
    if not context_docs:
        return "Kein Dateikontext vorhanden."
    parts: List[str] = []
    for doc in context_docs:
        name = doc.get("name", "unknown")
        content = doc.get("content", "")
        parts.append(f"[DATEI: {name}]\n{content}")
    return "\n\n".join(parts)


def _collect_missing_data_questions(user_requirement: str, context_docs: Optional[List[Dict[str, str]]]) -> List[str]:
    context_text = " ".join((doc.get("content", "") for doc in (context_docs or [])))
    haystack = f"{user_requirement}\n{context_text}".lower()
    questions: List[str] = []

    matched_services = [service for service in SERVICE_REQUIREMENTS if service in haystack]
    for service in matched_services:
        required = SERVICE_REQUIREMENTS[service]
        missing = [item for item in required if item.lower() not in haystack]
        if missing:
            questions.append(f"Fuer {service}: Bitte liefere {', '.join(missing)}.")

    has_any_cred_signal = any(hint in haystack for hint in GENERIC_CREDENTIAL_HINTS)
    if matched_services and not has_any_cred_signal:
        questions.append(
            "Welche Credentials sollen genutzt werden (API-Key/Token/OAuth/Webhook), "
            "und sind diese bereits in n8n Credentials hinterlegt?"
        )

    return questions


def _send_with_retries(
    token: str,
    prompt: str,
    round_idx: int,
    settings: BuddySettings,
    on_progress: Optional[Callable[[str], None]] = None,
) -> Tuple[Optional[str], Optional[str]]:
    max_attempts = 1
    last_error = ""
    attempt = 0
    while True:
        attempt += 1
        attempt_label = f"{attempt}/{max_attempts}"
        if on_progress:
            on_progress(f"Runde {round_idx}: Attempt {attempt_label} gestartet.")
        _append_comm_log(
            {
                "direction": "buddy_to_openclaw",
                "round": round_idx,
                "attempt": attempt,
                "url": _get_openclaw_chat_url(),
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
                        f"Runde {round_idx}: Timeout/temporÃ¤rer Fehler erkannt, Retry nach {settings.retry_delay_seconds}s."
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
    def run(
        self,
        user_requirement: str,
        context_docs: Optional[List[Dict[str, str]]] = None,
        on_progress: Optional[Callable[[str], None]] = None,
    ) -> BuddyResult:
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
            f"openclaw_url={_get_openclaw_chat_url()}, "
            f"openclaw_model={OPENCLAW_MODEL}, "
            f"client_timeout={'aus' if settings.timeout_seconds <= 0 else settings.timeout_seconds}s, "
            f"retry_forever_on_timeout={settings.retry_forever_on_timeout}, "
            f"retry_delay={settings.retry_delay_seconds}s"
        )
        if context_docs:
            _trace(f"Kontextdateien aktiv: {len(context_docs)}")

        missing_questions = _collect_missing_data_questions(user_requirement, context_docs)
        if missing_questions:
            _trace("Preflight: fehlende Daten/Credentials erkannt, Anfrage wird trotzdem an OpenClaw gesendet.")

        full_requirement = (
            f"{user_requirement}\n\n"
            "Dateikontext:\n"
            f"{_build_context_block(context_docs)}"
        )
        _trace("Buddy-LLM-Agent formuliert die Anweisung fuer OpenClaw.")
        try:
            prompt = _build_openclaw_instruction(user_requirement=full_requirement)
        except Exception as err:  # noqa: BLE001
            _trace(f"Buddy-LLM-Agent fehlgeschlagen, nutze Fallback-Prompt: {err}")
            prompt = _build_request_prompt(full_requirement)
        if not prompt.strip():
            _trace("Buddy-LLM-Agent lieferte leeren Prompt, nutze Fallback-Prompt.")
            prompt = _build_request_prompt(full_requirement)
        _append_llm_instruction_log(full_requirement, prompt)
        _trace("Buddy-LLM-Agent-Befehl an OpenClaw wurde ins Kommunikationslog geschrieben.")
        _trace("Starte Einzelanfrage an OpenClaw.")
        reply, send_error = _send_with_retries(
            token=token,
            prompt=prompt,
            round_idx=1,
            settings=settings,
            on_progress=_trace,
        )
        if send_error:
            return BuddyResult(
                success=False,
                rounds_used=1,
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
            _trace("Einzelanfrage: n8n-Workflow-JSON erkannt.")
            return BuddyResult(
                success=True,
                rounds_used=1,
                message=_format_json_block(workflow_json),
                workflow_json=workflow_json,
                trace=trace,
            )

        _trace("Einzelanfrage: Antwort ist kein gueltiges n8n-Workflow-JSON, wird aber akzeptiert.")
        return BuddyResult(
            success=True,
            rounds_used=1,
            message=_format_last_reply_for_chat(last_reply),
            trace=trace,
        )
