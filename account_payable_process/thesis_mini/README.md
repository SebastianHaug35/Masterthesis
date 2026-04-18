# Mini Setup: Graphviz-Workflow-Validierung

Dieses Mini-Setup zeigt in kleiner Form, wie eine Masterarbeit zu LLM-basierter Workflow-Validierung fuer Graphviz-Workflows aufgebaut werden kann.

Enthalten sind:

- ein knapper Thesis-Aufbau in Stichpunkten
- ein kleines Evaluationsdesign
- ein konkretes Testbeispiel
- ein einfaches Validierungsskript fuer `.gv` plus `.txt`

Schnellstart:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis_mini\validate_graphviz_example.ps1 `
  -GraphFile .\account_payable_process_1.gv `
  -TextFile .\account_payable_process_1.txt
```

Negativbeispiel:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\thesis_mini\validate_graphviz_example.ps1 `
  -GraphFile .\account_payable_process_1.gv `
  -TextFile .\thesis_mini\examples\account_payable_process_1_bad.txt
```
