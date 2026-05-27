# C. n8n-Instanz

## Aufgabe

n8n ist die Workflow-Runtime. Die von OpenClaw erzeugten Workflows werden hier gespeichert, aktiviert und ausgefuehrt.

## Betrieb

- Host: Hostinger-Container.
- Port: `8070`.
- Datenordner: `/data/.n8n/`.
- Environment-Konfiguration:

```text
N8N_USER_FOLDER=/data
```

Damit nutzt n8n `/data/.n8n/` als persistenten Datenordner. Die Workflows bleiben dadurch erhalten und sind auch per CLI sichtbar.

Beispiel fuer CLI-Zugriff:

```bash
N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n
```

Aktueller Betriebsmodus:

- n8n liegt im OpenClaw-Container `openclaw-0txg-openclaw-1`.
- Der Docker-Port `8070` ist auf diesen Container gemappt.
- n8n wird aktuell nicht durch Docker Compose oder systemd automatisch als eigener Dienst gestartet.
- Wenn der Prozess fehlt, ist der Port zwar gemappt, aber HTTP-Anfragen auf `8070` liefern einen Verbindungsfehler.

Start auf dem Host:

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

Aktuell verifizierter Stand:

```text
http://127.0.0.1:8070/healthz -> HTTP 200
http://127.0.0.1:8070 -> HTTP 200
N8N_USER_FOLDER=/data
```

Hinweis: In den n8n-Logs kann ein vorhandener Testworkflow ohne Trigger eine Aktivierungswarnung ausloesen. Das verhindert nicht, dass die n8n-UI und der Dienst laufen.

## Rolle im Testaufbau

- Speichert den durch OpenClaw erzeugten Workflow.
- Fuehrt den Workflow aus.
- Kommuniziert mit ERPNext und dem lokalen Email-System.
- Kommuniziert bei Hypothese C mit den Validity Gates.

## Schnittstellen

- Von B OpenClaw: Workflow-Definition.
- Zu D ERPNext: Lesen und Schreiben fachlicher ERP-Daten.
- Zu E lokalem Email-System: Senden, Empfangen oder Verarbeiten von Test-Emails.
- Zu F Validity Gates: Validierung von Workflow-Zustand und Zwischenergebnissen.

## Hypothesenbezug

- Hypothese A: Workflow ausfuehren und Ergebnis erzeugen.
- Hypothese B: Workflow ausfuehren, Fehler sichtbar machen.
- Hypothese C: Workflow mit Validity-Gate-Pruefungen ausfuehren.
