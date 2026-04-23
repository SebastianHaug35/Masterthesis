# n8n Mini Setup

Die zentrale Projektuebersicht liegt jetzt in der Root-[README](../../README.md).

Dieses Verzeichnis enthaelt das n8n-Mini-Setup fuer Workflow-Validierung, Referenzbeispiele und Evaluationsentwuerfe.

Schnellstart:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis\n8n\validate_n8n_example.ps1 `
  -WorkflowFile .\thesis\n8n\examples\account_payable_process_1_n8n.json `
  -TextFile .\thesis\n8n\examples\account_payable_process_1_n8n_good.txt
```

Workflow gegen Referenzbeschreibung und Referenzspezifikation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis\n8n\validate_n8n_workflow_against_reference.ps1 `
  -WorkflowFile .\thesis\n8n\examples\account_payable_process_1_n8n_workflow_good.json `
  -ReferenceTextFile .\thesis\n8n\examples\account_payable_process_1_reference.txt `
  -ReferenceSpecFile .\thesis\n8n\examples\account_payable_process_1_reference_spec.json
```
