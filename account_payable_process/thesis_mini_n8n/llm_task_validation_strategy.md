# Strategie zur Validierung von LLM-Aufgaben in n8n-Workflows

## Ziel

Dieser Abschnitt beschreibt, wie LLM-Knoten innerhalb eines n8n-Workflows bewertet werden koennen, ohne die komplette inhaltliche Wahrheit der LLM-Ausgabe validieren zu muessen.

## Warum ein eigener Teil notwendig ist

LLM-Knoten unterscheiden sich von klassischen Integrations- und Logik-Knoten:

- ihre Ausgabe ist nicht vollstaendig deterministisch
- ihre Qualitaet haengt vom Prompt ab
- ihre Fehler sind oft semantisch statt rein strukturell

Deshalb sollten LLM-Knoten nicht nur mit normalen Strukturregeln bewertet werden.

## Zwei zu vergleichende Ansaetze

### A. LLM-as-a-Judge

Das Judge-Modell bewertet:

- ob der LLM-Knoten fachlich sinnvoll eingesetzt wird
- ob der Prompt-Zweck zur Workflow-Beschreibung passt
- ob der Knoten an der richtigen Stelle im Workflow liegt
- ob sein Ergebnis plausibel weiterverarbeitet wird

### B. Regelbasierte Approximation ohne Judge-Modell

Die Approximation prueft:

- ob ein LLM-Knoten an einer erwarteten Stelle liegt
- ob nachgelagerte Validierung vorhanden ist
- ob kritische Entscheidungen nicht ausschliesslich vom LLM getroffen werden
- ob der Name und Zweck des LLM-Knotens mit der Beschreibung uebereinstimmen
- ob erwartete Folgeknoten nach dem LLM vorkommen

## Regelideen fuer die Approximation

- `Position Rule`: Der LLM-Knoten muss zwischen den fachlich erwarteten Vor- und Nachschritten liegen.
- `Guard Rule`: Bei kritischen Entscheidungen muss nach dem LLM eine regelbasierte Pruefung oder ein Freigabeschritt folgen.
- `Purpose Rule`: Der Knotenname oder eine Kurzbeschreibung muss den erwarteten Zweck erkennen lassen.
- `Branch Rule`: Das Ergebnis des LLM-Knotens muss in den korrekten Branch fliessen.
- `Safety Rule`: Ein LLM darf keine finale Zahlung oder Freigabe ohne weitere Validierung ausloesen.

## Warum die Approximation wissenschaftlich interessant ist

Wenn diese vereinfachte Validierung bei einem Teil der LLM-Aufgaben bereits gute Ergebnisse liefert, dann waere ein teurer Judge-Ansatz nicht immer notwendig.

Wenn sie dagegen nur bei einfachen Faellen funktioniert, waere das ebenfalls ein wertvolles Ergebnis:

- einfache LLM-Aufgaben sind regelbasiert ausreichend pruefbar
- komplexe semantische LLM-Aufgaben brauchen ein Judge-Modell

## Erwartung

Die regelbasierte Approximation wird wahrscheinlich:

- bei klaren Platzierungs- und Guard-Fehlern gut sein
- bei subtilen Prompt- und Bedeutungsfehlern schwaecher sein

Der Vergleich mit einem Judge-Modell liefert damit bewusst keine triviale Entweder-oder-Aussage, sondern ein abgestuftes Bild.
