import streamlit as st
from pathlib import Path

from buddy_proxy import BuddyProxy
from state import init_state, reset_state

MAX_CONTEXT_CHARS_PER_FILE = 12000
MAX_CONTEXT_DOCS = 8


def _get_buddy() -> BuddyProxy:
    if "buddy" not in st.session_state:
        st.session_state.buddy = BuddyProxy()
    return st.session_state.buddy


def _read_uploaded_text(uploaded_file) -> str:
    raw = uploaded_file.getvalue()
    return raw.decode("utf-8", errors="replace")


def _merge_context_docs_from_uploads(uploaded_files) -> None:
    if not uploaded_files:
        return
    by_name = {doc["name"]: doc for doc in st.session_state.context_docs}
    for file in uploaded_files[:MAX_CONTEXT_DOCS]:
        text = _read_uploaded_text(file)
        if len(text) > MAX_CONTEXT_CHARS_PER_FILE:
            text = text[:MAX_CONTEXT_CHARS_PER_FILE] + "\n...[truncated]"
        by_name[file.name] = {"name": file.name, "content": text}
    st.session_state.context_docs = list(by_name.values())[:MAX_CONTEXT_DOCS]


def _add_context_doc(name: str, content: str) -> None:
    by_name = {doc["name"]: doc for doc in st.session_state.context_docs}
    if len(content) > MAX_CONTEXT_CHARS_PER_FILE:
        content = content[:MAX_CONTEXT_CHARS_PER_FILE] + "\n...[truncated]"
    by_name[name] = {"name": name, "content": content}
    st.session_state.context_docs = list(by_name.values())[:MAX_CONTEXT_DOCS]


def _handle_context_chat_command(prompt: str) -> str:
    stripped = prompt.strip()
    if not (stripped.startswith("/datei ") or stripped.startswith("/file ")):
        return ""

    path_str = stripped.split(" ", 1)[1].strip().strip('"').strip("'")
    if not path_str:
        return "Bitte Pfad angeben, z. B. `/datei backend/requirements.txt`."
    path = Path(path_str)
    if not path.exists() or not path.is_file():
        return f"Datei nicht gefunden: `{path_str}`"
    content = path.read_text(encoding="utf-8", errors="replace")
    _add_context_doc(path.name, content)
    return f"Kontextdatei hinzugefuegt: `{path}` ({len(content)} chars)."


def _assistant_reply() -> str:
    buddy = _get_buddy()
    latest_user_prompt = ""
    for msg in reversed(st.session_state.chat):
        if msg["role"] == "user":
            latest_user_prompt = msg["content"]
            break
    if not latest_user_prompt:
        return "Keine User-Anforderung gefunden."

    status = st.status("Buddy arbeitet...", expanded=True)

    def on_progress(message: str) -> None:
        status.write(message)

    result = buddy.run(
        latest_user_prompt,
        context_docs=st.session_state.context_docs,
        on_progress=on_progress,
    )
    if result.success:
        status.update(label="Buddy abgeschlossen", state="complete", expanded=False)
    else:
        status.update(label="Buddy abgeschlossen (mit Fehler)", state="error", expanded=True)

    return result.message


def run_app() -> None:
    st.set_page_config(page_title="Chat", layout="wide")
    init_state()

    with st.sidebar:
        st.header("Session")
        if st.button("Chat reset", use_container_width=True):
            reset_state()
            st.rerun()
        st.divider()
        st.subheader("Kontextdateien")
        uploads = st.file_uploader(
            "Dateien als Kontext anhaengen",
            accept_multiple_files=True,
            key="context_uploads",
        )
        if st.button("Kontext aktualisieren", use_container_width=True):
            _merge_context_docs_from_uploads(uploads)
            st.rerun()
        if st.button("Kontext leeren", use_container_width=True):
            st.session_state.context_docs = []
            st.rerun()
        if st.session_state.context_docs:
            st.caption("Aktiver Kontext:")
            for doc in st.session_state.context_docs:
                st.write(f"- {doc['name']} ({len(doc['content'])} chars)")

    st.title("LLM Chat")

    for message in st.session_state.chat:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    prompt = st.chat_input("Schreibe eine Nachricht...")
    if prompt:
        st.session_state.chat.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        command_reply = _handle_context_chat_command(prompt)
        reply = command_reply or _assistant_reply()
        st.session_state.chat.append({"role": "assistant", "content": reply})
        st.rerun()
