$ErrorActionPreference = "Stop"

param(
  [string]$WorkflowPath = "",
  [string]$N8nBin = "C:\nvm4w\nodejs\node_modules\n8n\bin\n8n"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$userFolder = Join-Path $projectRoot "artifacts\n8n\user"

if ($WorkflowPath -eq "") {
  $WorkflowPath = Join-Path $projectRoot "artifacts\hypothesis_a\generated_workflows\account_payable_process_0\account_payable_process_0_workflow_latest.json"
}

if (-not (Test-Path $WorkflowPath)) {
  throw "Workflow file not found: $WorkflowPath"
}

New-Item -ItemType Directory -Force -Path $userFolder | Out-Null

$env:N8N_USER_FOLDER = $userFolder
$env:N8N_DIAGNOSTICS_ENABLED = "false"
$env:N8N_VERSION_NOTIFICATIONS_ENABLED = "false"
$env:N8N_SECURE_COOKIE = "false"
$env:GENERIC_TIMEZONE = "Europe/Berlin"

Write-Output "Importing workflow:"
Write-Output $WorkflowPath

node $N8nBin import:workflow --input=$WorkflowPath

Write-Output ""
Write-Output "Imported into n8n user folder:"
Write-Output $userFolder
Write-Output ""
Write-Output "Next:"
Write-Output "1. Start n8n: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\n8n-start.ps1"
Write-Output "2. Open http://127.0.0.1:5678"
Write-Output "3. Activate workflow account_payable_process_0"
Write-Output "4. Run workflow test:"
Write-Output "   powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1 --mode workflow --workflow-url http://127.0.0.1:5678/webhook/account_payable_process_0"

exit $LASTEXITCODE
