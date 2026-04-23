$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$userFolder = Join-Path $projectRoot "artifacts\n8n\user"
$logFolder = Join-Path $projectRoot "artifacts\n8n\logs"

New-Item -ItemType Directory -Force -Path $userFolder, $logFolder | Out-Null

$n8nBin = "C:\nvm4w\nodejs\node_modules\n8n\bin\n8n"
$runnerBin = "C:\nvm4w\nodejs\node_modules\n8n\node_modules\@n8n\task-runner\dist\start.js"
$runnerToken = "local-dev-runner-token"

$env:N8N_USER_FOLDER = $userFolder
$env:N8N_PORT = "5678"
$env:N8N_HOST = "127.0.0.1"
$env:N8N_PROTOCOL = "http"
$env:N8N_DIAGNOSTICS_ENABLED = "false"
$env:N8N_VERSION_NOTIFICATIONS_ENABLED = "false"
$env:N8N_SECURE_COOKIE = "false"
$env:N8N_RUNNERS_MODE = "external"
$env:N8N_RUNNERS_AUTH_TOKEN = $runnerToken
$env:N8N_RUNNERS_TASK_BROKER_URI = "http://127.0.0.1:5679"
$env:GENERIC_TIMEZONE = "Europe/Berlin"

$n8nOut = Join-Path $logFolder "n8n.out.log"
$n8nErr = Join-Path $logFolder "n8n.err.log"
$runnerOut = Join-Path $logFolder "task-runner.out.log"
$runnerErr = Join-Path $logFolder "task-runner.err.log"

$n8nProcess = Start-Process -FilePath "node" -ArgumentList @($n8nBin, "start") -RedirectStandardOutput $n8nOut -RedirectStandardError $n8nErr -PassThru

$grantToken = $null
for ($attempt = 1; $attempt -le 30; $attempt++) {
  Start-Sleep -Seconds 2
  try {
    $response = Invoke-RestMethod `
      -Uri "http://127.0.0.1:5679/runners/auth" `
      -Method Post `
      -ContentType "application/json" `
      -Body (@{ token = $runnerToken } | ConvertTo-Json -Compress) `
      -TimeoutSec 5
    $grantToken = $response.data.token
    break
  } catch {
    if ($attempt -eq 30) {
      throw
    }
  }
}

$env:N8N_RUNNERS_GRANT_TOKEN = $grantToken
Write-Output "grant token length: $($grantToken.Length)"
$runnerProcess = Start-Process -FilePath "node" -ArgumentList @($runnerBin) -RedirectStandardOutput $runnerOut -RedirectStandardError $runnerErr -PassThru

Write-Output "n8n pid: $($n8nProcess.Id)"
Write-Output "task runner pid: $($runnerProcess.Id)"
Write-Output "n8n URL: http://127.0.0.1:5678"
