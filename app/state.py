# app/state.py
import streamlit as st

def init_state() -> None:
    if "chat" not in st.session_state:
        st.session_state.chat = [
            {
                "role": "assistant",
                "content": "Describe the workflow you want to generate.",
            }
        ]
    st.session_state.setdefault("last_workflow", None)
    st.session_state.setdefault("last_validation", None)
