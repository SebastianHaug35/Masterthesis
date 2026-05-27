$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$preparer = Join-Path $projectRoot "experiments\hypothesis_a\prepare_erpnext_mailpit_fixture.py"

python $preparer @args
exit $LASTEXITCODE
