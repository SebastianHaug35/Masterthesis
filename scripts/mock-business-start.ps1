$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$logFolder = Join-Path $projectRoot "artifacts\mock-business-system\logs"
New-Item -ItemType Directory -Force -Path $logFolder | Out-Null

$out = Join-Path $logFolder "mock-business-system.out.log"
$err = Join-Path $logFolder "mock-business-system.err.log"
$serverScript = Join-Path $projectRoot "experiments\hypothesis_a\mock_business_system.py"

$python = (Get-Command python).Source

$process = Start-Process `
  -FilePath $python `
  -ArgumentList @($serverScript, "--host", "127.0.0.1", "--port", "8088") `
  -RedirectStandardOutput $out `
  -RedirectStandardError $err `
  -PassThru

for ($attempt = 1; $attempt -le 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8088/health" -Method Get -TimeoutSec 2
    if ($health.data.status -eq "ok") {
      break
    }
  } catch {
    if ($attempt -eq 20) {
      if ($process.HasExited) {
        throw "Mock business system exited during startup. See $err"
      }
      throw
    }
  }
}

Write-Output "mock business system pid: $($process.Id)"
Write-Output "mock business system URL: http://127.0.0.1:8088"
