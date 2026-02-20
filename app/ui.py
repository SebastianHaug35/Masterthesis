# app/ui.py
import json
import streamlit as st

from .state import init_state
from .generator import generate_workflow_from_chat
from .validator import validate_workflow_json

def run_app() -> None:
    st.set_page_config(page_title="Chat → n8n Workflow (LLM)", layout="wide")
    init_state()

    with st.sidebar:
        strict = st.checkbox("Strict validation", value=False)

    st.title("Chat → n8n Workflow Generator (LLM)")

    for m in st.session_state.chat:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])

    prompt = st.chat_input("Describe the automation you want…")
    if prompt:
        st.session_state.chat.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        result = generate_workflow_from_chat(st.session_state.chat)
        st.session_state.last_workflow = result.workflow

        ok, errors, warnings = validate_workflow_json(result.workflow, strict=strict)
        st.session_state.last_validation = (ok, errors, warnings)

        with st.chat_message("assistant"):
            st.markdown("Workflow generated. See validation and JSON preview.")

    col1, col2 = st.columns([1, 1], gap="large")

    with col1:
        st.subheader("Validation")
        if st.session_state.last_validation:
            ok, errors, warnings = st.session_state.last_validation
            st.success("OK") if ok else st.error("Invalid workflow")
            for e in errors:
                st.write(f"- {e}")
            for w in warnings:
                st.write(f"- {w}")

    with col2:
        st.subheader("Workflow JSON")
        if st.session_state.last_workflow:
            st.code(
                json.dumps(st.session_state.last_workflow, indent=2, ensure_ascii=False),
                language="json",
            )
