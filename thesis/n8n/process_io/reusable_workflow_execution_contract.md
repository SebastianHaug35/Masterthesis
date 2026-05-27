# Reusable Workflow Execution Contract

## Purpose

This document is shared technical context for every generated n8n workflow in
the Hypothesis A evaluation setup.

It defines the runtime systems that really exist, the APIs a generated workflow
is allowed to call, the APIs it must not invent, and the evidence the test
runner checks after execution.

The generator must treat this document as a hard execution contract, not as a
conceptual description.

## Runtime Boundary

Generated workflows run inside the n8n/OpenClaw container.

The workflow must use URLs that are reachable from that runtime, not URLs that
only work from the developer laptop.

The current reusable test landscape is:

| System | Purpose | External developer URL | Runtime rule for generated workflow |
| --- | --- | --- | --- |
| n8n/OpenClaw | Workflow engine and webhook host | `http://127.0.0.1:8070` | Workflow itself must expose one POST webhook |
| ERPNext/Frappe | ERP system of record | `http://127.0.0.1:8076` | Use Frappe/ERPNext REST APIs only |
| ERPNext MariaDB | ERPNext private database | internal Docker network only | Do not connect directly from n8n |
| Mailpit HTTP API | Test mailbox inspection | `http://127.0.0.1:8077` | Use Mailpit HTTP API only when reachable from n8n |
| Mailpit SMTP | Test outbound/inbound SMTP | `127.0.0.1:1025` externally | Prefer HTTP API unless SMTP is explicitly provided |

If the exact container-internal URL differs per deployment, it must be supplied
by the process-specific test setup. The workflow must not guess a new host or
port.

## Allowed Integration Style

The generated workflow may use these n8n node types:

| Node type | Required use |
| --- | --- |
| `n8n-nodes-base.webhook` | Exactly one POST trigger for the process |
| `n8n-nodes-base.httpRequest` | Calls to real ERPNext/Mailpit/test APIs |
| `n8n-nodes-base.set` | Normalize input and build final output |
| `n8n-nodes-base.if` | Validate input and branch on API results |
| `n8n-nodes-base.respondToWebhook` | Return the final JSON response |

Every node must include all import-required n8n fields:

```text
name
type
typeVersion
position
parameters
```

Every connection key must exactly match an existing node `name`.
Every connection target must exactly match an existing node `name`.

The webhook trigger node name must remain stable across nodes and connections.
If a generator or post-processor renames a node, all connection references must
be renamed as well.

## Forbidden Assumptions

Generated workflows must not create or call conceptual systems that are not in
the test setup.

Forbidden examples:

```text
http://127.0.0.1:8088
/workflow-state
/document-repository
/dms
/mock_erp
/erpnext/api/purchase-invoice/verify-or-create
/mailpit/api/send
```

These endpoints are invalid unless the process-specific test setup explicitly
defines and starts such a service.

The workflow must not call the ERPNext MariaDB database directly.
ERPNext must be accessed through the Frappe/ERPNext HTTP API.

The workflow must not silently return success if a required API call failed,
returned an empty body, or returned an unexpected schema.

## Generic Input Envelope

Every generated workflow must accept this webhook request shape:

```json
{
  "process_id": "<process_id>",
  "test_case_id": "<test_case_id>",
  "input_payload": {
    "case_id": "<case_id>"
  }
}
```

Process-specific fields are added under `input_payload`.

The workflow must validate:

```text
process_id equals the generated process id
test_case_id equals the expected positive test case id
all required input_payload fields are present and non-empty
```

On validation failure, the workflow must respond with HTTP 400 and a JSON body:

```json
{
  "workflow_status": "failed",
  "validation_errors": ["..."]
}
```

## Generic Positive Output Contract

On a successful positive test, the workflow must return a JSON object containing
all fields declared by the process-specific expected output.

The response must be produced by a `respondToWebhook` node.

The workflow must not return `{}`.
The workflow must not return only an intermediate API response.
The workflow must not return a success status before required system effects
have been verified.

## ERPNext Access Rules

ERPNext is a Frappe application. Use Frappe REST conventions.

Allowed API patterns:

```text
GET  /api/resource/<DocType>
GET  /api/resource/<DocType>/<name>
POST /api/resource/<DocType>
PUT  /api/resource/<DocType>/<name>
POST /api/method/<method>
```

Prefer resource APIs for documents when possible.

The process-specific test setup must provide:

```text
base_url reachable from n8n
authentication method
required DocTypes
required filters
required create/update payloads
expected document identifiers or stable lookup filters
```

If authentication is not provided in the test setup, the workflow must not invent
credentials. It should fail validation or call a provided test helper only if
the helper is explicitly declared.

## Mailpit Access Rules

Mailpit is the deterministic test email system.

Allowed HTTP API patterns:

```text
GET /api/v1/messages
GET /api/v1/message/<id>
```

If sending mail through Mailpit is required, the test setup must explicitly
provide one supported mechanism:

```text
SMTP host and port reachable from n8n
or a real HTTP endpoint that sends a message
```

The workflow must not invent `/mailpit/send`, `/mailpit/api/send`, or
`/mailpit/messages` POST endpoints.

For lookup, the workflow should use deterministic correlation values from the
input payload, such as:

```text
case_id
po_number
invoice_number
mailpit_message_id
```

## Evidence Required By The Test Runner

The evaluation runner does not treat a technical HTTP 200 as a positive test.

It checks several independent evidence layers:

| Evidence layer | Positive condition |
| --- | --- |
| Generation | Workflow JSON passes structural validation |
| n8n import | Workflow imports successfully |
| n8n activation | POST webhook is registered |
| n8n execution | Webhook executes more than the trigger node |
| Response | Response exactly matches expected output fields |
| ERPNext before | Required fixture records exist before the run |
| ERPNext after | Expected created/updated ERPNext record exists after the run |
| Mailpit before | Required fixture email exists before the run |
| Mailpit after | Expected new or updated email evidence exists after the run |

For a positive test, all required evidence layers must pass.

## Reusable Generator Requirements

The generator must produce an importable n8n workflow JSON only.

It must not produce Markdown, explanations, comments, or partial fragments.

The generated workflow must:

```text
1. Start with exactly one POST Webhook node.
2. Validate the generic input envelope and process-specific required fields.
3. Call only allowed systems from this contract and the process-specific setup.
4. Check API responses before continuing.
5. Create or update only the records required by the expected positive test.
6. Return the exact expected output JSON through respondToWebhook.
7. Include stable node names and valid connections.
8. Avoid conceptual helper systems unless explicitly provided.
```

## Process-Specific Extension Points

Each process may add a narrower system contract.

The process-specific contract may define:

```text
required input_payload fields
expected output fields
allowed ERPNext DocTypes
allowed Mailpit lookups
fixture identifiers
positive state transitions
negative/failure behavior
```

If this reusable contract conflicts with a process-specific contract, the more
specific contract wins only when it declares a real reachable system or API.

Conceptual process descriptions never override the runtime restrictions above.
