# Hypothesis A: Automatic n8n Workflow Generation

This document describes how workflow candidates for Hypothesis A are generated from local process artifacts.

## Goal

The generation step converts a process folder into an importable n8n workflow candidate.

Input:

- process markdown contract
- process test cases
- shared system landscape
- workflow-generation system prompt

Output:

- prompt bundle for reproducibility
- generated n8n workflow JSON
- generation report with validation status

## Files

- Generator: `experiments/hypothesis_a/generate_n8n_workflow.py`
- PowerShell wrapper: `scripts/hypothesis-a-generate-workflow.ps1`
- System prompt: `prompts/hypothesis_a/n8n_workflow_generator_system.txt`
- Output folder: `artifacts/hypothesis_a/generated_workflows`

## Dry Run Without API Key

Use dry-run mode to verify that the full generation prompt can be assembled without calling the API:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-generate-workflow.ps1 --dry-run
```

This writes:

```text
artifacts/hypothesis_a/generated_workflows/account_payable_process_0/account_payable_process_0_generation_prompt_latest.json
```

## API Key

The generator reads `OPENAI_API_KEY` from:

```text
frontend/.env
```

or:

```text
.env
```

The key is not written to artifacts.

Optional model override:

```text
OPENAI_MODEL=<model-name>
```

If no model is configured, the script uses its default model setting.

## Generate Workflow

After `OPENAI_API_KEY` is set:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-generate-workflow.ps1
```

Expected outputs:

```text
artifacts/hypothesis_a/generated_workflows/account_payable_process_0/account_payable_process_0_workflow_latest.json
artifacts/hypothesis_a/generated_workflows/account_payable_process_0/account_payable_process_0_generation_report_latest.json
```

The generator performs a basic structural validation:

- required top-level n8n keys exist
- node names are unique
- required node types are present
- connections reference existing nodes

## Test Generated Workflow

Import the latest generated workflow into the same local n8n user folder used by `scripts/n8n-start.ps1`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-import-workflow.ps1
```

Then start n8n:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\n8n-start.ps1
```

Open:

```text
http://127.0.0.1:5678
```

Activate the imported workflow `account_payable_process_0`.

After importing and activating the generated workflow in n8n, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1 --mode workflow --workflow-url http://127.0.0.1:5678/webhook/account_payable_process_0
```

The workflow test uses the same test case contract as the reference test. This keeps the evaluation comparable:

- reference mode validates the baseline behavior
- workflow mode validates the generated n8n workflow behavior

## Reproducibility

Every generation run stores the exact prompt bundle used for the API call. This makes the generated workflow auditable and reproducible for the thesis evaluation.
