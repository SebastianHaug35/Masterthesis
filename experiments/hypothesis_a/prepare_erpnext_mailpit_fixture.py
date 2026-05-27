"""Prepare the ERPNext/Mailpit fixture for account_payable_process_0.

This script is intentionally separate from the workflow test runner. It only
prepares or verifies the systems that must be in a known state before the first
ERPNext/Mailpit workflow run starts.
"""

from __future__ import annotations

import argparse
import http.cookiejar
import json
import smtplib
import sys
from dataclasses import dataclass, field
from email.message import EmailMessage
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import HTTPCookieProcessor, Request, build_opener


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_FIXTURE = (
    PROJECT_ROOT
    / "thesis"
    / "n8n"
    / "process_io"
    / "processes"
    / "account_payable_process_0"
    / "account_payable_process_0_erpnext_mailpit_fixture.json"
)
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "artifacts" / "hypothesis_a" / "erpnext_mailpit_fixture"


@dataclass
class StepResult:
    system: str
    action: str
    status: str
    detail: str


@dataclass
class RunReport:
    mode: str
    results: list[StepResult] = field(default_factory=list)

    def add(self, system: str, action: str, status: str, detail: str) -> None:
        self.results.append(StepResult(system, action, status, detail))

    @property
    def has_errors(self) -> bool:
        return any(result.status == "error" for result in self.results)

    def to_json(self) -> dict[str, Any]:
        return {
            "mode": self.mode,
            "summary": {
                "ok": sum(1 for result in self.results if result.status == "ok"),
                "created": sum(1 for result in self.results if result.status == "created"),
                "updated": sum(1 for result in self.results if result.status == "updated"),
                "missing": sum(1 for result in self.results if result.status == "missing"),
                "skipped": sum(1 for result in self.results if result.status == "skipped"),
                "error": sum(1 for result in self.results if result.status == "error"),
            },
            "results": [result.__dict__ for result in self.results],
        }


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, sort_keys=True)
        file.write("\n")


class FrappeClient:
    def __init__(self, base_url: str, username: str, password: str) -> None:
        self.base_url = base_url.rstrip("/")
        cookie_jar = http.cookiejar.CookieJar()
        self.opener = build_opener(HTTPCookieProcessor(cookie_jar))
        self.username = username
        self.password = password

    def request(self, method: str, path: str, body: dict[str, Any] | None = None) -> Any:
        data = None
        headers = {"Accept": "application/json"}
        if body is not None:
            data = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"
        request = Request(f"{self.base_url}{path}", data=data, headers=headers, method=method)
        try:
            with self.opener.open(request, timeout=30) as response:
                raw = response.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except HTTPError as exc:
            raw = exc.read().decode("utf-8")
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                payload = raw
            raise RuntimeError(f"{method} {path} failed with HTTP {exc.code}: {payload}") from exc
        except URLError as exc:
            raise RuntimeError(f"Cannot reach ERPNext at {self.base_url}: {exc.reason}") from exc

    def login(self) -> None:
        self.request("POST", "/api/method/login", {"usr": self.username, "pwd": self.password})

    def get_doc_by_name(self, doctype: str, name: str) -> dict[str, Any] | None:
        encoded_doctype = quote(doctype, safe="")
        encoded_name = quote(name, safe="")
        try:
            payload = self.request("GET", f"/api/resource/{encoded_doctype}/{encoded_name}")
        except RuntimeError as exc:
            if "HTTP 404" in str(exc):
                return None
            raise
        return payload.get("data")

    def find_doc(self, doctype: str, field: str, value: str) -> dict[str, Any] | None:
        return self.find_doc_by_filters(doctype, [[doctype, field, "=", value]])

    def find_doc_by_filters(self, doctype: str, filters: list[list[Any]]) -> dict[str, Any] | None:
        encoded_doctype = quote(doctype, safe="")
        query = urlencode(
            {
                "filters": json.dumps(filters),
                "fields": json.dumps(["name"]),
                "limit_page_length": "1",
            }
        )
        payload = self.request("GET", f"/api/resource/{encoded_doctype}?{query}")
        rows = payload.get("data", [])
        if not rows:
            return None
        return self.get_doc_by_name(doctype, rows[0]["name"])

    def create_doc(self, doctype: str, doc: dict[str, Any]) -> dict[str, Any]:
        encoded_doctype = quote(doctype, safe="")
        payload = self.request("POST", f"/api/resource/{encoded_doctype}", {"data": doc})
        return payload["data"]

    def update_doc(self, doctype: str, name: str, doc: dict[str, Any]) -> dict[str, Any]:
        encoded_doctype = quote(doctype, safe="")
        encoded_name = quote(name, safe="")
        payload = self.request("PUT", f"/api/resource/{encoded_doctype}/{encoded_name}", {"data": doc})
        return payload["data"]

    def submit_doc(self, doc: dict[str, Any]) -> dict[str, Any]:
        payload = self.request("POST", "/api/method/frappe.client.submit", {"doc": doc})
        return payload["message"]


