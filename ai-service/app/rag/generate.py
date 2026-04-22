from __future__ import annotations

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3"


def generate_answer(context: str, question: str) -> str:
    prompt = (
        "Answer based only on the provided context.\n"
        "If the answer is not in the context, say you don't know.\n\n"
        "Context:\n"
        f"{context}\n\n"
        "Question:\n"
        f"{question}\n"
    )

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        return "I don't know."
    except ValueError:
        return "I don't know."

    return data.get("response", "").strip()
