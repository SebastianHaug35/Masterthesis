param(
    [Parameter(Mandatory = $true)]
    [string]$WorkflowFile,

    [Parameter(Mandatory = $true)]
    [string]$ReferenceTextFile,

    [Parameter(Mandatory = $true)]
    [string]$ReferenceSpecFile
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
        "all", "your", "when", "then", "once", "with", "after", "that"
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

    @($edges)
}

function Get-WorkflowFacts {
    param([string]$Path)

    $workflow = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
    $nodes = @($workflow.nodes)
    $connections = Flatten-Connections -Connections $workflow.connections

    $triggerNodes = @($nodes | Where-Object { $_.type -match 'trigger' })
    $decisionNodes = @($nodes | Where-Object { $_.type -match '\.if$|\.switch$' })
    $mergeNodes = @($nodes | Where-Object { $_.type -match 'merge' })
    $multiOutSources = @($connections | Group-Object source | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)

    $targets = @($connections | Select-Object -ExpandProperty target)
    $startNode = if ($triggerNodes.Count -gt 0) {
        $triggerNodes[0].name
    } else {
        @($nodes | Where-Object { $targets -notcontains $_.name } | Select-Object -First 1 -ExpandProperty name)
    }

    $sourceNames = @($connections | Select-Object -ExpandProperty source)
    $terminalNodes = @($nodes | Where-Object { $sourceNames -notcontains $_.name } | Select-Object -ExpandProperty name)

    [pscustomobject]@{
        TaskNames = @($nodes | Select-Object -ExpandProperty name)
        StartTask = $startNode
        TerminalNodes = $terminalNodes
        HasDecision = $decisionNodes.Count -gt 0
        HasParallel = $multiOutSources.Count -gt 0
        HasMerge = $mergeNodes.Count -gt 0
    }
}

$workflow = Get-WorkflowFacts -Path $WorkflowFile
$referenceText = Normalize-Text -Value (Get-Content -LiteralPath $ReferenceTextFile -Raw)
$referenceSpec = Get-Content -LiteralPath $ReferenceSpecFile -Raw | ConvertFrom-Json

$taskHits = @()
foreach ($task in @($referenceSpec.requiredTasks)) {
    $workflowNormalizedNames = @($workflow.TaskNames | ForEach-Object { Normalize-Text -Value $_ })
    $taskNormalized = Normalize-Text -Value $task
    $presentInWorkflow = $workflowNormalizedNames -contains $taskNormalized
    $keywords = Get-Keywords -Value $task
    $hits = @($keywords | Where-Object { $referenceText.Contains($_) }).Count
    $threshold = if ($keywords.Count -le 1) { 1 } else { [Math]::Max(1, [Math]::Ceiling($keywords.Count * 0.5)) }
    $mentioned = $hits -ge $threshold
    $taskHits += [pscustomobject]@{
        task = $task
        present_in_workflow = $presentInWorkflow
        mentioned_in_reference = $mentioned
    }
}

$presentCount = @($taskHits | Where-Object { $_.present_in_workflow }).Count
$taskCount = @($referenceSpec.requiredTasks).Count
$taskCoverage = if ($taskCount -eq 0) { 0 } else { [Math]::Round($presentCount / $taskCount, 2) }

$expectedStart = [string]$referenceSpec.startTask
$startAligned = (Normalize-Text -Value $workflow.StartTask) -eq (Normalize-Text -Value $expectedStart)

$endAligned = $false
foreach ($keyword in @($referenceSpec.endKeywords)) {
    if ($referenceText -match ("\b" + [regex]::Escape($keyword) + "\b")) {
        $endAligned = $true
        break
    }
}

$decisionAligned = ($workflow.HasDecision -eq [bool]$referenceSpec.requiresDecision)
$parallelAligned = ($workflow.HasParallel -eq [bool]$referenceSpec.requiresParallel)

$score = 0
foreach ($flag in @($startAligned, $endAligned, ($taskCoverage -ge 0.7), $decisionAligned, $parallelAligned)) {
    if ($flag) { $score++ }
}

Write-Output "workflow_file=$WorkflowFile"
Write-Output "reference_text_file=$ReferenceTextFile"
Write-Output "reference_spec_file=$ReferenceSpecFile"
Write-Output "start_task=$($workflow.StartTask)"
Write-Output "terminal_nodes=$(@($workflow.TerminalNodes) -join ', ')"
Write-Output "task_count=$taskCount"
Write-Output "task_coverage=$taskCoverage"
Write-Output "start_aligned=$startAligned"
Write-Output "end_aligned=$endAligned"
Write-Output "decision_aligned=$decisionAligned"
Write-Output "parallel_aligned=$parallelAligned"
Write-Output "score=$score/5"
Write-Output ""
Write-Output "task_hits:"
$taskHits | ForEach-Object {
    Write-Output ("- " + $_.task + ": present_in_workflow=" + $_.present_in_workflow + ", mentioned_in_reference=" + $_.mentioned_in_reference)
}
