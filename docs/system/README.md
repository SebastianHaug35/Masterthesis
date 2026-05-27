# Systemdokumentation Testaufbau Hypothesen A-C

Dieser Ordner beschreibt die Systeme A-F des Testaufbaus. Jedes System hat eine eigene Datei, damit Architektur, Betrieb und Testrolle getrennt dokumentiert werden können.

## Systeme

| ID | System | Beschreibung |
| --- | --- | --- |
| A | Frontend / ChatUI-Node | Einstiegspunkt fuer Testfall, Workflow-Beschreibung, Trigger und Ergebnispruefung; nutzt MongoDB `mongodb:27017` |
| B | OpenClaw | Agentensystem zur Erzeugung und Verbesserung von n8n-Workflows |
| C | n8n-Instanz | Workflow-Runtime mit selbst gehostetem persistentem Datenordner |
| D | ERPNext | Open-Source-ERP-System als realistisches Zielsystem fuer ERP-Prozessdaten |
| E | Lokales Email-System | Lokal betriebener Mailserver fuer Testadressen ohne externen Versand |
| F | Validity Gates | Pruefdienste fuer Hypothese C zur Validierung von Workflow-Zustaenden |
| Infrastruktur | Docker | Container-Laufzeit fuer lokal betriebene Testsysteme |

## Hypothesenbezug

- Hypothese A: Schritte 1-4 ohne Schritt 3b.
- Hypothese B: Schritte 1-5 ohne Schritt 3b.
- Hypothese C: Schritte 1-4 mit Schritt 3b.

## Grundidee

OpenClaw erzeugt aus einer Workflow-Beschreibung einen n8n-Workflow. n8n fuehrt diesen Workflow gegen ein realistisches, aber kontrolliertes Testsystem aus. ERPNext ersetzt dabei ein einfaches Mock-ERP. Das Email-System bleibt lokal, damit nur Testadressen verwendet werden und keine externen Emails versendet werden.

Das Ergebnis wird ueber die beobachteten Effekte in ERPNext und im lokalen Email-System geprueft.

Die lokale Container-Infrastruktur ist separat dokumentiert in:

```text
docs/system/docker.md
```
