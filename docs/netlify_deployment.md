# Netlify Deployment fuer Masterthesis Buddy

Dieses Setup hostet das SvelteKit-Frontend aus `frontend/` auf Netlify. Die Chat- und API-Routen laufen dabei als Netlify Functions.

Wichtig: Netlify kann keine lokale Buddy-API unter `http://127.0.0.1:8000/v1` erreichen. Fuer ein echtes Online-Deployment muss `OPENAI_BASE_URL` auf eine oeffentlich erreichbare OpenAI-kompatible API zeigen, zum Beispiel auf einen separat gehosteten `backend/api_app.py`-Dienst.

## Repository-Einstellungen in Netlify

Wenn du das Repository in Netlify importierst, erkennt Netlify die Konfiguration aus `netlify.toml`:

- Base directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `build`
- Node version: `22`

Der SvelteKit-Adapter wird automatisch ueber `ADAPTER=netlify` aktiviert.

## Environment-Variablen

Setze die geheimen Werte in Netlify unter:

`Site configuration` -> `Environment variables`

Minimal erforderlich:

```text
OPENAI_BASE_URL=https://deine-buddy-api.example.com/v1
OPENAI_API_KEY=...
PUBLIC_APP_NAME=Masterthesis Buddy
PUBLIC_APP_DESCRIPTION=Chat UI fuer n8n Workflow-Generierung und Validierung.
PUBLIC_ORIGIN=https://deine-netlify-site.netlify.app
```

Empfohlen fuer produktive Deployments:

```text
MONGODB_URL=mongodb+srv://...
MONGODB_DB_NAME=masterthesis-buddy
```

Ohne `MONGODB_URL` versucht die App auf eine lokale Datenbank-Fallback-Logik auszuweichen. Das ist fuer Netlify Functions nicht geeignet, weil Functions kurzlebig sind und kein dauerhaftes lokales Dateisystem bieten.

Optionale Router-Variablen, falls der Omni-/Arch-Router genutzt wird:

```text
LLM_ROUTER_ARCH_BASE_URL=...
LLM_ROUTER_ARCH_MODEL=...
LLM_ROUTER_FALLBACK_MODEL=...
PUBLIC_LLM_ROUTER_ALIAS_ID=omni
PUBLIC_LLM_ROUTER_DISPLAY_NAME=Omni
```

## Deployment-Ablauf

1. Backend oeffentlich hosten, falls der Buddy-Proxy genutzt werden soll.
2. Netlify-Site mit diesem Repository verbinden.
3. Environment-Variablen in Netlify setzen.
4. Deploy starten.
5. Nach dem ersten Deploy `PUBLIC_ORIGIN` auf die echte Netlify-URL setzen und erneut deployen.

## Lokaler Test des Netlify-Builds

```powershell
cd frontend
$env:ADAPTER = "netlify"
npm run build
```

Wenn der Build lokal funktioniert, aber Netlify zur Laufzeit keine Modelle findet, pruefe zuerst `OPENAI_BASE_URL`, `OPENAI_API_KEY` und ob `${OPENAI_BASE_URL}/models` von Netlify aus erreichbar ist.
