# A. Frontend / ChatUI-Node

## Aufgabe

Das Frontend ist der Einstiegspunkt fuer die Tests. Es nimmt die Workflow-Beschreibung entgegen, startet die Ausfuehrung und zeigt das Ergebnis der Pruefung an.

## Rolle im Testaufbau

- Uebergibt die Workflow-Beschreibung an OpenClaw.
- Triggert den generierten Workflow in n8n beziehungsweise ueber das lokale Email-System.
- Prueft nach der Ausfuehrung die beobachtbaren Ergebnisse in ERPNext und im lokalen Email-System.
- Gibt bei Hypothese B Fehler oder Beobachtungen an OpenClaw zurueck.
- Nutzt MongoDB als persistente Datenbank fuer ChatUI-/Frontend-Daten.

## Datenbank

Das Frontend / der ChatUI-Node verwendet die vorhandene MongoDB des OpenClaw-Stacks.

Innerhalb des Docker-Netzwerks ist die Datenbank erreichbar unter:

```text
mongodb:27017
```

Auf dem Host ist der MongoDB-Port aktuell erreichbar unter:

```text
127.0.0.1:27017
```

Der zugehoerige Container ist:

```text
openclaw-0txg-mongodb-1
```

Die persistenten Daten liegen auf dem Host unter:

```text
/docker/openclaw-0txg/mongodb-data
```

## Schnittstellen

- Zu B OpenClaw: Workflow-Beschreibung und optional Fehlerfeedback.
- Zu MongoDB: Persistenz fuer ChatUI-/Frontend-Daten.
- Zu D ERPNext: Pruefung fachlicher Ergebnisse.
- Zu E lokalem Email-System: Trigger und Pruefung von Email-Ergebnissen.

## Hypothesenbezug

- Hypothese A: Start und Ergebnispruefung.
- Hypothese B: zusaetzlich Rueckgabe von Fehlern zur Verbesserung.
- Hypothese C: Start und Ergebnispruefung nach Validity-Gate-Pruefungen.
