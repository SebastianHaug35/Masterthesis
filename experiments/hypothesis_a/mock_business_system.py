"""Deterministic local business-system simulation for Hypothesis A.

The server intentionally uses only the Python standard library so it can run on a
normal Windows development machine without Docker or additional packages.
"""

from __future__ import annotations

import argparse
import json
import time
from copy import deepcopy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse


DEFAULT_STATE: dict[str, Any] = {
    "erp": {
        "purchase_orders": {
            "PO-4500012458": {
                "po_number": "PO-4500012458",
                "po_date": "2026-04-09",
                "vendor_id": "V-10045",
                "vendor_name": "Meyer Industrietechnik GmbH",
                "company_code": "DE01",
                "currency": "EUR",
                "payment_terms": "NET30",
                "buyer_id": "B-2001",
                "cost_center": "CC-AP-100",
                "line_items": [
                    {
                        "item_no": "10",
                        "material_or_service_id": "MAT-IND-42",
                        "description": "Industrial component",
                        "ordered_qty": 5,
                        "uom": "EA",
                        "unit_price": 490.0,
                        "net_amount": 2450.0,
                    }
                ],
            }
        }
    },
    "receiving": {
        "reports": {
            "GR-2026-00441": {
                "receiving_report_id": "GR-2026-00441",
                "po_number": "PO-4500012458",
                "receipt_date": "2026-04-10",
                "receiver_id": "WH-17",
                "received_items": [
                    {
                        "item_no": "10",
                        "received_qty": 5,
                        "accepted_qty": 5,
                        "rejected_qty": 0,
                    }
                ],
                "damage_flag": False,
                "receipt_comment": "Complete delivery.",
            }
        }
    },
    "email": {
        "inbox": [
            {
                "message_id": "MSG-AP-0001",
                "from": "vendor.accounting@partner.example",
                "to": "ap.inbox@company.example",
                "subject": "Invoice INV-98451 for PO-4500012458",
                "received_at": "2026-04-11T09:00:00+02:00",
                "attachments": [
                    {
                        "document_id": "DOC-INV-98451",
                        "file_name": "INV-98451.pdf",
                        "document_type": "vendor_invoice",
                    }
                ],
                "invoice": {
                    "invoice_number": "INV-98451",
                    "invoice_date": "2026-04-10",
                    "vendor_id": "V-10045",
                    "po_number": "PO-4500012458",
                    "gross_amount": 2915.5,
                    "net_amount": 2450.0,
                    "tax_amount": 465.5,
                    "currency": "EUR",
                    "due_date": "2026-05-10",
                    "invoice_file_id": "DOC-INV-98451",
                    "invoice_channel": "email",
                },
            }
        ],
        "sent": [],
    },
    "dms": {
        "documents": {
            "DOC-PO-4500012458": {
                "document_id": "DOC-PO-4500012458",
                "document_type": "purchase_order",
                "case_id": "AP-2026-0001",
                "po_number": "PO-4500012458",
                "stamped": False,
            },
            "DOC-GR-2026-00441": {
                "document_id": "DOC-GR-2026-00441",
                "document_type": "receiving_report",
                "case_id": "AP-2026-0001",
                "po_number": "PO-4500012458",
                "stamped": False,
            },
            "DOC-INV-98451": {
                "document_id": "DOC-INV-98451",
                "document_type": "vendor_invoice",
                "case_id": "AP-2026-0001",
                "po_number": "PO-4500012458",
                "stamped": False,
            },
        },
        "archives": {},
    },
    "db": {
        "cases": {
            "AP-2026-0001": {
                "case_id": "AP-2026-0001",
                "process_id": "account_payable_process_0",
                "status": "po_entered",
                "created_at": "2026-04-10T08:00:00+02:00",
                "last_updated_at": "2026-04-10T08:00:00+02:00",
            }
        },
        "audit_log": [],
    },
    "queue": {"items": []},
}


STATE: dict[str, Any] = deepcopy(DEFAULT_STATE)


def now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S%z")


def response(data: Any, status: int = 200) -> tuple[int, dict[str, Any]]:
    return status, {"data": data}


def error(message: str, status: int = 400) -> tuple[int, dict[str, Any]]:
    return status, {"error": {"message": message, "status": status}}


def find_invoice_by_po(po_number: str) -> dict[str, Any] | None:
    for message in STATE["email"]["inbox"]:
        invoice = message.get("invoice", {})
        if invoice.get("po_number") == po_number:
            return {"message": message, "invoice": invoice}
    return None


def completeness_for_case(case_id: str) -> dict[str, Any]:
    docs = [
        doc
        for doc in STATE["dms"]["documents"].values()
        if doc.get("case_id") == case_id
    ]
    doc_types = {doc["document_type"] for doc in docs}
    missing = [
        required
        for required in ("purchase_order", "receiving_report", "vendor_invoice")
        if required not in doc_types
    ]
    return {
        "case_id": case_id,
        "po_present": "purchase_order" in doc_types,
        "receipt_present": "receiving_report" in doc_types,
        "invoice_present": "vendor_invoice" in doc_types,
        "all_documents_amended": len(missing) == 0,
        "missing_documents": missing,
        "validation_timestamp": now(),
        "validator_source": "mock_business_system",
    }


