param(
    [Parameter(Mandatory = $true)]
    [string]$WorkflowFile,

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
        "all", "your", "when", "then", "once", "with"
    )

    $parts = (Normalize-Text -Value $Value) -split ' '
    $keywords = foreach ($part in $parts) {
        if ($part.Length -ge 4 -and $stopwords -notcontains $part) {
            $part
        }
    }

    @($keywords | Select-Object -Unique)
}

function Flatten-Connections {
    param($Connections)

    $edges = @()

    foreach ($sourceProperty in $Connections.PSObject.Properties) {
        $sourceName = $sourceProperty.Name
        $mainGroups = $sourceProperty.Value.main
        if (-not $mainGroups) {
            continue
        }

        foreach ($group in $mainGroups) {
            foreach ($connection in $group) {
                $edges += [pscustomobject]@{
                    source = $sourceName
                    target = $connection.node
                }
            }
        }
    }

    $edges
}

function Get-WorkflowFacts {
    param([string]$Path)

    $workflow = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
    $nodes = @($workflow.nodes)
    $connections = Flatten-Connections -Connections $workflow.connections

    $triggerNodes = @($nodes | Where-Object { $_.type -match 'trigger' })
    $nonMergeNodes = @($nodes | Where-Object { $_.type -notmatch 'merge' })
    $taskNodes = @($nonMergeNodes | Where-Object { $_.type -notmatch 'if' })
    $decisionNodes = @($nodes | Where-Object { $_.type -match '\.if$|\.switch$' })

    $multiOutSources = @($connections | Group-Object source | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)

    $targets = @($connections | Select-Object -ExpandProperty target)
    $startNode = if ($triggerNodes.Count -gt 0) {
        $triggerNodes[0].name
    } else {
        @($nodes | Where-Object { $targets -notcontains $_.name } | Select-Object -First 1 -ExpandProperty name)
    }

    $sourceNames = @($connections | Select-Object -ExpandProperty source)
    $endCandidates = @($nodes | Where-Object { $sourceNames -notcontains $_.name } | Select-Object -ExpandProperty name)
    $endNode = if ($endCandidates.Count -gt 0) { $endCandidates[0] } else { "" }

    [pscustomobject]@{
        Tasks = @($taskNodes | Select-Object -ExpandProperty name)
        StartTask = $startNode
        EndTask = $endNode
        HasAndSplit = $multiOutSources.Count -gt 0
        HasOrSplit = $decisionNodes.Count -gt 0
    }
}

$workflow = Get-WorkflowFacts -Path $WorkflowFile
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
$taskCoverage = if ($taskCount -eq 0) { 0 } else { [Math]::Round($mentionedCount / $taskCount, 2) }

$startKeywords = Get-Keywords -Value $workflow.StartTask
$startHits = @($startKeywords | Where-Object { $text.Contains($_) }).Count
$startMentioned = $startHits -ge [Math]::Max(1, [Math]::Ceiling($startKeywords.Count * 0.5))

$endMentioned = $text -match '\bend\b' -or $text -match '\bcompleted\b' -or $text -match '\bcomplete\b' -or $text -match '\bstops?\b'
$andMentioned = (-not $workflow.HasAndSplit) -or $text -match '\bparallel\b'
$orMentioned = (-not $workflow.HasOrSplit) -or $text -match '\bone of\b' -or $text -match '\bone or more\b' -or $text -match '\balternative\b' -or $text -match '\bdecision\b'

$score = 0
foreach ($flag in @($startMentioned, $endMentioned, ($taskCoverage -ge 0.6), $andMentioned, $orMentioned)) {
    if ($flag) { $score++ }
}

Write-Output "workflow_file=$WorkflowFile"
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
