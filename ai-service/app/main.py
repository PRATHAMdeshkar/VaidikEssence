from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.rag.generate import generate_answer
from app.rag.retrieve import retrieve

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="RAG Service")


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, description="User question")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/ask")
def ask(req: AskRequest) -> dict[str, object]:
    question = req.question.strip()
    logger.info("Received question: %s", question)

    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        sources = retrieve(question, k=3)
    except FileNotFoundError as exc:
        logger.exception("Vector store files missing")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Failed during retrieval")
        raise HTTPException(status_code=500, detail="Retrieval failed") from exc

    context_parts = [src.get("text", "").strip() for src in sources if isinstance(src, dict)]
    context_parts = [part for part in context_parts if part]
    if not context_parts:
        logger.warning("No usable context chunks found for question")
        return {"answer": "I don't know.", "sources": []}

    context = "\n\n".join(context_parts)
    print(f"Context for question '{question}':\n{context}\n--- End of context ---")
    answer = generate_answer(context=context, question=question)

    logger.info("Generated answer successfully")
    return {
        "answer": answer,
        "sources": sources,
    }
