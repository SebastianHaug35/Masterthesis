# n8n-Beispiel: Richtiger vs. falscher Workflow

## Idee

Dieses Beispiel prueft nicht verschiedene Beschreibungen gegen denselben Workflow, sondern zwei verschiedene n8n-Workflows gegen dieselbe fachliche Beschreibung.

## Fachliche Beschreibung

- Start mit einem manuellen Trigger
- Danach wird ein Receiving Report erstellt
- Danach gibt es eine Entscheidung mit zwei moeglichen Pfaden:
- `Gather Vendor Invoice`
- `Double Check Three-Way Match`
- Danach werden die Validierungspfade zusammengefuehrt
- Danach folgen drei parallele Aktivitaeten:
- `Schedule Payment`
- `Store In Paid Invoice File`
- `Create Voucher For Documents`
- Nach `Schedule Payment` folgt `Enter Invoice Into Accounts Payable`
- Danach endet der Prozess

## Erwartung

- Der gute Workflow sollte hoch bewertet werden.
- Der schlechte Workflow sollte mehrere Fehler zeigen.

## Typische Fehler im schlechten Workflow

- fehlender alternativer Pfad
- keine parallelen Zahlungsschritte
- fehlender Voucher-Schritt
- falscher Ablauf vor dem Ende
