import streamlit as st

from .buddy_proxy import BuddyProxy
from .state import init_state, reset_state


def _get_buddy() -> BuddyProxy:
    if "buddy" not in st.session_state:
        st.session_state.buddy = BuddyProxy()
    return st.session_state.buddy


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

    result = buddy.run(latest_user_prompt, on_progress=on_progress)
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

    st.title("Buddy Proxy Chat")

    for message in st.session_state.chat:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    prompt = st.chat_input("Schreibe eine Nachricht...")
    if prompt:
        st.session_state.chat.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        reply = _assistant_reply()
        st.session_state.chat.append({"role": "assistant", "content": reply})
        st.rerun()
