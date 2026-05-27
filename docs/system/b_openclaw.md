# B. OpenClaw

## Aufgabe

OpenClaw erzeugt aus einer natuerlichsprachlichen oder strukturierten Workflow-Beschreibung einen importierbaren n8n-Workflow.

## Betrieb

- Host: Hostinger-Container.
- Port: `8080`.

## Rolle im Testaufbau

- Empfaengt die Workflow-Beschreibung von A.
- Erstellt den n8n-Workflow.
- Uebergibt oder schreibt den Workflow an C.
- Erhaelt bei Hypothese B Fehlerfeedback und erzeugt daraus eine verbesserte Workflow-Version.

## Schnittstellen

- Von A Frontend / ChatUI-Node: Workflow-Beschreibung und Fehlerfeedback.
- Zu C n8n-Instanz: generierter Workflow.

## Hypothesenbezug

- Hypothese A: einmalige Workflow-Erzeugung.
- Hypothese B: Workflow-Erzeugung plus Verbesserungsrunde.
- Hypothese C: Workflow-Erzeugung, anschliessende Ausfuehrung mit Validity Gates.

