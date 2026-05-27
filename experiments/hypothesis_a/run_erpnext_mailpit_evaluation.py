"""Run repeated ERPNext/Mailpit workflow-generation evaluations for Hypothesis A.

The evaluation varies the generated n8n workflow while keeping the test systems
and input contract stable. Each run stores enough evidence to inspect what
happened before and after triggering the workflow.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import time
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESS_ID = "account_payable_process_0"
DEFAULT_RUNS = 20
DEFAULT_OUTPUT_ROOT = PROJECT_ROOT / "artifacts" / "hypothesis_a" / "evaluations"
PROCESS_DIR = PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "processes" / PROCESS_ID
TEST_CASE_FILE = PROCESS_DIR / "account_payable_process_0_erpnext_mailpit_test_case.json"
TEST_SETUP_FILE = PROCESS_DIR / "account_payable_process_0_first_workflow_test_setup.json"
SYSTEM_CONTRACT = PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "account_payable_process_0_system_contract.md"
REUSABLE_EXECUTION_CONTRACT = (
    PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "reusable_workflow_execution_contract.md"
)
GENERATED_DIR = PROJECT_ROOT / "artifacts" / "hypothesis_a" / "generated_workflows" / PROCESS_ID
N8N_CONTAINER = "openclaw-0txg-openclaw-1"
N8N_BASE_URL = "http://127.0.0.1:8070"
MAILPIT_API = "http://127.0.0.1:8077"
EXPECTED_OUTPUT = {
    "case_id": "AP-2026-0001",
    "workflow_status": "completed",
    "stamp_status": "stamped",
    "archive_location": "erpnext://account-payable/AP-2026-0001",
    "erpnext_purchase_invoice_bill_no": "INV-98451",
    "notification_email_sent": True,
}
TRIGGER_PAYLOAD = {
    "process_id": PROCESS_ID,
    "test_case_id": "account_payable_process_0_erpnext_mailpit_happy_path",
    "input_payload": {
        "case_id": "AP-2026-0001",
        "po_number": "PO-4500012458",
        "receiving_report_id": "GR-2026-00441",
        "invoice_number": "INV-98451",
        "mailpit_message_id": "ap-2026-0001-invoice@test.local",
    },
}

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_n8n_workflow import (  # noqa: E402
    DEFAULT_ENV_FILES,
    call_openai,
    extract_json_object,
    load_env_files,
    read_json,
    read_text,
    validate_n8n_workflow,
    write_json,
    build_user_prompt,
)
from prepare_erpnext_mailpit_fixture import FrappeClient  # noqa: E402


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def run_cmd(args: list[str], timeout: int = 120) -> dict[str, Any]:
    started = time.perf_counter()
    proc = subprocess.run(
        args,
        cwd=PROJECT_ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        timeout=timeout,
        check=False,
    )
    return {
        "cmd": args,
        "returncode": proc.returncode,
        "stdout": proc.stdout,
        "stderr": proc.stderr,
        "duration_ms": round((time.perf_counter() - started) * 1000),
    }


def http_json(method: str, url: str, body: dict[str, Any] | None = None, timeout: int = 60) -> tuple[int, Any]:
    data = None
    headers = {"Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = Request(url, data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except HTTPError as exc:
        raw = exc.read().decode("utf-8")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = raw
        return exc.code, payload
    except URLError as exc:
        return 0, {"error": str(exc.reason)}


def mailpit_snapshot() -> dict[str, Any]:
    status, payload = http_json("GET", f"{MAILPIT_API}/api/v1/messages?limit=200")
    messages = payload.get("messages", []) if isinstance(payload, dict) else []
    return {
        "status": status,
        "total": payload.get("total") if isinstance(payload, dict) else None,
        "messages_count": len(messages),
        "relevant_messages": [
            {
                "id": message.get("ID"),
                "message_id": message.get("MessageID"),
                "from": (message.get("From") or {}).get("Address"),
                "to": [item.get("Address") for item in message.get("To", [])],
                "subject": message.get("Subject"),
                "created": message.get("Created"),
                "snippet": message.get("Snippet"),
            }
            for message in messages
            if any(
                token in (message.get("Subject") or "") or token in (message.get("Snippet") or "")
                for token in ["AP-2026-0001", "PO-4500012458", "INV-98451", "HYP-A"]
            )
        ],
    }


def erpnext_snapshot() -> dict[str, Any]:
    client = FrappeClient("http://127.0.0.1:8076", "Administrator", "admin")
    try:
        client.login()
        purchase_order = client.find_doc_by_filters(
            "Purchase Order",
            [["Purchase Order", "supplier", "=", "Meyer Industrietechnik GmbH"]],
        )
        purchase_receipt = client.find_doc_by_filters(
            "Purchase Receipt",
            [["Purchase Receipt", "supplier", "=", "Meyer Industrietechnik GmbH"]],
        )
        purchase_invoice = client.find_doc("Purchase Invoice", "bill_no", "INV-98451")
        return {
            "reachable": True,
            "purchase_order": compact_doc(purchase_order),
            "purchase_receipt": compact_doc(purchase_receipt),
            "purchase_invoice": compact_doc(purchase_invoice),
        }
    except Exception as exc:  # noqa: BLE001
        return {"reachable": False, "error": str(exc)}


def compact_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if not doc:
        return None
    keys = [
        "name",
        "doctype",
        "docstatus",
        "supplier",
        "company",
        "transaction_date",
        "posting_date",
        "bill_no",
        "grand_total",
        "net_total",
        "currency",
        "modified",
    ]
    return {key: doc.get(key) for key in keys if key in doc}


def patch_workflow(workflow: dict[str, Any], workflow_id: str, run_label: str) -> dict[str, Any]:
    patched = deepcopy(workflow)
    patched["id"] = workflow_id
    patched["name"] = f"{PROCESS_ID}_{run_label}"
    patched["active"] = False
    patched["versionId"] = f"{workflow_id}version"
    for node in patched.get("nodes", []):
        if not isinstance(node, dict):
            continue
        if node.get("type") == "n8n-nodes-base.webhook":
            node.setdefault("parameters", {})
            node["parameters"]["httpMethod"] = "POST"
            node["parameters"]["path"] = f"{PROCESS_ID}/{run_label.lower()}"
            node["parameters"]["responseMode"] = "responseNode"
    return patched


def generate_workflow(run_dir: Path, run_label: str, model: str) -> dict[str, Any]:
    load_env_files(DEFAULT_ENV_FILES)
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return {"ok": False, "error": "OPENAI_API_KEY missing"}

    process_md = next(PROCESS_DIR.glob("*.md"))
    test_cases = read_json(TEST_CASE_FILE)
    system_prompt = read_text(PROJECT_ROOT / "prompts" / "hypothesis_a" / "n8n_workflow_generator_system.txt")
    user_prompt = build_user_prompt(
        process_id=PROCESS_ID,
        process_description=read_text(process_md),
        test_cases=test_cases,
        system_landscape=read_json(PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "system_landscape.json"),
        reusable_execution_contract=read_text(REUSABLE_EXECUTION_CONTRACT),
        system_contract=read_text(SYSTEM_CONTRACT),
        test_setup=read_json(TEST_SETUP_FILE),
    )
    prompt_bundle = {
        "run_label": run_label,
        "model": model,
        "system_prompt": system_prompt,
        "user_prompt": user_prompt,
    }
    write_json(run_dir / "generation_prompt.json", prompt_bundle)

    started = time.perf_counter()
    try:
        raw = call_openai(system_prompt, user_prompt, model, api_key)
        workflow = extract_json_object(raw)
        failures = validate_n8n_workflow(workflow)
        write_json(run_dir / "workflow_raw.json", workflow)
        return {
            "ok": not failures,
            "duration_ms": round((time.perf_counter() - started) * 1000),
            "validation_failures": failures,
            "workflow": workflow,
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "ok": False,
            "duration_ms": round((time.perf_counter() - started) * 1000),
            "error": str(exc),
        }


def import_and_publish(workflow_path: Path, workflow_id: str) -> dict[str, Any]:
    copy_result = run_cmd(
        [
            "docker",
            "cp",
            str(workflow_path),
            f"{N8N_CONTAINER}:/tmp/{workflow_id}.json",
        ],
        timeout=60,
    )
    if copy_result["returncode"] != 0:
        return {"ok": False, "copy": copy_result}

    import_result = run_cmd(
        [
            "docker",
            "exec",
            "-u",
            "node",
            N8N_CONTAINER,
            "sh",
            "-lc",
            (
                "export N8N_USER_FOLDER=/data; "
                "export N8N_DIAGNOSTICS_ENABLED=false; "
                f"/data/.npm-global/bin/n8n import:workflow --input=/tmp/{workflow_id}.json"
            ),
        ],
        timeout=120,
    )
    publish_result = None
    if import_result["returncode"] == 0:
        publish_result = run_cmd(
            [
                "docker",
                "exec",
                "-u",
                "node",
                N8N_CONTAINER,
                "sh",
                "-lc",
                (
                    "export N8N_USER_FOLDER=/data; "
                    "export N8N_DIAGNOSTICS_ENABLED=false; "
                    f"/data/.npm-global/bin/n8n publish:workflow --id={workflow_id}"
                ),
            ],
            timeout=120,
        )
    return {
        "ok": import_result["returncode"] == 0 and publish_result and publish_result["returncode"] == 0,
        "copy": copy_result,
        "import": import_result,
        "publish": publish_result,
    }


def restart_n8n() -> dict[str, Any]:
    return run_cmd(["scripts/dev/n8n-openclaw-start.sh", N8N_CONTAINER], timeout=120)


def copy_n8n_db(batch_dir: Path) -> Path:
    db_dir = batch_dir / "n8n_db_snapshot"
    db_dir.mkdir(parents=True, exist_ok=True)
    base = db_dir / "database.sqlite"
    run_cmd(["docker", "cp", f"{N8N_CONTAINER}:/data/.n8n/database.sqlite", str(base)])
    for suffix in ["-wal", "-shm"]:
        run_cmd(["docker", "cp", f"{N8N_CONTAINER}:/data/.n8n/database.sqlite{suffix}", str(base) + suffix])
    return base


def webhook_path_for(db_path: Path, workflow_id: str) -> str | None:
    con = sqlite3.connect(str(db_path))
    try:
        row = con.execute(
            "select webhookPath from webhook_entity where workflowId=? and method='POST'",
            (workflow_id,),
        ).fetchone()
        return row[0] if row else None
    finally:
        con.close()


def trigger_workflow(webhook_path: str) -> dict[str, Any]:
    encoded_path = quote(webhook_path, safe="/")
    url = f"{N8N_BASE_URL}/webhook/{encoded_path}"
    started = time.perf_counter()
    status, payload = http_json("POST", url, TRIGGER_PAYLOAD, timeout=120)
    return {
        "url": url,
        "status": status,
        "duration_ms": round((time.perf_counter() - started) * 1000),
        "response": payload,
    }


def response_matches_expected(response: Any) -> bool:
    if isinstance(response, dict) and "output" in response:
        response = response["output"]
    if not isinstance(response, dict):
        return False
    return all(response.get(key) == value for key, value in EXPECTED_OUTPUT.items())


def classify_run(run: dict[str, Any]) -> dict[str, bool]:
    mail_before = run.get("mailpit_before", {})
    mail_after = run.get("mailpit_after", {})
    erp_before = run.get("erpnext_before", {})
    erp_after = run.get("erpnext_after", {})
    trigger = run.get("trigger", {})
    return {
        "generation": bool(run.get("generation", {}).get("ok")),
        "import": bool(run.get("import_publish", {}).get("ok")),
        "activation": bool(run.get("webhook_path")),
        "trigger": trigger.get("status") == 200,
        "expected_response": response_matches_expected(trigger.get("response")),
        "erpnext_before": bool(erp_before.get("purchase_order") and erp_before.get("purchase_receipt")),
        "erpnext_after": bool(erp_after.get("purchase_invoice")),
        "mailpit_before": bool(mail_before.get("relevant_messages")),
        "mailpit_after": len(mail_after.get("relevant_messages", [])) > len(mail_before.get("relevant_messages", [])),
    }


def generate_html(batch: dict[str, Any], html_path: Path) -> None:
    runs = batch["runs"]
    metrics = [
        ("generation", "20x Workflow generieren"),
        ("import", "n8n importieren"),
        ("activation", "n8n Webhook aktiv"),
        ("trigger", "Webhook ausloesen"),
        ("expected_response", "Expected Output"),
        ("erpnext_before", "ERPNext vorher"),
        ("erpnext_after", "ERPNext nachher"),
        ("mailpit_before", "Mailpit vorher"),
        ("mailpit_after", "Mailpit nachher"),
    ]
    metric_rows = []
    for key, label in metrics:
        count = sum(1 for run in runs if run["checks"].get(key))
        pct = round(count / len(runs) * 100) if runs else 0
        metric_rows.append({"key": key, "label": label, "count": count, "pct": pct})

    data_json = json.dumps({"batch": batch, "metrics": metric_rows}, ensure_ascii=False).replace("</", "<\\/")
    html_content = f"""<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Hypothesis A Evaluation {html.escape(batch['batch_id'])}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 0; background: #f8fafc; color: #111827; }}
    header {{ padding: 24px 32px; background: #0f172a; color: white; }}
    h1 {{ margin: 0 0 8px; font-size: 24px; }}
    .sub {{ color: #cbd5e1; }}
    main {{ padding: 24px 32px 48px; }}
    .grid {{ display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 16px; max-width: 1180px; }}
    .node {{ border: 1px solid #cbd5e1; border-radius: 8px; background: white; padding: 16px; position: relative; min-height: 110px; box-shadow: 0 1px 2px rgba(15,23,42,.08); }}
    .node h2 {{ font-size: 16px; margin: 0 0 10px; }}
    .score {{ font-size: 30px; font-weight: 700; }}
    .bar {{ height: 10px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin: 10px 0; }}
    .fill {{ height: 100%; }}
    .hint {{ font-size: 12px; color: #64748b; }}
    .tooltip {{ display: none; position: absolute; left: 10px; top: calc(100% + 8px); width: 520px; max-height: 360px; overflow: auto; background: #111827; color: #f8fafc; padding: 12px; border-radius: 8px; z-index: 20; font-size: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.25); }}
    .node:hover .tooltip {{ display: block; }}
    .tooltip code {{ color: #a7f3d0; }}
    .runs {{ margin-top: 32px; max-width: 1180px; }}
    table {{ border-collapse: collapse; width: 100%; background: white; }}
    th, td {{ padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: left; vertical-align: top; }}
    th {{ background: #f1f5f9; }}
    .ok {{ color: #15803d; font-weight: 700; }}
    .bad {{ color: #b91c1c; font-weight: 700; }}
    .small {{ color: #64748b; font-size: 12px; }}
  </style>
</head>
<body>
  <header>
    <h1>Hypothese A: 20x account_payable_process_0</h1>
    <div class="sub">Batch {html.escape(batch['batch_id'])} - variable Komponente: generierter n8n-Workflow</div>
  </header>
  <main>
    <section class="grid" id="grid"></section>
    <section class="runs">
      <h2>Einzelversuche</h2>
      <table id="runs"></table>
    </section>
  </main>
  <script id="eval-data" type="application/json">{data_json}</script>
  <script>
    const data = JSON.parse(document.getElementById('eval-data').textContent);
    const runs = data.batch.runs;
    const grid = document.getElementById('grid');
    function color(p) {{
      const r = Math.round(220 - p * 1.4);
      const g = Math.round(50 + p * 1.6);
      return `rgb(${{r}}, ${{g}}, 80)`;
    }}
    for (const m of data.metrics) {{
      const node = document.createElement('div');
      node.className = 'node';
      const fill = color(m.pct);
      const details = runs.map(r => {{
        const ok = r.checks[m.key];
        const detail = m.key === 'trigger' ? `HTTP ${{r.trigger?.status ?? 'n/a'}}` :
          m.key === 'generation' ? (r.generation?.error || r.generation?.validation_failures?.join('; ') || 'ok') :
          m.key === 'import' ? (r.import_publish?.import?.stderr || r.import_publish?.import?.stdout || 'ok') :
          m.key === 'activation' ? (r.webhook_path || 'kein webhook') :
          m.key.includes('mailpit') ? `${{r.mailpit_before?.relevant_messages?.length ?? 0}} -> ${{r.mailpit_after?.relevant_messages?.length ?? 0}} relevante Mails` :
          m.key.includes('erpnext') ? JSON.stringify(m.key.endsWith('after') ? r.erpnext_after : r.erpnext_before) :
          JSON.stringify(r.trigger?.response);
        return `<div>${{ok ? '✅' : '❌'}} <code>${{r.run_label}}</code>: ${{detail}}</div>`;
      }}).join('');
      node.innerHTML = `
        <h2>${{m.label}}</h2>
        <div class="score">${{m.count}}/${{runs.length}}</div>
        <div class="bar"><div class="fill" style="width:${{m.pct}}%;background:${{fill}}"></div></div>
        <div class="hint">Hover fuer alle Workflow-Versuche</div>
        <div class="tooltip">${{details}}</div>`;
      grid.appendChild(node);
    }}
    const table = document.getElementById('runs');
    table.innerHTML = '<thead><tr><th>Run</th><th>Workflow</th><th>Webhook</th><th>Response</th><th>ERPNext</th><th>Mailpit</th></tr></thead>' +
      '<tbody>' + runs.map(r => `
        <tr>
          <td><a href="${{r.relative_dir}}/run_report.json">${{r.run_label}}</a></td>
          <td>${{r.checks.generation ? '<span class="ok">generated</span>' : '<span class="bad">failed</span>'}}<br><span class="small">${{r.workflow_id || ''}}</span></td>
          <td>${{r.checks.trigger ? '<span class="ok">HTTP 200</span>' : '<span class="bad">not ok</span>'}}<br><span class="small">${{r.webhook_path || ''}}</span></td>
          <td>${{r.checks.expected_response ? '<span class="ok">expected</span>' : '<span class="bad">unexpected</span>'}}</td>
          <td>PI after: ${{r.erpnext_after?.purchase_invoice?.name || 'none'}}</td>
          <td>${{r.mailpit_before?.relevant_messages?.length ?? 0}} -> ${{r.mailpit_after?.relevant_messages?.length ?? 0}}</td>
        </tr>`).join('') + '</tbody>';
  </script>
</body>
</html>
"""
    html_path.write_text(html_content, encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=DEFAULT_RUNS)
    parser.add_argument("--model", default=os.environ.get("OPENAI_MODEL", "gpt-5.4-mini"))
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--skip-generation", action="store_true", help="Use current workflow_latest for every run.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    batch_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    batch_dir = args.output_root / f"{PROCESS_ID}_{batch_id}"
    runs_dir = batch_dir / "runs"
    runs_dir.mkdir(parents=True, exist_ok=True)

    fixture_result = run_cmd(["scripts/hypothesis-a-prepare-erpnext-mailpit-fixture.sh"], timeout=180)
    write_json(batch_dir / "fixture_prepare.json", fixture_result)

    runs: list[dict[str, Any]] = []
    for index in range(1, args.runs + 1):
        run_label = f"RUN-{index:02d}"
        run_dir = runs_dir / run_label
        run_dir.mkdir(parents=True, exist_ok=True)
        workflow_id = f"hypAproc0{batch_id.replace('_', '')}{index:02d}"
        run: dict[str, Any] = {
            "run_label": run_label,
            "started_at": utc_now(),
            "workflow_id": workflow_id,
            "relative_dir": str(run_dir.relative_to(batch_dir)),
        }

        run["erpnext_before"] = erpnext_snapshot()
        run["mailpit_before"] = mailpit_snapshot()

        if args.skip_generation:
            workflow = read_json(GENERATED_DIR / f"{PROCESS_ID}_workflow_latest.json")
            generation = {"ok": True, "duration_ms": 0, "validation_failures": [], "skipped": True, "workflow": workflow}
        else:
            generation = generate_workflow(run_dir, run_label, args.model)
        workflow = generation.pop("workflow", None)
        run["generation"] = generation

        if workflow:
            patched = patch_workflow(workflow, workflow_id, run_label)
            workflow_path = run_dir / "workflow_import.json"
            write_json(workflow_path, patched)
            run["import_publish"] = import_and_publish(workflow_path, workflow_id)
        else:
            run["import_publish"] = {"ok": False, "error": "No workflow to import"}

        write_json(run_dir / "run_report.partial.json", run)
        runs.append(run)

    restart = restart_n8n()
    write_json(batch_dir / "n8n_restart.json", restart)
    time.sleep(5)
    db_path = copy_n8n_db(batch_dir)

    for run in runs:
        run_dir = batch_dir / run["relative_dir"]
        webhook_path = webhook_path_for(db_path, run["workflow_id"])
        run["webhook_path"] = webhook_path
        if webhook_path:
            run["trigger"] = trigger_workflow(webhook_path)
        else:
            run["trigger"] = {"status": 0, "response": {"error": "No webhook path registered"}}
        run["erpnext_after"] = erpnext_snapshot()
        run["mailpit_after"] = mailpit_snapshot()
        run["checks"] = classify_run(run)
        run["finished_at"] = utc_now()
        write_json(run_dir / "run_report.json", run)

    batch = {
        "batch_id": batch_id,
        "process_id": PROCESS_ID,
        "created_at": utc_now(),
        "fixture_prepare": fixture_result,
        "n8n_restart": restart,
        "runs": runs,
    }
    write_json(batch_dir / "evaluation_summary.json", batch)
    generate_html(batch, batch_dir / "interactive_report.html")
    print(f"batch: {batch_dir}")
    print(f"plot: {batch_dir / 'interactive_report.html'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
