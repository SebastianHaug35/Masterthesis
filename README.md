# Masterthesis: LLM-Based Workflow Validation and n8n Prototyping

Dieses Repository kombiniert zwei Arbeitsspuren der Masterarbeit:

1. die wissenschaftliche Untersuchung zur Validierung automatisch erzeugter Workflows
2. einen lauffaehigen Prototypen zur Erzeugung und Verarbeitung von n8n-Workflows

Der Schwerpunkt liegt auf n8n-Workflows und deren Validierung. Besonders relevant sind dabei strukturielle, fachliche und LLM-bezogene Validierungsfehler.

## Aktueller Fokus

- Vergleich von `static`, `rule-based`, `LLM-as-a-Judge` und `hybrid` Validierungsansaetzen
- Aufbau eines Buddy-Proxys, der natuerlichsprachige Anforderungen annimmt und n8n-Workflow-JSON zurueckliefert
- Nutzung von `frontend/` als Chat UI fuer den Buddy-Proxy

## Projektstruktur

- `backend/`: Python-Backend mit Buddy-Proxy und OpenAI-kompatibler API
- `frontend/`: Frontend auf Basis von Hugging Face Chat UI
- `thesis/`: Thesis-Material, Evaluationsentwuerfe, Beispiele und Datensaetze
- `docs/architecture/`: PlantUML-Quellen und gerenderte Architekturabbildungen
- `scripts/`: Entwicklungs- und Research-Skripte
- `prompts/`: System- und Beispielprompts
- `artifacts/`: Laufzeit- und Log-Artefakte
- `experiments/`: manuelle und explorative Tests

## Relevante Dokumente

- [n8n Mini-Setup](thesis/n8n/README.md)
- [Evaluationskapitel n8n](thesis/n8n/evaluation_chapter_draft.md)
- [LLM-Task-Validierungsstrategie](thesis/n8n/llm_task_validation_strategy.md)
- [Process IO Contract](thesis/n8n/process_io_contract.md)

## Prototypenstatus

Der aktuelle Prototyp besteht aus:

- einer Flask-API in [api_app.py](/c:/Users/Nutzer/master/masterthesis/backend/api_app.py)
- einem Buddy-Proxy in [buddy_proxy.py](/c:/Users/Nutzer/master/masterthesis/backend/buddy_proxy.py)
- einem Chat UI Frontend in `frontend/`, das ueber `OPENAI_BASE_URL=http://127.0.0.1:8000/v1` an die Buddy-API angebunden wird

Das bedeutet: Die produktive lokale Oberflaeche ist Chat UI. Streamlit bleibt nur noch als Legacy-Fallback erhalten und ist nicht Teil der normalen Backend-Abhaengigkeiten.

## Lokales n8n

n8n kann lokal ohne Docker gestartet werden. Die globale Installation liegt unter `C:\nvm4w\nodejs\node_modules\n8n`; wegen eines fehlenden npm-Shims wird n8n ueber Node gestartet.

Start:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\n8n-start.ps1
```

Danach ist n8n unter <http://127.0.0.1:5678> erreichbar.

Stop:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\n8n-stop.ps1
```

Hinweis: `N8N_RUNNERS_MODE=external` ist im Startskript gesetzt, weil der interne n8n Task Runner auf diesem Rechner mit `spawn EPERM` beendet.

## PlantUML Rendering

Die Architekturdiagramme liegen unter `docs/architecture/*.puml`.

Voraussetzungen:

- Java (JRE/JDK 17 oder neuer) muss im `PATH` verfuegbar sein
- `plantuml-1.2025.10.jar` muss im Repository-Root liegen (`./plantuml-1.2025.10.jar`)

Rendern aller Diagramme nach `docs/architecture/rendered`:

```bash
./scripts/render-plantuml.sh
```

Ein einzelnes Diagramm rendern:

```bash
./scripts/render-plantuml.sh docs/architecture/testaufbau_hypothesen_flow.puml
```

## Simulated Business System fuer Hypothese A

Das lokale simulierte Business-System ersetzt ERP, E-Mail, DMS, Datenbank und Queue durch reproduzierbare HTTP-Endpunkte auf `http://127.0.0.1:8088`.

Start:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-start.ps1
```

Smoke-Test:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-smoke-test.ps1
```

Stop:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\mock-business-stop.ps1
```

Die vollstaendige Dokumentation liegt in [Hypothesis A Simulated Business System](docs/hypothesis_a_simulated_business_system.md).

## Hypothese A Test-Runner

Der reproduzierbare Test-Runner fuehrt Prozess-Testfaelle gegen die simulierten Business-Systeme aus und schreibt JSON-Reports nach `artifacts/hypothesis_a/runs`.

Referenzlauf fuer den ersten Prozess:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-test-runner.ps1
```

