# Account Payable Process 0: System, Trigger, and Data Contract

## Purpose

This document replaces the simple single-input/single-output view for `account_payable_process_0`.
It describes the systems involved, the business triggers, the required functions, and the business data that must exist behind the workflow.

## Process Summary

The process starts when purchase order details are entered.
After that, a receiving report is created.
Then two branches run in parallel:

- the vendor invoice is obtained
- all required documents are confirmed as amended and complete

When both branches are complete, all documents are stamped and the case is finalized.

## Participating Systems

| System | Role in process | Typical capabilities |
| --- | --- | --- |
| ERP / Procurement System | System of record for purchase orders, goods receipts, and AP posting context | Store PO, supplier, line items, cost objects, receipt data |
| Warehouse / Receiving Module | Creates the receiving report after goods receipt | Record delivered quantities, receipt date, receiver, discrepancies |
| Vendor Channel | Source for the vendor invoice | Email inbox, supplier portal, EDI/API, upload |
| DMS / Document Repository | Stores and manages process documents | Versioning, metadata, completeness check, stamp status, archive |
| Workflow Engine (`n8n`) | Orchestrates the sequence and parallel branches | Triggering, polling, joins, validation, routing |
| AP Work Queue / Posting Queue | Optional target queue for downstream AP booking | Ready-for-posting flag, exception routing, handoff to AP team |

## System-Level Trigger Points

| Trigger ID | Trigger event | Source system | Workflow reaction |
| --- | --- | --- | --- |
| T1 | Purchase order details entered | ERP | Open AP case and load PO master data |
| T2 | Receiving report created | Warehouse / ERP | Attach receipt data and open parallel document validation stage |
| T3 | Vendor invoice received | Vendor channel / DMS | Extract invoice metadata and link invoice to AP case |
| T4 | Document completeness confirmed | DMS / workflow validation step | Mark document-validation branch as complete |
| T5 | Parallel join satisfied | Workflow engine | Continue only if invoice branch and completeness branch are both done |
| T6 | Stamp/archive action completed | DMS | Mark case as finalized and optionally hand off to AP posting queue |

## Required Workflow Functions

| Function ID | Function | Main input | Main output |
| --- | --- | --- | --- |
| F1 | Create AP case from PO | Purchase order event | Internal case with `case_id` |
| F2 | Fetch PO details | `po_number` | PO header, supplier, items, amounts |
| F3 | Create or fetch receiving report | Goods receipt event | Receiving report document and metadata |
| F4 | Register vendor invoice | Invoice document | Invoice metadata linked to case |
| F5 | Validate document completeness | PO, receipt, invoice references | Completeness flag plus missing-items list |
| F6 | Join parallel branches | Branch completion signals | Release token for finalization |
| F7 | Stamp all documents | Full document package | Stamped document set and audit trail |
| F8 | Archive / handoff | Finalized case package | Archived case or AP posting queue item |

## Core Business Objects and Required Data

### 1. Purchase Order

Primary source: ERP

Required fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `po_number` | string | yes | Unique purchase order identifier |
| `po_date` | date | yes | Date of PO creation |
| `vendor_id` | string | yes | ERP supplier identifier |
| `vendor_name` | string | yes | Supplier display name |
| `company_code` | string | yes | Legal entity / accounting area |
| `currency` | string | yes | Transaction currency |
| `payment_terms` | string | yes | Payment term code |
| `buyer_id` | string | no | Responsible purchaser |
| `line_items` | array | yes | Ordered materials or services |
| `line_items[].item_no` | string | yes | PO line number |
| `line_items[].material_or_service_id` | string | no | Item identifier |
| `line_items[].description` | string | yes | Item description |
| `line_items[].ordered_qty` | number | yes | Ordered quantity |
| `line_items[].uom` | string | yes | Unit of measure |
| `line_items[].unit_price` | number | yes | Agreed unit price |
| `line_items[].net_amount` | number | yes | Net line amount |
| `cost_center` | string | no | Cost object if relevant |

### 2. Receiving Report

Primary source: Warehouse / ERP

