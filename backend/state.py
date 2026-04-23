import streamlit as st


def init_state() -> None:
    if "chat" not in st.session_state:
        st.session_state.chat = [
            {
                "role": "assistant",
                "content": "Hi! Gib mir eine n8n-Anforderung.",
            }
        ]
    if "context_docs" not in st.session_state:
        st.session_state.context_docs = []


def reset_state() -> None:
    st.session_state.chat = [
        {
            "role": "assistant",
            "content": "Chat zurueckgesetzt. Gib mir eine neue n8n-Anforderung.",
        }
    ]
    st.session_state.context_docs = []
    st.session_state.pop("buddy", None)
