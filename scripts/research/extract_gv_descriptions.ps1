param(
    [string]$Root = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-LastGraphLabelText {
    param(
        [string]$Path
    )

    $lines = Get-Content -LiteralPath $Path
    $capturedBlocks = New-Object System.Collections.Generic.List[string]
    $isCapturing = $false
    $buffer = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if (-not $isCapturing) {
            $match = [regex]::Match($line, 'fontsize=\d+\s+label="(.*)$')
            if ($match.Success) {
                $isCapturing = $true
                $buffer.Clear()
                $buffer.Add($match.Groups[1].Value)
            }
            continue
        }

        if ($line -match '^\s*"\s*$') {
            $capturedBlocks.Add(($buffer -join "`n"))
            $isCapturing = $false
            continue
        }

        $buffer.Add($line)
    }

    if ($capturedBlocks.Count -eq 0) {
        return $null
    }

    $rawText = $capturedBlocks[$capturedBlocks.Count - 1]
    $rawText = $rawText -replace '\\n', ' '
    $rawText = $rawText -replace '\s+', ' '
    return $rawText.Trim()
}

$gvFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter *.gv | Sort-Object FullName
$written = 0
$skipped = New-Object System.Collections.Generic.List[string]

foreach ($gvFile in $gvFiles) {
    $description = Get-LastGraphLabelText -Path $gvFile.FullName
    if ([string]::IsNullOrWhiteSpace($description)) {
        $skipped.Add($gvFile.FullName)
        continue
    }

    $txtPath = [System.IO.Path]::ChangeExtension($gvFile.FullName, ".txt")
    Set-Content -LiteralPath $txtPath -Value $description -Encoding UTF8
    $written++
}

Write-Output "written=$written"
if ($skipped.Count -gt 0) {
    Write-Output "skipped=$($skipped.Count)"
    $skipped
} else {
    Write-Output "skipped=0"
}
