# Docker-Infrastruktur

## Aufgabe

Docker dient als lokale Container-Laufzeit fuer die Testsysteme im Masterthesis-Aufbau. Damit koennen einzelne Systeme reproduzierbar gestartet, gestoppt und separat dokumentiert werden.

## Rolle im Testaufbau

- Startet lokale Dienste wie das Email-System.
- Isoliert technische Abhaengigkeiten einzelner Systeme.
- Macht Ports und Laufzeitkonfiguration explizit.
- Erlaubt reproduzierbare lokale Tests ohne Installation jedes Dienstes direkt auf dem Host.

## Aktuell verwendete Container

| System | Container | Image | Compose-Datei | Ports |
| --- | --- | --- | --- | --- |
| E. Lokales Email-System | `masterthesis-mailpit` | `axllent/mailpit:v1.21` | `infra/email/docker-compose.yml` | `127.0.0.1:1025`, `127.0.0.1:8077` |
| A. Frontend / ChatUI-Node Datenbank | `openclaw-0txg-mongodb-1` | `mongo:7` | OpenClaw-Stack | `27017` |
| D. ERPNext Frontend | `masterthesis-erpnext-frontend-1` | `frappe/erpnext:v16.16.0` | `infra/erpnext/frappe_docker/pwd.yml` + `infra/erpnext/compose.override.yml` | `127.0.0.1:8076` |
| D. ERPNext Datenbank | `masterthesis-erpnext-db-1` | `mariadb:11.8` | `infra/erpnext/frappe_docker/pwd.yml` | intern `3306` |
| D. ERPNext Redis | `masterthesis-erpnext-redis-cache-1`, `masterthesis-erpnext-redis-queue-1` | `redis:6.2-alpine` | `infra/erpnext/frappe_docker/pwd.yml` | intern `6379` |
| C. n8n | Prozess im Container `openclaw-0txg-openclaw-1` | Node/npm n8n binary | manuell per `scripts/dev/n8n-openclaw-start.sh` | `8070` |

## MongoDB fuer Frontend / ChatUI-Node

Die MongoDB des OpenClaw-Stacks dient als persistente Datenbank fuer das Frontend beziehungsweise den ChatUI-Node.

Container:

```text
openclaw-0txg-mongodb-1
```

Interner Docker-Hostname:

```text
mongodb:27017
```

Host-Port:

```text
127.0.0.1:27017
```

Persistenter Datenpfad auf dem Host:

```text
/docker/openclaw-0txg/mongodb-data
```

Verifizierter Healthcheck:

```text
db.adminCommand({ ping: 1 }) -> { ok: 1 }
```

## n8n im OpenClaw-Container

n8n ist im OpenClaw-Container installiert und verwendet den persistenten Datenordner:

```text
/data/.n8n/
```

Der Start muss aktuell explizit erfolgen:

```bash
scripts/dev/n8n-openclaw-start.sh
```

Status:

```bash
scripts/dev/n8n-openclaw-status.sh
```

Logs:

```bash
scripts/dev/n8n-openclaw-logs.sh
```

Wenn n8n nicht gestartet ist, bleibt der Docker-Port `8070` zwar gemappt, im Container lauscht aber kein Prozess auf diesem Port.

## Email-System starten

```bash
scripts/dev/email-start.sh
```

Direkt ueber Docker Compose:

```bash
docker compose -f infra/email/docker-compose.yml up -d
```

## Email-System stoppen

```bash
scripts/dev/email-stop.sh
```

Direkt ueber Docker Compose:

```bash
docker compose -f infra/email/docker-compose.yml down
```

## Logs anzeigen

```bash
scripts/dev/email-logs.sh
```

Direkt ueber Docker Compose:

```bash
docker compose -f infra/email/docker-compose.yml logs -f mailpit
```

## Verifizierter Stand

Der Mailpit-Container wurde erfolgreich gestartet und war im Docker-Status `healthy`.

```text
Container: masterthesis-mailpit
SMTP: 127.0.0.1:1025
Web/API: http://127.0.0.1:8077
```

Eine lokale Testmail von `noreply@test.local` an `invoice@test.local` wurde erfolgreich empfangen.

## ERPNext starten

```bash
scripts/dev/erpnext-start.sh
```

Direkt ueber Docker Compose:

```bash
docker compose -p masterthesis-erpnext -f infra/erpnext/frappe_docker/pwd.yml -f infra/erpnext/compose.override.yml up -d
```

Der lokale Override bindet das ERPNext-Frontend nur an:

```text
127.0.0.1:8076
```

Login fuer die Testinstanz:

```text
URL: http://127.0.0.1:8076
Benutzer: Administrator
Passwort: admin
```

ERPNext stoppen:

```bash
scripts/dev/erpnext-stop.sh
```

ERPNext-Status:

```bash
scripts/dev/erpnext-ps.sh
```

Aktuell verifizierter Stand:

```text
HTTP 200 auf http://127.0.0.1:8076
MariaDB-Container healthy
Site-Name frontend erstellt
```

## Sicherheitsprinzip

Die lokalen Testdienste sollen nur an `127.0.0.1` gebunden werden, sofern kein externer Zugriff fuer einen konkreten Test notwendig ist. Dadurch bleiben SMTP und Web/API des Email-Systems lokal auf dem Host erreichbar und werden nicht oeffentlich exponiert.
