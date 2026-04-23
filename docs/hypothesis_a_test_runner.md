# Hypothesis A: Test Runner

This document describes the reproducible local test runner for Hypothesis A.

The runner executes process test cases against deterministic business-system APIs and writes machine-readable reports to `artifacts/hypothesis_a/runs`.

## Components

- Runner: `experiments/hypothesis_a/run_hypothesis_a_tests.py`
- PowerShell wrapper: `scripts/hypothesis-a-test-runner.ps1`
- Test case input: `thesis/n8n/process_io/processes/<process_id>/*_test_cases.json`
- Result output: `artifacts/hypothesis_a/runs/*_latest.json`

The runner uses only the Python standard library.

## Execution Modes

### Reference Mode

Reference mode executes the expected process behavior directly against the simulated business systems.

It is used to verify that:

- the test case is executable
- the mock system contains the required data
- the expected API calls are available
- expected output and observed output match

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1
```

Equivalent explicit command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1 --mode reference
```

By default, the runner starts the mock business system in-process if no external instance is reachable on `http://127.0.0.1:8088`.

If the test should require a separately started mock system:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1 --require-external-mock
```

### Workflow Mode

Workflow mode is the next evaluation step. It triggers a workflow endpoint, for example an n8n webhook, with the same test case input.

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1 --mode workflow --workflow-url http://127.0.0.1:5678/webhook/<workflow-id>
```

The workflow receives:

```json
{
  "process_id": "account_payable_process_0",
  "test_case_id": "account_payable_process_0_happy_path",
  "mock_system_base_url": "http://127.0.0.1:8088",
  "input_payload": {
    "case_id": "AP-2026-0001",
    "po_number": "PO-4500012458",
    "receiving_report_id": "GR-2026-00441"
  }
}
```

The workflow response should either be the expected output directly or an object with an `output` field.

## Report Format

Every run writes:

- a timestamped report, for example `account_payable_process_0_reference_20260423_120832.json`
- a stable latest report, for example `account_payable_process_0_reference_latest.json`

Each report contains:

- `run_id`
- `process_id`
- `mode`
- `summary`
- per-test `status`
- `input_payload`
- `expected_output`
- `observed_output`
- `validation_failures`
- observed HTTP interactions

Status values:

- `passed`: output and expected calls match
- `failed`: runner completed, but validation failed
- `error`: execution failed before validation could complete

## Current Verified Baseline

The first verified baseline is:

```text
process_id: account_payable_process_0
mode: reference
summary: 1 passed, 0 failed, 0 error
```

This means the local simulated business system and the first process test case are executable and reproducible.

## Relevance for Hypothesis A

The runner turns process descriptions into executable tests. This is the bridge between a generated n8n workflow and a thesis-grade evaluation artifact:

- process description defines required behavior
- test case defines data and expected system calls
- simulated business system exposes deterministic APIs
- test runner executes and records the result
- report file becomes evidence for the evaluation

The next step is to connect generated n8n workflow candidates through workflow mode.
