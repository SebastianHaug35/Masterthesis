# Hypothesis A: Simulated Business System

This document describes the local, reproducible business-system simulation used for Hypothesis A.

The goal is to test generated n8n workflows through real HTTP calls while keeping the environment deterministic and independent from production systems, Docker, credentials, or external network access.

## Components

The simulation is implemented as a local HTTP service:

- `experiments/hypothesis_a/mock_business_system.py`
- start script: `scripts/mock-business-start.ps1`
- stop script: `scripts/mock-business-stop.ps1`
- smoke test: `scripts/mock-business-smoke-test.ps1`

The service runs on:

```text
http://127.0.0.1:8088
```

It simulates:

- ERP / procurement data
- receiving reports
- inbound vendor invoice email
- document management system
- workflow case database
- downstream queue

## Reproducible Start

Start the simulation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-start.ps1
```

Run the smoke test:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-smoke-test.ps1
```

Stop the simulation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-stop.ps1
```

## Core Endpoints

Health check:

```http
GET /health
```

ERP purchase-order lookup:

```http
GET /erp/purchase-orders/by-po/{po_number}
```

Receiving report lookup:

```http
GET /receiving/reports/{receiving_report_id}
```

Vendor invoice lookup:

```http
GET /email/invoice/by-po/{po_number}
```

DMS document completeness:

```http
GET /dms/completeness/case/{case_id}
```

Stamp documents:

```http
POST /dms/stamp
Content-Type: application/json

{
  "case_id": "AP-2026-0001"
}
```

Archive document package:

```http
POST /dms/archive
Content-Type: application/json

{
  "case_id": "AP-2026-0001"
}
```

Reset deterministic state:

```http
POST /admin/reset
```

Seed deterministic state with overrides:

```http
POST /admin/seed
```

## First Process Test Case

The first concrete test case is:

```text
thesis/n8n/process_io/processes/account_payable_process_0/account_payable_process_0_test_cases.json
```

It represents the happy path for `account_payable_process_0`:

- purchase order exists
- receiving report exists
- vendor invoice exists
- document package is complete
- documents can be stamped
- archive location is created

## Relevance for Hypothesis A

This setup supports Hypothesis A because workflows are not only inspected statically. They must execute against service interfaces and preserve business data across multiple system calls.

The setup is still controlled:

- same input produces same output
- test data is local and deterministic
- no external credentials are needed
- failure cases can be injected later through `/admin/seed`
- n8n workflows can be run repeatedly under identical conditions

## Test Runner

The reproducible test runner is documented in:

```text
docs/hypothesis_a_test_runner.md
```

It can execute the first process test case in reference mode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1
```

The runner writes reports to:

```text
artifacts/hypothesis_a/runs
```
