# F. Validity Gates

## Aufgabe

Validity Gates sind Pruefdienste, die bei Hypothese C eingesetzt werden. Sie validieren Workflow-Zustaende, Zwischenergebnisse oder fachliche Bedingungen waehrend der Ausfuehrung.

## Betrieb

- Host: Hostinger-Container.
- Ports: `8071-8074`.

## Rolle im Testaufbau

- Pruefen Zwischenergebnisse aus n8n.
- Vergleichen Workflow-Zustaende mit definierten Regeln.
- Geben Validierungsentscheidungen oder Hinweise an n8n zurueck.

## Beispiele fuer Pruefungen

- Existiert der referenzierte ERPNext-Datensatz?
- Passt der Rechnungsbetrag zur Bestellung?
- Wurde eine Email an die richtige lokale Testadresse gesendet?
- Ist ein Zwischenergebnis formal korrekt?
- Ist eine fachliche Bedingung erfuellt, bevor der Workflow fortgesetzt wird?

## Schnittstellen

- Von C n8n-Instanz: zu pruefende Daten, Zustandsinformationen oder Zwischenergebnisse.
- Zu C n8n-Instanz: Ergebnis der Validierung und Hinweise.

## Hypothesenbezug

- Hypothese A: nicht verwendet.
- Hypothese B: nicht verwendet.
- Hypothese C: zentraler Bestandteil von Schritt 3b.