def route_get(path: str, query: dict[str, list[str]]) -> tuple[int, dict[str, Any]]:
    parts = [part for part in path.strip("/").split("/") if part]

    if path == "/health":
        return response({"status": "ok", "service": "mock_business_system"})

    if parts[:3] == ["erp", "purchase-orders", "by-po"] and len(parts) == 4:
        po = STATE["erp"]["purchase_orders"].get(parts[3])
        return response(po) if po else error(f"Unknown purchase order: {parts[3]}", 404)

    if parts[:2] == ["receiving", "reports"] and len(parts) == 3:
        report = STATE["receiving"]["reports"].get(parts[2])
        return response(report) if report else error(f"Unknown receiving report: {parts[2]}", 404)

    if path == "/email/inbox":
        po_number = query.get("po_number", [None])[0]
        messages = STATE["email"]["inbox"]
        if po_number:
            messages = [
                message
                for message in messages
                if message.get("invoice", {}).get("po_number") == po_number
            ]
        return response(messages)

    if parts[:3] == ["email", "invoice", "by-po"] and len(parts) == 4:
        result = find_invoice_by_po(parts[3])
        return response(result) if result else error(f"No invoice for PO: {parts[3]}", 404)

    if parts[:3] == ["dms", "documents", "case"] and len(parts) == 4:
        case_id = parts[3]
        docs = [
            doc
            for doc in STATE["dms"]["documents"].values()
            if doc.get("case_id") == case_id
        ]
        return response(docs)

    if parts[:3] == ["dms", "completeness", "case"] and len(parts) == 4:
        return response(completeness_for_case(parts[3]))

    if parts[:2] == ["db", "cases"] and len(parts) == 3:
        case_data = STATE["db"]["cases"].get(parts[2])
        return response(case_data) if case_data else error(f"Unknown case: {parts[2]}", 404)

    if path == "/queue/items":
        return response(STATE["queue"]["items"])

    return error(f"Unknown GET endpoint: {path}", 404)


def route_post(path: str, body: dict[str, Any]) -> tuple[int, dict[str, Any]]:
    if path == "/admin/reset":
        STATE.clear()
        STATE.update(deepcopy(DEFAULT_STATE))
        return response({"status": "reset"})

    if path == "/admin/seed":
        STATE.clear()
        STATE.update(deepcopy(DEFAULT_STATE))
        overrides = body.get("state_overrides", {})
        for key, value in overrides.items():
            if isinstance(value, dict) and isinstance(STATE.get(key), dict):
                STATE[key].update(value)
            else:
                STATE[key] = value
        return response({"status": "seeded", "overrides": sorted(overrides)})

    if path == "/dms/stamp":
        case_id = body.get("case_id")
        if not case_id:
            return error("case_id is required", 422)
        completeness = completeness_for_case(case_id)
        if completeness["missing_documents"]:
            return error("Cannot stamp incomplete document package", 409)
        stamped_ids = []
        for doc in STATE["dms"]["documents"].values():
            if doc.get("case_id") == case_id:
                doc["stamped"] = True
                stamped_ids.append(doc["document_id"])
        audit_event = {
            "audit_event_id": f"AUDIT-{case_id}",
            "case_id": case_id,
            "event_type": "documents_stamped",
            "timestamp": now(),
        }
        STATE["db"]["audit_log"].append(audit_event)
        return response(
            {
                "case_id": case_id,
                "stamp_status": "stamped",
                "stamped_document_ids": stamped_ids,
                "audit_event_id": audit_event["audit_event_id"],
            }
        )

    if path == "/dms/archive":
        case_id = body.get("case_id")
        if not case_id:
            return error("case_id is required", 422)
        archive = {
            "case_id": case_id,
            "archive_location": f"dms://archive/{case_id}",
            "finalized_at": now(),
        }
        STATE["dms"]["archives"][case_id] = archive
        return response(archive)

    if path == "/db/cases":
        case_id = body.get("case_id")
        if not case_id:
            return error("case_id is required", 422)
        existing = STATE["db"]["cases"].get(case_id, {})
        updated = {**existing, **body, "last_updated_at": now()}
        STATE["db"]["cases"][case_id] = updated
        return response(updated)

    if path == "/queue/items":
        item = {**body, "queue_item_id": f"QUEUE-{len(STATE['queue']['items']) + 1:04d}"}
        STATE["queue"]["items"].append(item)
        return response(item, 201)

    if path == "/email/send":
        message = {**body, "message_id": f"SENT-{len(STATE['email']['sent']) + 1:04d}"}
        STATE["email"]["sent"].append(message)
        return response(message, 201)

    return error(f"Unknown POST endpoint: {path}", 404)


class Handler(BaseHTTPRequestHandler):
    server_version = "MockBusinessSystem/1.0"

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}")

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def write_json(self, status: int, payload: dict[str, Any]) -> None:
        encoded = json.dumps(payload, indent=2, sort_keys=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        status, payload = route_get(parsed.path, parse_qs(parsed.query))
        self.write_json(status, payload)

    def do_POST(self) -> None:
        try:
            body = self.read_json()
        except json.JSONDecodeError:
            status, payload = error("Invalid JSON body", 400)
        else:
            parsed = urlparse(self.path)
            status, payload = route_post(parsed.path, body)
        self.write_json(status, payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8088)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Mock Business System listening on http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
