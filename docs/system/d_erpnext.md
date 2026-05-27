# D. ERPNext

## Aufgabe

ERPNext ist das Open-Source-ERP-System im Testaufbau. Es ersetzt ein rein simuliertes ERP-System durch ein realistischeres Zielsystem fuer Prozessdaten.

## Betrieb

- Host: dieses System / lokale Testumgebung.
- System: ERPNext, self-hosted per Docker Compose.
- ERPNext-Version: `frappe/erpnext:v16.16.0`.
- Web-Port: `127.0.0.1:8076`.
- Interner Container-Port: `8080`.
- Standard-Login fuer die Testinstanz:

```text
URL: http://127.0.0.1:8076
Benutzer: Administrator
Passwort: admin
```

Die Docker-Compose-Grundlage stammt aus dem offiziellen `frappe_docker`-Repository:

```text
infra/erpnext/frappe_docker
Commit: 473f08a
```

Das lokale Port-Override liegt hier:

```text
infra/erpnext/compose.override.yml
```

Start:

```bash
scripts/dev/erpnext-start.sh
```

Stop:

```bash
scripts/dev/erpnext-stop.sh
```

Status:

```bash
scripts/dev/erpnext-ps.sh
```

Logs:

```bash
scripts/dev/erpnext-logs.sh
```

Aktuell verifizierter Stand:

```text
ERPNext antwortet mit HTTP 200 auf http://127.0.0.1:8076
Site-Name: frontend
MariaDB ist healthy
```

Persistente Docker-Volumes:

```text
masterthesis-erpnext_db-data
masterthesis-erpnext_logs
masterthesis-erpnext_redis-queue-data
masterthesis-erpnext_sites
```

## Rolle im Testaufbau

ERPNext stellt fachliche ERP-Daten und Geschaeftsobjekte bereit. n8n-Workflows sollen diese Daten lesen, pruefen oder veraendern.

Moegliche Testobjekte:

- Lieferant.
- Bestellung oder Purchase Order.
- Wareneingang.
- Eingangsrechnung.
- Zahlungs- oder Freigabestatus.

## Testprinzip

Die Tests sollen nicht gegen Produktivdaten laufen. ERPNext wird mit kontrollierten Testdaten betrieben. Jeder Testfall definiert erwartete Ausgangsdaten und erwartete Ergebnisse.

Beispiele fuer pruefbare Ergebnisse:

- Ein Datensatz wurde gefunden.
- Ein Status wurde korrekt geaendert.
- Eine Eingangsrechnung wurde korrekt angelegt oder referenziert.
- Eine fachliche Entscheidung wurde auf Basis der ERP-Daten korrekt getroffen.

## Schnittstellen

- Von C n8n-Instanz: ERP-Aktionen waehrend der Workflow-Ausfuehrung.
- Von A Frontend / ChatUI-Node oder Test Runner: Ergebnispruefung nach der Workflow-Ausfuehrung.
- Web/API-Zugriff lokal ueber `http://127.0.0.1:8076`.

## Hypothesenbezug

- Hypothese A: ERPNext dient als realistisches Zielsystem fuer die Ergebnispruefung.
- Hypothese B: ERPNext macht fachliche Fehler sichtbar, die an OpenClaw zur Verbesserung zurueckgegeben werden koennen.
- Hypothese C: ERPNext liefert Zustandsdaten fuer Validity-Gate-Pruefungen.
