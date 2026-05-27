# E. Lokales Email-System

## Aufgabe

Das Email-System wird nur lokal betrieben. Es dient dazu, Email-basierte Workflow-Schritte realistisch zu testen, ohne externe Emails zu senden oder echte Mailkonten zu verwenden.

## Betrieb

- Host: dieses System / lokale Testumgebung.
- System: Mailpit.
- SMTP-Port: `127.0.0.1:1025`.
- Web/API-Port: `127.0.0.1:8077`.
- Versand und Empfang bleiben lokal.
- Es werden nur lokale Testadressen verwendet.

Die Docker-Compose-Konfiguration liegt unter:

```text
infra/email/docker-compose.yml
```

Start:

```bash
scripts/dev/email-start.sh
```

Stop:

```bash
scripts/dev/email-stop.sh
```

Logs:

```bash
scripts/dev/email-logs.sh
```

Weboberflaeche und API:

```text
http://127.0.0.1:8077
```

Aktuell verifizierter Stand:

```text
Mailpit v1.21.8
SMTP erreichbar unter 127.0.0.1:1025
Web/API erreichbar unter http://127.0.0.1:8077
Testmail von noreply@test.local an invoice@test.local erfolgreich empfangen
```

n8n kann fuer ausgehende Test-Emails den lokalen SMTP-Endpunkt verwenden:

```text
host: 127.0.0.1
port: 1025
secure: false
auth: none
```

## Lokale Testadressen

Beispiele:

```text
invoice@test.local
accounting@test.local
approver@test.local
noreply@test.local
```

Diese Adressen duerfen nicht fuer externen Versand verwendet werden. Das System soll so konfiguriert werden, dass Emails lokal abgefangen und fuer Tests abrufbar bleiben.

## Rolle im Testaufbau

- Triggert Workflows ueber eingehende Test-Emails.
- Erfasst ausgehende Emails des n8n-Workflows.
- Ermoeglicht die Pruefung von Empfaenger, Betreff, Inhalt und Anhangen.

## Geeignete Systemklasse

Ein lokaler SMTP-/Inbox-Testserver ist geeignet, zum Beispiel ein System mit:

- SMTP-Eingang fuer n8n.
- Weboberflaeche oder API zur Pruefung empfangener Emails.
- Keine Weiterleitung an externe Mailserver.

## Schnittstellen

- Von A Frontend / ChatUI-Node: Trigger oder Ergebnispruefung.
- Von C n8n-Instanz: Email senden oder Email-Ereignisse verarbeiten.

## Hypothesenbezug

- Hypothese A: Das Email-System liefert Trigger und beobachtbare Ergebnisse.
- Hypothese B: Fehlende oder falsche Emails koennen als Fehlerfeedback an OpenClaw zurueckgegeben werden.
- Hypothese C: Email-Zustaende koennen durch Validity Gates geprueft werden.
