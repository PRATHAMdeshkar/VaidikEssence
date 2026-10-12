from __future__ import annotations

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"


def generate_answer(context: str, question: str) -> str:
    prompt = (
    "You are an assistant that answers questions using ONLY the provided context.\n"
    "Carefully read the context and extract the correct answer.\n"
    "If the answer is partially present, still construct a complete answer from it.\n"
    "Do NOT use outside knowledge.\n"
    "Do NOT say 'I don't know' if any relevant information exists in the context.\n"
    "If the context does not contain any relevant information, then say 'I don't know'.\n\n"
    "Context:\n"
    f"{context}\n\n"
    "Question:\n"
    f"{question}\n\n"
    "Answer clearly and concisely:\n"
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
