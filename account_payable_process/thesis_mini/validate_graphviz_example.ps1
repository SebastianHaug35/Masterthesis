param(
    [Parameter(Mandatory = $true)]
    [string]$GraphFile,

    [Parameter(Mandatory = $true)]
    [string]$TextFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Normalize-Text {
    param([string]$Value)

    $normalized = $Value.ToLowerInvariant()
    $normalized = $normalized -replace '[^a-z0-9\s]', ' '
    $normalized = $normalized -replace '\s+', ' '
    return $normalized.Trim()
}

function Get-Keywords {
    param([string]$Value)

    $stopwords = @(
        "the", "a", "an", "to", "of", "and", "or", "in", "into", "for",
        "all", "your", "when", "then", "once"
    )

    $parts = (Normalize-Text -Value $Value) -split ' '
    $keywords = foreach ($part in $parts) {
        if ($part.Length -ge 4 -and $stopwords -notcontains $part) {
            $part
        }
    }

    @($keywords | Select-Object -Unique)
}

function Get-WorkflowFacts {
    param([string]$Path)

    $lines = Get-Content -LiteralPath $Path
    $tasks = New-Object System.Collections.Generic.List[string]
    $hasAndSplit = $false
    $hasOrSplit = $false

    foreach ($line in $lines) {
        if ($line -match '"(.+?)"\s+\[shape=box\]') {
            $tasks.Add($Matches[1])
            continue
        }

        if ($line -match 'AND_SPLIT') {
            $hasAndSplit = $true
            continue
        }

        if ($line -match 'OR_SPLIT') {
            $hasOrSplit = $true
            continue
        }
    }

    $uniqueTasks = @($tasks | Select-Object -Unique)
    $startTask = if ($uniqueTasks.Count -gt 0) { $uniqueTasks[0] } else { "" }
    $endTask = if ($uniqueTasks.Count -gt 0) { $uniqueTasks[$uniqueTasks.Count - 1] } else { "" }

    [pscustomobject]@{
        Tasks      = $uniqueTasks
        StartTask  = $startTask
        EndTask    = $endTask
        HasAndSplit = $hasAndSplit
        HasOrSplit  = $hasOrSplit
    }
}

$workflow = Get-WorkflowFacts -Path $GraphFile
$textRaw = Get-Content -LiteralPath $TextFile -Raw
$text = Normalize-Text -Value $textRaw

$taskHits = @()
foreach ($task in $workflow.Tasks) {
    $taskKeywords = Get-Keywords -Value $task
    $keywordHits = @($taskKeywords | Where-Object { $text.Contains($_) }).Count
    $threshold = if ($taskKeywords.Count -le 1) { 1 } else { [Math]::Max(1, [Math]::Ceiling($taskKeywords.Count * 0.5)) }
    $mentioned = $keywordHits -ge $threshold
    $taskHits += [pscustomobject]@{
        task = $task
        mentioned = $mentioned
    }
}

$mentionedCount = @($taskHits | Where-Object { $_.mentioned }).Count
$taskCount = @($workflow.Tasks).Count
$taskCoverage = if ($taskCount -eq 0) { 0 } else { [math]::Round($mentionedCount / $taskCount, 2) }

$startMentioned = $false
if ($workflow.StartTask) {
    $startKeywords = Get-Keywords -Value $workflow.StartTask
    $startHits = @($startKeywords | Where-Object { $text.Contains($_) }).Count
    $startMentioned = $startHits -ge [Math]::Max(1, [Math]::Ceiling($startKeywords.Count * 0.5))
}

$endMentioned = $text -match '\bend\b' -or $text -match '\bcompleted\b' -or $text -match '\bcomplete\b'
$andMentioned = (-not $workflow.HasAndSplit) -or $text -match '\bparallel\b'
$orMentioned = (-not $workflow.HasOrSplit) -or $text -match '\bone or more\b' -or $text -match '\balternative\b' -or $text -match '\boption'

$score = 0
foreach ($flag in @($startMentioned, $endMentioned, ($taskCoverage -ge 0.6), $andMentioned, $orMentioned)) {
    if ($flag) { $score++ }
}

Write-Output "graph_file=$GraphFile"
Write-Output "text_file=$TextFile"
Write-Output "start_task=$($workflow.StartTask)"
Write-Output "end_task=$($workflow.EndTask)"
Write-Output "task_count=$taskCount"
Write-Output "task_coverage=$taskCoverage"
Write-Output "start_mentioned=$startMentioned"
Write-Output "end_mentioned=$endMentioned"
Write-Output "and_parallel_mentioned=$andMentioned"
Write-Output "or_alternative_mentioned=$orMentioned"
Write-Output "score=$score/5"
Write-Output ""
Write-Output "task_hits:"
$taskHits | ForEach-Object {
    Write-Output ("- " + $_.task + ": " + $_.mentioned)
}
