# Kleines n8n-Testbeispiel

## Ziel

Ein kleiner n8n-Workflow soll gegen eine natuerlichsprachige Beschreibung validiert werden.

## Workflow-Idee

- Start mit `Manual Trigger`
- `Create Receiving Report`
- Alternative Validierung ueber `Invoice Path Decision`
- Danach parallele Zahlungsaktivitaeten
- Prozessende nach Zusammenfuehrung aller relevanten Zweige

## Erwartung an die gute Beschreibung

- Start wird genannt
- `Create Receiving Report` wird genannt
- beide Alternativpfade werden erkennbar
- die parallelen Zahlungsschritte werden erkennbar
- das Prozessende wird genannt

## Erwartung an die schlechte Beschreibung

- wichtige Schritte fehlen
- keine Alternative erwaehnt
- keine Parallelitaet erwaehnt
- Ende fehlt oder ist unklar
