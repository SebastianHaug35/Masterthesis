# app/llm_providers.py
import os
from typing import Dict, List
from openai import OpenAI
from dotenv import load_dotenv

# load .env once, globally
load_dotenv()

class OpenAILLM:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set (check .env)")
        self.client = OpenAI(api_key=api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def generate(self, system_prompt: str, messages: List[Dict[str, str]]) -> str:
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=0,
            messages=[{"role": "system", "content": system_prompt}] + messages,
        )
        return resp.choices[0].message.content