Required fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `receiving_report_id` | string | yes | Unique receipt identifier |
| `po_number` | string | yes | Linked PO |
| `receipt_date` | date | yes | Date of goods receipt |
| `receiver_id` | string | yes | Employee or system confirming receipt |
| `received_items` | array | yes | Quantities actually received |
| `received_items[].item_no` | string | yes | Linked PO line |
| `received_items[].received_qty` | number | yes | Quantity received |
| `received_items[].accepted_qty` | number | no | Accepted quantity after inspection |
| `received_items[].rejected_qty` | number | no | Rejected quantity |
| `damage_flag` | boolean | no | Damage or issue indicator |
| `receipt_comment` | string | no | Free-text remarks |

### 3. Vendor Invoice

Primary source: Vendor channel / DMS

Required fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `invoice_number` | string | yes | Supplier invoice number |
| `invoice_date` | date | yes | Date on invoice |
| `vendor_id` | string | yes | Supplier identifier |
| `po_number` | string | yes | Referenced PO |
| `gross_amount` | number | yes | Gross invoice amount |
| `net_amount` | number | yes | Net invoice amount |
| `tax_amount` | number | yes | Tax amount |
| `currency` | string | yes | Invoice currency |
| `due_date` | date | yes | Payment due date |
| `invoice_file_id` | string | yes | Document ID in DMS |
| `invoice_channel` | string | yes | Email, portal, EDI, upload |

### 4. Document Completeness Result

Primary source: Workflow engine / DMS validation

Required fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `case_id` | string | yes | Workflow case identifier |
| `po_present` | boolean | yes | PO document available |
| `receipt_present` | boolean | yes | Receiving report available |
| `invoice_present` | boolean | yes | Invoice available |
| `all_documents_amended` | boolean | yes | Required updates completed |
| `missing_documents` | array | yes | Empty if complete |
| `validation_timestamp` | datetime | yes | Validation execution time |
| `validator_source` | string | yes | Human task, rule engine, or workflow step |

### 5. Finalized Document Package

Primary source: DMS

Required fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `case_id` | string | yes | Workflow case identifier |
| `stamp_status` | string | yes | `stamped`, `failed`, or `pending` |
| `stamped_document_ids` | array | yes | IDs of stamped documents |
| `archive_location` | string | yes | DMS archive path or object key |
| `audit_event_id` | string | yes | Finalization audit record |
| `finalized_at` | datetime | yes | Final process completion time |

## Minimal End-to-End Case Data

The workflow should not be tested with only abstract IO labels.
At minimum, one runnable process case should carry data like this:

```json
{
  "case_id": "AP-2026-0001",
  "po_number": "PO-4500012458",
  "vendor_id": "V-10045",
  "vendor_name": "Meyer Industrietechnik GmbH",
  "receiving_report_id": "GR-2026-00441",
  "invoice_number": "INV-98451",
  "invoice_date": "2026-04-10",
  "currency": "EUR",
  "net_amount": 2450.00,
  "tax_amount": 465.50,
  "gross_amount": 2915.50,
  "due_date": "2026-05-10",
  "all_documents_amended": true,
  "stamp_status": "stamped"
}
```

## Expected State Transitions

| State | Entry condition | Exit condition |
| --- | --- | --- |
| `po_entered` | PO trigger received | PO case created and data loaded |
| `receipt_created` | Receiving report available | Parallel branch opens |
| `waiting_for_invoice` | Invoice branch not complete | Invoice registered |
| `waiting_for_document_confirmation` | Completeness branch not complete | Completeness confirmed |
| `ready_for_stamping` | Both branches complete | Stamp action started |
| `finalized` | All documents stamped and archived | Optional AP handoff completed |

## Validation Rules for Test Runs

- The workflow must not stamp documents before both parallel branches are complete.
- `vendor_id` on PO and invoice must match.
- `po_number` must be consistent across PO, receiving report, and invoice.
- At least one invoice document and one receiving report must exist in the DMS before finalization.
- If `missing_documents` is not empty, the workflow must not reach `finalized`.
- The final archive object must reference the same `case_id` as the orchestration context.

## Recommended Mock Interfaces for Evaluation

| Interface | Mock behavior needed |
| --- | --- |
| ERP PO lookup API | Return PO header and line items by `po_number` |
| Receiving report service | Return receipt metadata and quantities |
| Vendor invoice inbox / API | Deliver invoice file and metadata |
| DMS API | Store documents, update metadata, apply stamp, return archive ID |
| AP posting queue | Accept only finalized cases |

## Evaluation Relevance

This process should be evaluated as a system-interaction case, not only as an IO-shape case.
The relevant test question is whether the workflow can coordinate the required systems and carry the required business data from trigger to finalized document package without losing consistency.
