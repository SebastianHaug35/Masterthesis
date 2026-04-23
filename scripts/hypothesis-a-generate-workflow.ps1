$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$generator = Join-Path $projectRoot "experiments\hypothesis_a\generate_n8n_workflow.py"

python $generator @args
exit $LASTEXITCODE
