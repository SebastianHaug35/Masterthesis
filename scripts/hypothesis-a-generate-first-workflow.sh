#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROCESS_DIR="${ROOT_DIR}/thesis/n8n/process_io/processes/account_payable_process_0"

python3 "${ROOT_DIR}/experiments/hypothesis_a/generate_n8n_workflow.py" \
  --process-dir "${PROCESS_DIR}" \
  --test-case-file "${PROCESS_DIR}/account_payable_process_0_erpnext_mailpit_test_case.json" \
  --system-contract "${ROOT_DIR}/thesis/n8n/process_io/account_payable_process_0_system_contract.md" \
  --test-setup "${PROCESS_DIR}/account_payable_process_0_first_workflow_test_setup.json" \
  "$@"
