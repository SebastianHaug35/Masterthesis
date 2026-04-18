# Mini Setup: n8n-Workflow-Validierung

Dieses Mini-Setup ist das n8n-Pendant zum Graphviz-Beispiel.

Enthalten sind:

- ein kleiner n8n-Beispielworkflow als JSON
- eine gute Beschreibung
- eine absichtlich schlechte Beschreibung
- ein einfaches Validierungsskript
- ein Beispiel fuer `richtiger vs. falscher Workflow`
- ein Entwurf fuer das Evaluationskapitel
- eine Strategie zur Validierung von LLM-Knoten
- ein JSON-Format fuer Prozessbeschreibung plus Input und Output

Schnellstart:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis_mini_n8n\validate_n8n_example.ps1 `
  -WorkflowFile .\thesis_mini_n8n\examples\account_payable_process_1_n8n.json `
  -TextFile .\thesis_mini_n8n\examples\account_payable_process_1_n8n_good.txt
```

Negativbeispiel:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis_mini_n8n\validate_n8n_example.ps1 `
  -WorkflowFile .\thesis_mini_n8n\examples\account_payable_process_1_n8n.json `
  -TextFile .\thesis_mini_n8n\examples\account_payable_process_1_n8n_bad.txt
```

Workflow gegen Referenzbeschreibung und Referenzspezifikation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis_mini_n8n\validate_n8n_workflow_against_reference.ps1 `
  -WorkflowFile .\thesis_mini_n8n\examples\account_payable_process_1_n8n_workflow_good.json `
  -ReferenceTextFile .\thesis_mini_n8n\examples\account_payable_process_1_reference.txt `
  -ReferenceSpecFile .\thesis_mini_n8n\examples\account_payable_process_1_reference_spec.json
```

Weitere Orientierung:

- [workflow_validation_example.md](/c:/Users/Nutzer/master/masterthesis/account_payable_process/thesis_mini_n8n/workflow_validation_example.md)
- [evaluation_chapter_draft.md](/c:/Users/Nutzer/master/masterthesis/account_payable_process/thesis_mini_n8n/evaluation_chapter_draft.md)
- [llm_task_validation_strategy.md](/c:/Users/Nutzer/master/masterthesis/account_payable_process/thesis_mini_n8n/llm_task_validation_strategy.md)
- [process_io_contract.md](/c:/Users/Nutzer/master/masterthesis/account_payable_process/thesis_mini_n8n/process_io_contract.md)
- [account_payable_process_1_io.json](/c:/Users/Nutzer/master/masterthesis/account_payable_process/thesis_mini_n8n/examples/account_payable_process_1_io.json)
