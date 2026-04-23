$ErrorActionPreference = "SilentlyContinue"

$connections = netstat -ano | Select-String ":8088"
$pids = @()

foreach ($connection in $connections) {
  $parts = ($connection.Line -split "\s+") | Where-Object { $_ -ne "" }
  if ($parts.Count -gt 0) {
    $candidate = $parts[-1]
    if ($candidate -match "^\d+$") {
      $pids += [int]$candidate
    }
  }
}

$pids | Sort-Object -Unique | ForEach-Object {
  Stop-Process -Id $_ -Force
}
