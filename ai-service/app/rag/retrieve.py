from __future__ import annotations

import os
import pickle
from typing import Any

import faiss
from sentence_transformers import SentenceTransformer

VECTOR_DIR = "vector_store"
INDEX_PATH = os.path.join(VECTOR_DIR, "index.faiss")
TEXTS_PATH = os.path.join(VECTOR_DIR, "texts.pkl")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

_model = SentenceTransformer(EMBEDDING_MODEL)
_index = None
_texts: list[Any] | None = None


def _load_vector_store() -> tuple[faiss.Index, list[Any]]:
    global _index, _texts

    if _index is None:
        if not os.path.exists(INDEX_PATH):
            raise FileNotFoundError(f"FAISS index not found at {INDEX_PATH}. Run ingest first.")
        _index = faiss.read_index(INDEX_PATH)

    if _texts is None:
        if not os.path.exists(TEXTS_PATH):
            raise FileNotFoundError(f"Chunk text store not found at {TEXTS_PATH}. Run ingest first.")
        with open(TEXTS_PATH, "rb") as f:
            _texts = pickle.load(f)

    return _index, _texts


def retrieve(query: str, k: int = 3) -> list[dict[str, Any]]:
    index, texts = _load_vector_store()
    if not texts:
        return []

    safe_k = max(1, min(k, len(texts)))
    query_vector = _model.encode([query], convert_to_numpy=True)
    _, indices = index.search(query_vector, safe_k)

    results: list[dict[str, Any]] = []
    for i in indices[0]:
        if not (0 <= i < len(texts)):
            continue
        item = texts[i]

        # Backward compatibility: older stores may contain raw strings.
        if isinstance(item, str):
            results.append(
                {
                    "chapter_number": None,
                    "chapter_title": "",
                    "topic": "",
                    "text": item,
                }
            )
            continue

        if isinstance(item, dict):
            text = item.get("text", "")
            if isinstance(text, str) and text.strip():
                results.append(item)

    return results
