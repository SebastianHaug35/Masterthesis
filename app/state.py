import streamlit as st


def init_state() -> None:
    if "chat" not in st.session_state:
        st.session_state.chat = [
            {
                "role": "assistant",
                "content": "Hi! Ich bin Buddy-Proxy. Gib mir eine n8n-Anforderung.",
            }
        ]


def reset_state() -> None:
    st.session_state.chat = [
        {
            "role": "assistant",
            "content": "Chat zurueckgesetzt. Gib mir eine neue n8n-Anforderung.",
        }
    ]
    st.session_state.pop("buddy", None)
