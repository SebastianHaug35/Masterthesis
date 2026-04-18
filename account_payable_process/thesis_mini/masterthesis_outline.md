# Mini-Aufbau der Masterthesis

## 1. Einleitung

- Problem: LLMs erzeugen strukturierte Workflows, aber deren Korrektheit ist schwer zu pruefen.
- Motivation: Fehler in Workflows koennen zu falscher Prozesslogik, fehlenden Schritten oder inkorrekten Parallelitaeten fuehren.
- Ziel: Untersuchen, wie gut verschiedene Validierungsstrategien Workflow-Fehler erkennen.
- Forschungsfokus: Zunaechst Graphviz-Workflows mit zugehoerigen Textbeschreibungen.

## 2. Forschungsfrage

- Wie gut koennen LLM-basierte und regelbasierte Verfahren die Korrektheit von Graphviz-Workflows gegen natuerlichsprachige Beschreibungen validieren?

## 3. Unterfragen

- Welche Fehlerarten lassen sich besonders gut erkennen?
- Wie veraendert sich die Erkennungsleistung bei steigender Workflow-Komplexitaet?
- Wie teuer sind die Verfahren im Vergleich, zum Beispiel in Tokens oder Laufzeit?

## 4. Grundlagen

- Workflow-Repraesentationen als gerichtete Graphen
- Graphviz DOT als maschinenlesbare Prozessdarstellung
- Natuerlichsprachige Prozessbeschreibungen
- LLM-as-a-Judge
- Regelbasierte Validierung

## 5. Datenbasis

- Vorhandene `.gv`-Dateien als Ground-Truth-Workflows
- Vorhandene `.txt`-Dateien als Textbeschreibungen
- Optional: paraphrasierte Varianten aus `paraphrased`

## 6. Fehlerklassen

- Strukturfehler: fehlende Kanten, zusaetzliche Kanten, Zyklen, fehlender Start oder fehlendes Ende
- Kontrollflussfehler: falsche Reihenfolge, falsche Parallelitaet, falsche Alternativpfade
- Semantikfehler: fehlende Aktivitaeten, erfundene Aktivitaeten, inhaltliche Widersprueche

## 7. Methoden

- Methode A: Direktes LLM-Urteil ueber Graph plus Beschreibung
- Methode B: LLM-generierte Testfaelle fuer Workflow-Validierung
- Methode C: Hybridansatz aus semantischer Interpretation und regelbasierter Pruefung

## 8. Evaluation

- Metriken: Accuracy, Precision, Recall, F1
- Robustheit nach Komplexitaet: Anzahl Knoten, Kanten, Tiefe, Anzahl Splits
- Kosten: Tokens, Laufzeit, Anzahl der Modellaufrufe

## 9. Erwarteter Beitrag

- Systematischer Vergleich von Validierungsstrategien
- Klarere Aussage, wann reine LLM-Pruefung ausreicht und wann Regeln noetig sind
- Uebertragbare Methodik fuer spaetere n8n-Workflows

## 10. Fazit und Ausblick

- Grenzen der Graphviz-Studie
- Uebertragung auf JSON-basierte Workflow-Systeme wie n8n
