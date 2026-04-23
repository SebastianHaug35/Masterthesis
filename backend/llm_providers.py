import os
from pathlib import Path
from typing import Dict, List

from dotenv import load_dotenv
from openai import OpenAI

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class OpenAILLM:
    def __init__(self):
        load_dotenv(dotenv_path=PROJECT_ROOT / ".env", override=True)

        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is empty or not set")

        if not api_key.startswith("sk-"):
            raise RuntimeError(f"OPENAI_API_KEY has invalid format: {repr(api_key)}")

        self.client = OpenAI(api_key=api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()

        try:
            self.client.models.list()
        except Exception as exc:
            raise RuntimeError(f"API key invalid or not working: {exc}")

    def generate(self, system_prompt: str, messages: List[Dict[str, str]]) -> str:
        response = self.client.responses.create(
            model=self.model,
            input=[
                {"role": "system", "content": system_prompt},
                *messages,
            ],
        )

        return response.output_text
