# Kleines Evaluationsdesign

## Ziel

In kleiner Form soll geprueft werden, ob eine Textbeschreibung den Inhalt eines Graphviz-Workflows korrekt wiedergibt.

## Eingabe

- ein Workflow als `.gv`
- eine Textbeschreibung als `.txt`

## Was geprueft wird

- Start wird sprachlich erwaehnt
- Ende wird sprachlich erwaehnt
- zentrale Aktivitaeten werden genannt
- OR-Splits werden als Alternative oder optionale Pfade erkennbar
- AND-Splits werden als parallel beschrieben

## Kleiner Score

- `start_mentioned`
- `end_mentioned`
- `tasks_coverage`
- `and_parallel_mentioned`
- `or_alternative_mentioned`

## Beispiel-Interpretation

- `5/5`: Beschreibung ist fuer einen ersten Prototyp sehr plausibel
- `3/5`: teilweise passend, aber wichtige Workflow-Eigenschaften fehlen
- `0-2/5`: Beschreibung ist als Validierungsobjekt unzureichend

## Limitationen

- reine Wortsuche ist noch keine echte semantische Validierung
- Synonyme koennen uebersehen werden
- falsche Reihenfolgen werden nur begrenzt erkannt
- spaeter sollte ein LLM- oder Graph-basierter Fehlabgleich ergaenzt werden
