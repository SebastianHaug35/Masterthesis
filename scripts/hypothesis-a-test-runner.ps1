$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runner = Join-Path $projectRoot "experiments\hypothesis_a\run_hypothesis_a_tests.py"

python $runner @args
exit $LASTEXITCODE
