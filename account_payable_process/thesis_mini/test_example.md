# Kleines Testbeispiel

## Datensatzobjekt

- Workflow: `account_payable_process_1.gv`
- Beschreibung: `account_payable_process_1.txt`

## Erwartung fuer das gute Beispiel

- Start: `send to the receiving department`
- Danach: `create a receiving report`
- Danach ein OR-Split mit:
- `gather the vendors invoice`
- `double check a three-way match`
- Danach ein AND-Split mit:
- `schedule the payment`
- `store in paid invoice file`
- `create voucher for the documents`
- Nach `schedule the payment` folgt:
- `enter the invoice into the accounts payable account`
- Am Ende endet der Prozess

## Guter Testfall

- Die vorhandene Datei `account_payable_process_1.txt`
- Erwartung: hohe Abdeckung, Parallelitaet erkannt, Ende erwaehnt

## Schlechter Testfall

- Die Datei `examples/account_payable_process_1_bad.txt`
- Erwartung: mehrere Checks schlagen fehl, vor allem OR und AND

## Nutzen fuer die Thesis

- zeigt Ground-Truth gegen absichtlich korrumpierte Beschreibung
- zeigt ein minimales regelbasiertes Validierungsverfahren
- kann spaeter durch LLM-as-a-Judge erweitert werden
