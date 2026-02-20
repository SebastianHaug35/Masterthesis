from typing import Dict, List
from .llm_providers import LLMProvider

class SimpleAgent:
    """
    Placeholder for later:
    - ask clarifying questions
    - call tools (validator, patcher, n8n deploy/test)
    """
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    def decide(self, chat: List[Dict[str, str]]) -> str:
        # For now: just echo last user message via LLM provider
        return self.llm.generate(chat).text
