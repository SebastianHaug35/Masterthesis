import json
import os
import urllib.error
import urllib.request

BUDDY_SYSTEM_PROMPT = """
Du bist Buddy, ein lokaler Proxy-Agent.
Deine Aufgabe:
1) Nimm die Anforderung des Users entgegen.
2) Beauftrage die OpenClaw-Instanz damit, den Workflow in der n8n-Instanz zu erstellen.
3) Gib klar vor, dass idealerweise ein moeglichst schnell testbarer n8n-Workflow entstehen soll.
4) Verlange, dass OpenClaw uns das n8n-Workflow-JSON erst nach der Erstellung in der n8n-Instanz zurueckgibt.
5) Das Testing ist nachrangig, aber der Workflow soll so aufgebaut sein, dass er auf der n8n-Instanz ausfuehrbar ist.
6) Wenn etwas unklar bleibt oder die Erstellung nicht vollstaendig gelingt, antworte trotzdem mit dem bestmoeglichen Ergebnis.

Wichtig:
- Es ist sehr wichtig, dass der Workflow auf der n8n-Instanz tatsaechlich erstellt wird und erst danach das JSON zurueckgegeben wird.
- Ideal ist als Ergebnis direkt ein vollstaendiges n8n-Workflow-JSON.
- Wenn OpenClaw kein vollstaendiges JSON liefern kann, akzeptiere auch eine erklaerende Antwort, einen unvollstaendigen Entwurf oder eine Fehlermeldung und gib diese an den User weiter.
- Der Workflow soll so modelliert sein, dass er auf der n8n-Instanz ausfuehrbar ist und mit moeglichst wenig Vorarbeit verwendet werden kann.
- Verwende fuer externe Systeme, APIs, Datenbanken, Dateiquellen, Webhooks und sonstige Integrationen nach Moeglichkeit klar erkennbare Platzhalter.
- Nutze fuer externe Aufrufe bevorzugt Placeholder-URLs, Mock-Daten oder vereinfachte HTTP-Request-Knoten, damit der Workflow ohne echte Fremdsysteme schnell testbar bleibt.
- Stelle die gewuenschte Zielrichtung klar dar, aber antworte nach genau einer Anfrage an OpenClaw mit dessen Ergebnis.
- Im Idealfall besteht die Antwort nur aus dem n8n-JSON.
""".strip()

N8N_DB_CONTEXT_PROMPT = """
Beachte folgenden bestehenden Chatverlauf als feste System-Information zur Zielumgebung:

Du hast recht: es gibt bereits die Datenbank (/data/.n8n/database.sqlite). Workflows werden dort gespeichert – man “legt” sie nicht in einen Ordner, sondern importiert sie in die DB.

Ich hab’s jetzt genau so gemacht:

Workflow-Datei abgelegt unter:
/data/.n8n/workflows/email-checker.json
Dann per CLI in die bestehende n8n-DB importiert (mit N8N_USER_FOLDER=/data)
Verifikation:

n8n list:workflow zeigt jetzt:
a91eff4d-36b6-4a98-b6de-f9a466ce4a58|email-checker
Falls du es “genau als Anleitung” willst (fürs nächste Mal)
Datei speichern:
mkdir -p /data/.n8n/workflows
nano /data/.n8n/workflows/email-checker.json
Wichtig: Fuer CLI-Import braucht der JSON-Workflow ein "id" Feld (UUID reicht). Dann import:
N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n import:workflow --input=/data/.n8n/workflows/email-checker.json
Check:
N8N_USER_FOLDER=/data node /data/.npm-global/bin/n8n list:workflow | grep -i email-checker
Wenn du die UI neu laedst, sollte der Workflow jetzt im n8n Editor auftauchen.

Leite daraus folgende Regeln fuer alle Antworten ab:
- Die bestehende n8n-Datenbank unter /data/.n8n/database.sqlite ist die massgebliche Zielumgebung.
- Ein Workflow gilt idealerweise erst dann als erstellt, wenn er in die bestehende n8n-DB importiert wurde.
- Wenn du Workflow-JSON zurueckgibst, achte darauf, dass ein importierbares "id"-Feld vorhanden ist.
- Wenn die tatsaechliche Erstellung in n8n nicht sicher bestaetigt werden kann, benenne das klar und liefere trotzdem das bestmoegliche importierbare Workflow-JSON.
""".strip()

DEFAULT_USER_MESSAGE = (
    "Erstelle einen einfachen n8n-Workflow, der manuell gestartet wird, "
    "dann per HTTP Request Beispieldaten von https://jsonplaceholder.typicode.com/todos/1 abruft "
    "und das Ergebnis anschliessend in einem Set-Node fuer einen schnellen Test aufbereitet. "
    "Nutze nur leicht testbare Standardknoten, beruecksichtige die bestehende n8n-Datenbank unter /data/.n8n/database.sqlite "
    "und gib idealerweise direkt das importierbare n8n-Workflow-JSON mit id zurueck."
)


def load_env_file(filepath=".env"):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f".env-Datei nicht gefunden: {filepath}")
    with open(filepath, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip().strip('"').strip("'")


def chat(base_url, token, message):
    chat_url = base_url.rstrip("/") + "/v1/chat/completions"
    model = os.getenv("OPENCLAW_MODEL", "openai/gpt-5.2")
    data = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": BUDDY_SYSTEM_PROMPT},
                {"role": "system", "content": N8N_DB_CONTEXT_PROMPT},
                {"role": "user", "content": message},
            ],
            "stream": False,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        url=chat_url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )

    with urllib.request.urlopen(req) as response:
        body = response.read().decode("utf-8", errors="replace")
        return response.status, body


def extract_assistant_text(body):
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        return None

    choices = payload.get("choices")
    if not isinstance(choices, list) or not choices:
        return None

    first_choice = choices[0]
    if not isinstance(first_choice, dict):
        return None

    message = first_choice.get("message")
    if not isinstance(message, dict):
        return None

    content = message.get("content")
    return content if isinstance(content, str) else None


def main():
    load_env_file(".env")

    token = os.getenv("OPENCLAW_TOKEN") or os.getenv("TOKEN") or os.getenv("API_TOKEN") or os.getenv("BEARER_TOKEN")
    if not token:
        raise ValueError("Kein Token gefunden. Bitte OPENCLAW_TOKEN/TOKEN/API_TOKEN/BEARER_TOKEN in .env setzen.")

    base_url = os.getenv("OPENCLAW_BASE_URL", "http://72.61.136.246:8080")
    message = os.getenv("OPENCLAW_TEST_MESSAGE", DEFAULT_USER_MESSAGE)

    try:
        status, body = chat(base_url, token, message)
        print("CHAT Status:", status)
        print("USER Nachricht:", message)
        assistant_text = extract_assistant_text(body)
        if assistant_text is not None:
            print("ASSISTANT Antwort:", assistant_text)
        else:
            print("RAW Antwort:", body)
    except urllib.error.HTTPError as err:
        error_body = err.read().decode("utf-8", errors="replace")
        print("HTTP-Fehler:", err.code)
        print("Antwort:", error_body)
    except urllib.error.URLError as err:
        print("Verbindungsfehler:", err.reason)


if __name__ == "__main__":
    main()