def ensure_doc(
    client: FrappeClient,
    report: RunReport,
    doctype: str,
    doc: dict[str, Any],
    lookup_field: str,
    lookup_value: str,
    submit: bool = False,
) -> dict[str, Any] | None:
    existing = client.find_doc(doctype, lookup_field, lookup_value)
    if existing:
        report.add("ERPNext", f"ensure {doctype}", "ok", f"{lookup_field}={lookup_value} exists")
        if submit and existing.get("docstatus") == 0:
            submitted = client.submit_doc(existing)
            report.add("ERPNext", f"submit {doctype}", "updated", submitted.get("name", lookup_value))
            return submitted
        return existing

    created = client.create_doc(doctype, doc)
    report.add("ERPNext", f"create {doctype}", "created", created.get("name", lookup_value))
    if submit:
        submitted = client.submit_doc(created)
        report.add("ERPNext", f"submit {doctype}", "updated", submitted.get("name", lookup_value))
        return submitted
    return created


def seed_erpnext(fixture: dict[str, Any], report: RunReport, args: argparse.Namespace) -> None:
    erp = fixture["erpnext"]
    client = FrappeClient(erp["base_url"], args.erpnext_user, args.erpnext_password)
    client.login()
    report.add("ERPNext", "login", "ok", erp["base_url"])

    ensure_doc(
        client,
        report,
        "Warehouse Type",
        {"doctype": "Warehouse Type", "name": "Transit", "warehouse_type": "Transit"},
        "name",
        "Transit",
    )

    company = erp["company"]
    ensure_doc(client, report, "Company", company, "abbr", company["abbr"])

    ensure_doc(
        client,
        report,
        "Fiscal Year",
        {
            "doctype": "Fiscal Year",
            "year": "2026",
            "year_start_date": "2026-01-01",
            "year_end_date": "2026-12-31",
            "disabled": 0,
            "companies": [
                {
                    "company": company["company_name"],
                }
            ],
        },
        "year",
        "2026",
    )

    ensure_doc(
        client,
        report,
        "Supplier Group",
        {
            "doctype": "Supplier Group",
            "supplier_group_name": "All Supplier Groups",
            "is_group": 1,
        },
        "supplier_group_name",
        "All Supplier Groups",
    )

    supplier = erp["supplier"]
    ensure_doc(client, report, "Supplier", supplier, "supplier_name", supplier["supplier_name"])

    ensure_doc(
        client,
        report,
        "UOM",
        {"doctype": "UOM", "uom_name": "Nos", "enabled": 1},
        "uom_name",
        "Nos",
    )

    ensure_doc(
        client,
        report,
        "Item Group",
        {
            "doctype": "Item Group",
            "item_group_name": "All Item Groups",
            "is_group": 1,
        },
        "item_group_name",
        "All Item Groups",
    )

    item = {**erp["item"], "item_group": erp["item"].get("item_group", "All Item Groups")}
    ensure_doc(client, report, "Item", item, "item_code", item["item_code"])

    warehouse = erp["warehouse"]
    ensure_doc(client, report, "Warehouse", warehouse, "name", warehouse["warehouse_name"])

    purchase_order = {
        key: value
        for key, value in erp["purchase_order"].items()
        if not key.startswith("expected_")
    }
    purchase_order_doc = client.find_doc_by_filters(
        "Purchase Order",
        [
            ["Purchase Order", "supplier", "=", purchase_order["supplier"]],
            ["Purchase Order", "company", "=", purchase_order["company"]],
            ["Purchase Order", "transaction_date", "=", purchase_order["transaction_date"]],
        ],
    )
    if purchase_order_doc:
        report.add("ERPNext", "ensure Purchase Order", "ok", purchase_order_doc["name"])
        if purchase_order_doc.get("docstatus") == 0:
            purchase_order_doc = client.submit_doc(purchase_order_doc)
            report.add("ERPNext", "submit Purchase Order", "updated", purchase_order_doc["name"])
    else:
        purchase_order_doc = ensure_doc(
            client,
            report,
            "Purchase Order",
            purchase_order,
            "name",
            purchase_order["name"],
            submit=True,
        )
    actual_purchase_order_name = purchase_order_doc["name"] if purchase_order_doc else purchase_order["name"]

    purchase_receipt = {
        key: value
        for key, value in erp["purchase_receipt"].items()
        if not key.startswith("expected_")
    }
    purchase_receipt.setdefault("currency", erp["purchase_order"].get("currency", "EUR"))
    for item_row in purchase_receipt.get("items", []):
        if item_row.get("purchase_order") == erp["purchase_order"]["name"]:
            item_row["purchase_order"] = actual_purchase_order_name
    purchase_receipt_doc = client.find_doc_by_filters(
        "Purchase Receipt",
        [
            ["Purchase Receipt", "supplier", "=", purchase_receipt["supplier"]],
            ["Purchase Receipt", "company", "=", purchase_receipt["company"]],
            ["Purchase Receipt", "posting_date", "=", purchase_receipt["posting_date"]],
        ],
    )
    if purchase_receipt_doc:
        report.add("ERPNext", "ensure Purchase Receipt", "ok", purchase_receipt_doc["name"])
        if purchase_receipt_doc.get("docstatus") == 0:
            submitted_receipt = client.submit_doc(purchase_receipt_doc)
            report.add("ERPNext", "submit Purchase Receipt", "updated", submitted_receipt["name"])
    else:
        ensure_doc(
            client,
            report,
            "Purchase Receipt",
            purchase_receipt,
            "name",
            purchase_receipt["name"],
            submit=True,
        )


