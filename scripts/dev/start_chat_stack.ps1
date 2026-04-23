$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$frontendRoot = Join-Path $repoRoot "frontend"
$frontendSource = Join-Path $frontendRoot "src"
$frontendEnv = Join-Path $frontendRoot ".env.local"
$logRoot = Join-Path $repoRoot "artifacts\logs"

New-Item -ItemType Directory -Force -Path $logRoot | Out-Null

if (-not (Test-Path $frontendEnv)) {
    @"
OPENAI_BASE_URL=http://127.0.0.1:8000/v1
OPENAI_API_KEY=buddy-local
PUBLIC_APP_NAME=Buddy Chat
PUBLIC_APP_DESCRIPTION="Buddy orchestrates OpenClaw to build and validate n8n workflows."
"@ | Set-Content -Path $frontendEnv -Encoding UTF8
}

if (-not (Test-Path $frontendSource)) {
    Write-Warning "frontend/src fehlt. Bitte die vollstaendigen Hugging Face Chat UI Quellen in frontend/ bereitstellen, bevor npm run dev gestartet wird."
    Write-Warning "Das Backend wird trotzdem gestartet; Chat UI kann danach mit OPENAI_BASE_URL=http://127.0.0.1:8000/v1 angebunden werden."
}

function Start-DevProcess {
    param(
        [Parameter(Mandatory = $true)]
        [string] $FilePath,
        [Parameter(Mandatory = $true)]
        [string[]] $Arguments,
        [Parameter(Mandatory = $true)]
        [string] $WorkingDirectory,
        [Parameter(Mandatory = $true)]
        [string] $Name
    )

    $stdout = Join-Path $logRoot "$Name.out.log"
    $stderr = Join-Path $logRoot "$Name.err.log"
    Remove-Item $stdout, $stderr -ErrorAction SilentlyContinue

    $process = Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -PassThru

    Write-Host "$Name gestartet (PID $($process.Id)); Logs: $stdout / $stderr"
}

function Wait-ForBackend {
    $healthUrl = "http://127.0.0.1:8000/health"
    for ($attempt = 1; $attempt -le 20; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                Write-Host "Backend ist erreichbar: $healthUrl"
                return
            }
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }

    Write-Warning "Backend war nach 20 Sekunden noch nicht erreichbar. Frontend wird trotzdem gestartet; pruefe artifacts\logs\backend.err.log."
}

Start-DevProcess `
    -FilePath "python" `
    -Arguments @("backend/api_app.py") `
    -WorkingDirectory $repoRoot `
    -Name "backend"

Wait-ForBackend

if (Test-Path $frontendSource) {
    Start-DevProcess `
        -FilePath "npm.cmd" `
        -Arguments @("run", "dev") `
        -WorkingDirectory $frontendRoot `
        -Name "frontend"
}

Write-Host "Backend gestartet auf http://127.0.0.1:8000"
Write-Host "Chat UI nutzt OPENAI_BASE_URL=http://127.0.0.1:8000/v1"
if (Test-Path $frontendSource) {
    Write-Host "Chat UI startet standardmaessig auf http://localhost:5173"
}