Der aktuelle Baseline-Lauf fuer `account_payable_process_0` ergibt:

```text
1 passed, 0 failed, 0 error
```

Die vollstaendige Dokumentation liegt in [Hypothesis A Test Runner](docs/hypothesis_a_test_runner.md).

## Hypothese A Workflow-Generierung

Workflow-Kandidaten koennen automatisch aus Prozessbeschreibung, Testfaellen und Systemlandschaft erzeugt werden. Ohne API-Key kann der Prompt bereits reproduzierbar gebaut werden:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-generate-workflow.ps1 --dry-run
```

Sobald `OPENAI_API_KEY` in `frontend/.env` gesetzt ist:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-generate-workflow.ps1
```

Import in die lokale n8n-Umgebung:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hypothesis-a-import-workflow.ps1
```

Die vollstaendige Dokumentation liegt in [Hypothesis A Workflow Generation](docs/hypothesis_a_workflow_generation.md).

## Naechste Arbeitspakete

```mermaid
gantt
    title Masterthesis Roadmap ab 18. April 2026
    dateFormat  YYYY-MM-DD
    axisFormat  %d.%m.

    section Thesis Konzept
    Forschungsfrage und Scope schaerfen            :done, thesis_scope, 2026-03-20, 2026-04-10
    Evaluationsdesign fuer n8n konsolidieren      :active, eval_design, 2026-04-18, 2026-04-30
    Fehlerklassen und Ground Truth definieren      :ground_truth, 2026-04-24, 2026-05-08

    section Datensatz und Validatoren
    Referenz-Workflows und Fehlerfaelle aufbauen   :dataset, 2026-04-29, 2026-05-20
    Static und Rule-Based Validatoren erweitern    :validators_static, 2026-05-06, 2026-05-24
    LLM-as-a-Judge und Hybrid evaluieren           :validators_llm, 2026-05-18, 2026-06-05

    section Prototyp Architektur
    Buddy-Proxy stabilisieren und Logs schaerfen   :proxy, 2026-04-18, 2026-05-03
    API fuer Frontend-Anbindung bereinigen         :api, 2026-04-24, 2026-05-06

    section Frontend Migration
    Ist-Zustand dokumentieren: Legacy-Streamlit in backend/legacy_streamlit_app.py :done, streamlit_state, 2026-04-18, 2026-04-22
    Chat-UI lokal an Buddy API anbinden            :done, chatui_bind, 2026-04-22, 2026-05-03
    Chat-UI Features gegen Buddy API pruefen       :chatui_features, 2026-05-01, 2026-05-15
    Streamlit nur noch als Fallback oder entfernen :streamlit_cleanup, 2026-05-17, 2026-05-24

    section Schreiben und Auswertung
    Ergebnispipeline und Metriken implementieren   :results, 2026-05-20, 2026-06-10
    Ergebniskapitel schreiben                      :writing_results, 2026-06-01, 2026-06-18
    Architektur, Methode und Diskussion ueberarbeiten :writing_final, 2026-06-12, 2026-06-30
```

## Kurzfristige To-dos

- Root-README als zentrales Einstiegdokument pflegen
- Chat-UI-Checkout vervollstaendigen, falls `frontend/src` lokal fehlt
- Chat UI gegen die Buddy-API testen und Kernfluesse dokumentieren
- Evaluationsartefakte aus den Mini-Setups in eine reproduzierbare Pipeline ueberfuehren
- offene Encoding-Probleme in Prompt- und Python-Dateien bereinigen
- klare Trennung zwischen Prototyp-Code und Thesis-Artefakten herstellen

## Startpunkte

Backend starten:

```powershell
python backend/api_app.py
```

Chat UI Konfiguration:

```powershell
OPENAI_BASE_URL=http://127.0.0.1:8000/v1
OPENAI_API_KEY=buddy-local
```

Netlify-Deployment:

```text
Konfiguration: netlify.toml
Dokumentation: docs/netlify_deployment.md
```

Wichtig: Fuer Netlify muss `OPENAI_BASE_URL` auf eine oeffentlich erreichbare Buddy-API zeigen. Die lokale Adresse `http://127.0.0.1:8000/v1` funktioniert nur auf dem Entwicklungsrechner.

Backend plus Chat UI in separaten Fenstern starten:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev\start_chat_stack.ps1
```

Das Startskript legt `frontend/.env.local` bei Bedarf mit der lokalen Buddy-API an. Falls `frontend/src` fehlt, startet es nur das Backend und weist darauf hin, dass die vollstaendigen Hugging Face Chat UI Quellen in `frontend/` bereitgestellt werden muessen.

Legacy-Streamlit kann bei Bedarf separat installiert werden:

```powershell
pip install -r backend/requirements-legacy-streamlit.txt
streamlit run backend/legacy_streamlit_app.py
```
