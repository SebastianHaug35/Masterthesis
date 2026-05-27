# Hypothesis A: First Workflow Test Setup

This document describes the system-oriented test setup for the first workflow,
`account_payable_process_0`.

The setup focuses on observable system effects, not only on a returned JSON
payload. A workflow run is positive only if the expected state is visible in the
participating systems.

## Core Artifact

The machine-readable setup is:

```text
thesis/n8n/process_io/processes/account_payable_process_0/account_payable_process_0_first_workflow_test_setup.json
```

It defines:

- correlation keys for the first case
- required ERPNext preconditions
- required Mailpit preconditions
- expected ERPNext changes
- expected result email
- document stamping and archive expectations
- recommended workflow-state database evidence
- final pass criteria

## Systems

### ERPNext

ERPNext is the system of record for procurement and accounting data.

Before the workflow run, ERPNext must contain:

- `Company`: `Masterthesis Test GmbH`
- `Supplier`: `Meyer Industrietechnik GmbH`
- `Item`: `MAT-AP-0001`
- submitted `Purchase Order`: `PO-4500012458`
- submitted `Purchase Receipt`: `GR-2026-00441`

After the workflow run, ERPNext must contain or verify:

- submitted `Purchase Invoice` with `bill_no = INV-98451`
- reference to `PO-4500012458`
- reference to `GR-2026-00441`
- supplier `Meyer Industrietechnik GmbH`
- grand total `2915.50 EUR`

ERPNext already owns its own MariaDB service in the local Docker setup. The test
should use ERPNext/Frappe APIs for business objects instead of writing directly
to MariaDB.

Prepare or verify the ERPNext part of the fixture:

```bash
scripts/hypothesis-a-prepare-erpnext-mailpit-fixture.sh --erpnext-only
```

Verify only:

```bash
scripts/hypothesis-a-prepare-erpnext-mailpit-fixture.sh --verify-only --erpnext-only
```

### Mailpit

Mailpit is the local email system.

Before the workflow run, Mailpit must contain the inbound vendor invoice email:

- from `vendor.billing@test.local`
- to `invoice@test.local`
- invoice `INV-98451`
- purchase order `PO-4500012458`

After the workflow run, Mailpit must contain an outbound result email:

- from `noreply@test.local`
- to `accounting@test.local`
- subject contains `AP-2026-0001` and `completed`
- body contains `PO-4500012458`, `INV-98451`, `GR-2026-00441`, and `stamped`

Seed the inbound invoice email into Mailpit:

```bash
scripts/hypothesis-a-prepare-erpnext-mailpit-fixture.sh --mailpit-only
```

### Document Repository

For the first test, the document repository may be represented by the mock DMS
or by an ERPNext attachment/document layer.

The required outcome is:

- purchase order document present
- receiving report document present
- vendor invoice document present
- document package complete
- documents stamped
- archive location created

### Workflow-State Database

A separate workflow-state database is recommended for evidence that does not
belong inside ERPNext business tables:

- workflow case state
- status transitions
- correlation IDs
- validation results
- audit events
- runner report references

This can initially be a JSON artifact or SQLite database and later become a
small service if needed.

## Generate the First Workflow

Before generating and running the workflow, start and prepare the target systems:

```bash
scripts/dev/erpnext-start.sh
scripts/dev/email-start.sh
scripts/hypothesis-a-prepare-erpnext-mailpit-fixture.sh
```

The first-workflow generator includes the ERPNext/Mailpit test case, the system
contract, and the test setup artifact:

```bash
scripts/hypothesis-a-generate-first-workflow.sh
```

PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-generate-first-workflow.ps1
```

Dry run without API call:

```bash
scripts/hypothesis-a-generate-first-workflow.sh --dry-run
```

Outputs are written to:

```text
artifacts/hypothesis_a/generated_workflows/account_payable_process_0
```

## Current Status

The prompt generation path is reproducible. The API call requires a usable
`OPENAI_API_KEY` with available quota.
