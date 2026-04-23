"""Reproducible test runner for Hypothesis A.

The runner has two execution modes:

1. reference: execute the process-specific reference behavior against the local
   mock business system. This validates the test case, seed data, and expected
   system interactions without requiring n8n.
2. workflow: trigger a workflow endpoint, for example an n8n webhook, and
   validate its response against the same test case contract.

Only the Python standard library is used so the experiment can run on a normal
Windows development machine without additional dependencies.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import threading
from dataclasses import dataclass, field
from datetime import datetime
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PROCESS_DIR = (
    PROJECT_ROOT
    / "thesis"
    / "n8n"
    / "process_io"
    / "processes"
    / "account_payable_process_0"
)
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "artifacts" / "hypothesis_a" / "runs"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mock_business_system import Handler  # noqa: E402


class QuietHandler(Handler):
    def log_message(self, format: str, *args: Any) -> None:
        return


@dataclass
class HttpInteraction:
    method: str
    path: str
    status: int
    duration_ms: int
    response: Any = None
    error: str | None = None

    @property
    def signature(self) -> str:
        return f"{self.method} {self.path}"


@dataclass
class TestContext:
    base_url: str
    interactions: list[HttpInteraction] = field(default_factory=list)

    def request(self, method: str, path: str, body: dict[str, Any] | None = None) -> Any:
        url = urljoin(self.base_url.rstrip("/") + "/", path.lstrip("/"))
        payload = None
        headers = {"Accept": "application/json"}
        if body is not None:
            payload = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"

        start = time.perf_counter()
        request = Request(url, data=payload, headers=headers, method=method)
        status = 0
        parsed_body: Any = None
        error_message = None
        try:
            with urlopen(request, timeout=10) as response:
                status = response.status
                raw = response.read().decode("utf-8")
                parsed_body = json.loads(raw) if raw else {}
        except HTTPError as exc:
            status = exc.code
            raw = exc.read().decode("utf-8")
            parsed_body = json.loads(raw) if raw else {}
            error_message = parsed_body.get("error", {}).get("message", str(exc))
        except URLError as exc:
            error_message = str(exc.reason)
            raise RuntimeError(f"Cannot reach {url}: {error_message}") from exc
        finally:
            duration_ms = round((time.perf_counter() - start) * 1000)
            self.interactions.append(
                HttpInteraction(
                    method=method,
                    path=urlparse(url).path,
                    status=status,
                    duration_ms=duration_ms,
                    response=parsed_body,
                    error=error_message,
                )
            )

        if status >= 400:
            raise RuntimeError(f"{method} {path} failed with HTTP {status}: {error_message}")

        if isinstance(parsed_body, dict) and "data" in parsed_body:
            return parsed_body["data"]
        return parsed_body

    def get(self, path: str) -> Any:
        return self.request("GET", path)

    def post(self, path: str, body: dict[str, Any] | None = None) -> Any:
        return self.request("POST", path, body or {})


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def can_reach_health(base_url: str) -> bool:
    try:
        request = Request(
            urljoin(base_url.rstrip("/") + "/", "health"),
            headers={"Accept": "application/json"},
            method="GET",
        )
        with urlopen(request, timeout=2) as response:
            raw = response.read().decode("utf-8")
            payload = json.loads(raw)
            return response.status == 200 and payload.get("data", {}).get("status") == "ok"
    except Exception:
        return False


def start_embedded_mock_server(base_url: str) -> ThreadingHTTPServer:
    parsed = urlparse(base_url)
    host = parsed.hostname or "127.0.0.1"
    port = parsed.port or 8088
    server = ThreadingHTTPServer((host, port), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, name="mock-business-system")
    thread.daemon = True
    thread.start()

    for attempt in range(20):
        if can_reach_health(base_url):
            return server
        time.sleep(0.25)
    server.shutdown()
    raise RuntimeError(f"Embedded mock business system did not start on {base_url}")


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, sort_keys=True)
        file.write("\n")


def find_test_case_file(process_dir: Path) -> Path:
    candidates = sorted(process_dir.glob("*_test_cases.json"))
    if not candidates:
        raise FileNotFoundError(f"No *_test_cases.json found in {process_dir}")
    if len(candidates) > 1:
        raise RuntimeError(f"Expected one test case file in {process_dir}, found {len(candidates)}")
    return candidates[0]


def assert_equal(actual: Any, expected: Any, path: str, failures: list[str]) -> None:
    if isinstance(expected, dict):
        if not isinstance(actual, dict):
            failures.append(f"{path}: expected object, got {type(actual).__name__}")
            return
        for key, value in expected.items():
            if key not in actual:
                failures.append(f"{path}.{key}: missing")
                continue
            assert_equal(actual[key], value, f"{path}.{key}", failures)
        return

    if actual != expected:
        failures.append(f"{path}: expected {expected!r}, got {actual!r}")


def validate_expected_output(observed: dict[str, Any], expected: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    assert_equal(observed, expected, "output", failures)
    return failures


def validate_expected_calls(
    expected_calls: list[str], interactions: list[HttpInteraction]
) -> list[str]:
    observed = [interaction.signature for interaction in interactions]
    return [call for call in expected_calls if call not in observed]


def run_account_payable_process_0_reference(
    test_case: dict[str, Any], ctx: TestContext
) -> dict[str, Any]:
    payload = test_case["input_payload"]
    case_id = payload["case_id"]
    po_number = payload["po_number"]
    receiving_report_id = payload["receiving_report_id"]

    ctx.post("/admin/reset")
    purchase_order = ctx.get(f"/erp/purchase-orders/by-po/{po_number}")
    receiving_report = ctx.get(f"/receiving/reports/{receiving_report_id}")
    invoice_bundle = ctx.get(f"/email/invoice/by-po/{po_number}")
    completeness = ctx.get(f"/dms/completeness/case/{case_id}")

    invoice = invoice_bundle["invoice"]
    validation_errors = []
    if purchase_order["vendor_id"] != invoice["vendor_id"]:
        validation_errors.append("vendor_id_mismatch")
    if purchase_order["po_number"] != receiving_report["po_number"]:
        validation_errors.append("po_mismatch_between_order_and_receipt")
    if purchase_order["po_number"] != invoice["po_number"]:
        validation_errors.append("po_mismatch_between_order_and_invoice")
    if not completeness["all_documents_amended"]:
        validation_errors.append("document_package_incomplete")

    if validation_errors:
        return {
            "case_id": case_id,
            "workflow_status": "failed",
            "validation_errors": validation_errors,
        }

    stamp_result = ctx.post("/dms/stamp", {"case_id": case_id})
    archive_result = ctx.post("/dms/archive", {"case_id": case_id})

    return {
        "case_id": case_id,
        "workflow_status": "completed",
        "stamp_status": stamp_result["stamp_status"],
        "archive_location": archive_result["archive_location"],
    }


def run_reference(test_case: dict[str, Any], process_id: str) -> tuple[dict[str, Any], list[HttpInteraction]]:
    base_url = test_case["mock_system_base_url"]
    ctx = TestContext(base_url=base_url)

    if process_id == "account_payable_process_0":
        output = run_account_payable_process_0_reference(test_case, ctx)
    else:
        raise RuntimeError(f"No reference runner implemented for process_id={process_id}")

    return output, ctx.interactions


def run_workflow(test_case: dict[str, Any], process_id: str, workflow_url: str) -> tuple[dict[str, Any], list[HttpInteraction]]:
    payload = {
        "process_id": process_id,
        "test_case_id": test_case["test_case_id"],
        "mock_system_base_url": test_case["mock_system_base_url"],
        "input_payload": test_case["input_payload"],
    }
    ctx = TestContext(base_url=workflow_url)
    response = ctx.post("/", payload)
    if isinstance(response, dict) and "output" in response:
        return response["output"], ctx.interactions
    if isinstance(response, dict):
        return response, ctx.interactions
    raise RuntimeError(f"Workflow response must be a JSON object, got {type(response).__name__}")


def run_case(
    test_case: dict[str, Any],
    process_id: str,
    mode: str,
    workflow_url: str | None,
) -> dict[str, Any]:
    started_at = datetime.now().isoformat(timespec="seconds")
    start = time.perf_counter()
    status = "passed"
    error_message = None
    observed_output: dict[str, Any] = {}
    interactions: list[HttpInteraction] = []
    validation_failures: list[str] = []

    try:
        if mode == "reference":
            observed_output, interactions = run_reference(test_case, process_id)
        elif mode == "workflow":
            if not workflow_url:
                raise RuntimeError("--workflow-url is required in workflow mode")
            observed_output, interactions = run_workflow(test_case, process_id, workflow_url)
        else:
            raise RuntimeError(f"Unsupported mode: {mode}")

        validation_failures.extend(
            validate_expected_output(observed_output, test_case["expected_output"])
        )
        validation_failures.extend(
            f"missing expected call: {call}"
            for call in validate_expected_calls(
                test_case.get("expected_system_calls", []), interactions
            )
        )
        if validation_failures:
            status = "failed"
    except Exception as exc:  # noqa: BLE001 - this is an experiment result boundary.
        status = "error"
        error_message = str(exc)

    duration_ms = round((time.perf_counter() - start) * 1000)
    return {
        "test_case_id": test_case["test_case_id"],
        "scenario_name": test_case.get("scenario_name"),
        "category": test_case.get("category"),
        "mode": mode,
        "status": status,
        "started_at": started_at,
        "duration_ms": duration_ms,
        "input_payload": test_case.get("input_payload"),
        "expected_output": test_case.get("expected_output"),
        "observed_output": observed_output,
        "validation_failures": validation_failures,
        "error": error_message,
        "http_interactions": [
            {
                "method": interaction.method,
                "path": interaction.path,
                "signature": interaction.signature,
                "status": interaction.status,
                "duration_ms": interaction.duration_ms,
                "error": interaction.error,
            }
            for interaction in interactions
        ],
    }


def summarize(results: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "total": len(results),
        "passed": sum(1 for result in results if result["status"] == "passed"),
        "failed": sum(1 for result in results if result["status"] == "failed"),
        "error": sum(1 for result in results if result["status"] == "error"),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Hypothesis A process tests.")
    parser.add_argument("--process-dir", type=Path, default=DEFAULT_PROCESS_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--mode", choices=["reference", "workflow"], default="reference")
    parser.add_argument("--workflow-url", default=None)
    parser.add_argument("--test-case-id", default=None)
    parser.add_argument(
        "--require-external-mock",
        action="store_true",
        help="Fail if the mock system is not already reachable instead of starting it in-process.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    test_case_file = find_test_case_file(args.process_dir)
    contract = load_json(test_case_file)
    process_id = contract["process_id"]
    test_cases = contract["test_cases"]
    if args.test_case_id:
        test_cases = [
            test_case
            for test_case in test_cases
            if test_case["test_case_id"] == args.test_case_id
        ]
        if not test_cases:
            raise RuntimeError(f"Unknown test case id: {args.test_case_id}")

    embedded_servers: list[ThreadingHTTPServer] = []
    for base_url in sorted({test_case["mock_system_base_url"] for test_case in test_cases}):
        if can_reach_health(base_url):
            continue
        if args.require_external_mock:
            raise RuntimeError(f"Mock business system is not reachable: {base_url}")
        embedded_servers.append(start_embedded_mock_server(base_url))

    results = [
        run_case(test_case, process_id, args.mode, args.workflow_url)
        for test_case in test_cases
    ]
    summary = summarize(results)
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    report = {
        "run_id": run_id,
        "process_id": process_id,
        "mode": args.mode,
        "test_case_file": str(test_case_file.relative_to(PROJECT_ROOT)),
        "summary": summary,
        "results": results,
    }

    report_path = args.output_dir / f"{process_id}_{args.mode}_{run_id}.json"
    latest_path = args.output_dir / f"{process_id}_{args.mode}_latest.json"
    write_json(report_path, report)
    write_json(latest_path, report)

    print(f"process_id: {process_id}")
    print(f"mode: {args.mode}")
    print(f"summary: {summary['passed']} passed, {summary['failed']} failed, {summary['error']} error")
    print(f"report: {report_path}")

    for server in embedded_servers:
        server.shutdown()

    return 0 if summary["failed"] == 0 and summary["error"] == 0 else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001 - CLI boundary.
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
