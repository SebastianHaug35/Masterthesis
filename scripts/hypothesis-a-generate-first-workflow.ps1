$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$generator = Join-Path $projectRoot "experiments\hypothesis_a\generate_n8n_workflow.py"
$processDir = Join-Path $projectRoot "thesis\n8n\process_io\processes\account_payable_process_0"
$testCaseFile = Join-Path $processDir "account_payable_process_0_erpnext_mailpit_test_case.json"
$testSetup = Join-Path $processDir "account_payable_process_0_first_workflow_test_setup.json"
$systemContract = Join-Path $projectRoot "thesis\n8n\process_io\account_payable_process_0_system_contract.md"

python $generator `
  --process-dir $processDir `
  --test-case-file $testCaseFile `
  --system-contract $systemContract `
  --test-setup $testSetup `
  @args

exit $LASTEXITCODE