def verify_erpnext(fixture: dict[str, Any], report: RunReport, args: argparse.Namespace) -> None:
    erp = fixture["erpnext"]
    client = FrappeClient(erp["base_url"], args.erpnext_user, args.erpnext_password)
    client.login()
    checks = [
        ("Company", "abbr", erp["company"]["abbr"]),
        ("Supplier", "supplier_name", erp["supplier"]["supplier_name"]),
        ("Item", "item_code", erp["item"]["item_code"]),
        ("Purchase Order", "name", erp["purchase_order"]["name"]),
        ("Purchase Receipt", "name", erp["purchase_receipt"]["name"]),
    ]
    for doctype, field, value in checks:
        doc = client.find_doc(doctype, field, value)
        status = "ok" if doc else "missing"
        report.add("ERPNext", f"verify {doctype}", status, f"{field}={value}")


def send_mailpit_invoice(fixture: dict[str, Any], report: RunReport) -> None:
    mailpit = fixture["mailpit"]
    smtp = mailpit["smtp"]
    incoming = mailpit["incoming_invoice_email"]
    message = EmailMessage()
    message["Message-ID"] = f"<{incoming['message_id']}>"
    message["From"] = incoming["from"]
    message["To"] = incoming["to"]
    message["Subject"] = incoming["subject"]
    message.set_content(incoming["body_text"])

    with smtplib.SMTP(smtp["host"], smtp["port"], timeout=20) as smtp_client:
        smtp_client.send_message(message)

    report.add(
        "Mailpit",
        "seed inbound invoice email",
        "created",
        f"{incoming['from']} -> {incoming['to']} ({incoming['message_id']})",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare ERPNext/Mailpit fixture for Hypothesis A.")
    parser.add_argument("--fixture", type=Path, default=DEFAULT_FIXTURE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--erpnext-user", default="Administrator")
    parser.add_argument("--erpnext-password", default="admin")
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("--mailpit-only", action="store_true")
    parser.add_argument("--erpnext-only", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    fixture = read_json(args.fixture)
    report = RunReport(mode="verify" if args.verify_only else "seed")

    try:
        if not args.mailpit_only:
            if args.verify_only:
                verify_erpnext(fixture, report, args)
            else:
                seed_erpnext(fixture, report, args)
        if not args.erpnext_only and not args.verify_only:
            send_mailpit_invoice(fixture, report)
        elif not args.erpnext_only:
            report.add("Mailpit", "verify inbound invoice email", "skipped", "Mailpit API verification is not implemented; use UI/API to inspect message.")
    except Exception as exc:  # noqa: BLE001 - CLI/report boundary.
        report.add("fixture", "prepare", "error", str(exc))

    latest = args.output_dir / "account_payable_process_0_erpnext_mailpit_fixture_latest.json"
    write_json(latest, report.to_json())

    payload = report.to_json()
    print(
        "summary: "
        f"{payload['summary']['ok']} ok, "
        f"{payload['summary']['created']} created, "
        f"{payload['summary']['updated']} updated, "
        f"{payload['summary']['missing']} missing, "
        f"{payload['summary']['error']} error"
    )
    print(f"report: {latest}")
    return 1 if report.has_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
