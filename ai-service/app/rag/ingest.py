from __future__ import annotations

import logging
import os
import pickle
import re

import faiss
from sentence_transformers import SentenceTransformer

try:
    from langchain_community.document_loaders import PyPDFLoader
except ImportError:  # pragma: no cover
    from langchain.document_loaders import PyPDFLoader

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:  # pragma: no cover
    from langchain.text_splitter import RecursiveCharacterTextSplitter

PDF_PATH = "data/bhagavad_gita.pdf"
VECTOR_DIR = "vector_store"
INDEX_PATH = os.path.join(VECTOR_DIR, "index.faiss")
TEXTS_PATH = os.path.join(VECTOR_DIR, "texts.pkl")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger(__name__)


def clean_pdf_text(raw_text: str) -> str:
    text = raw_text.replace("\r", "\n")

    # Fix hyphenated words broken across line breaks (e.g., "trans-\nitory").
    text = re.sub(r"(\w)-\s*\n\s*(\w)", r"\1\2", text)
    # Remove page-number-only lines such as "12" or "Page 12".
    text = re.sub(r"(?im)^\s*(?:page\s+)?\d+\s*$", "", text)
    # Normalize spaces while preserving line boundaries for structural parsing.
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[ \t]*\n[ \t]*", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def normalize_title(raw_title: str | None, chapter_number: int) -> str:
    if not raw_title:
        return f"Chapter {chapter_number}"
    cleaned = raw_title.strip()
    cleaned = re.sub(r"^\d+\s*[:.\-]\s*", "", cleaned)
    return cleaned if cleaned else f"Chapter {chapter_number}"


def is_topic_line(line: str) -> bool:
    candidate = line.strip()
    if not candidate:
        return False
    if len(candidate) > 120:
        return False
    if candidate.upper() == candidate:
        return False
    if candidate.lower().startswith("chapter "):
        return False
    if candidate.endswith("."):
        return False

    words = re.findall(r"[A-Za-z][A-Za-z'-]*", candidate)
    if len(words) < 2 or len(words) > 14:
        return False

    stop_words = {"of", "and", "the", "to", "in", "for", "on", "with", "a", "an"}
    title_like = sum(1 for w in words if w[0].isupper() or w.lower() in stop_words)
    if (title_like / len(words)) < 0.6:
        return False

    punctuation_count = len(re.findall(r"[,:;!?]", candidate))
    if punctuation_count > 2:
        return False

    return True


def build_structure_chunks(clean_text: str) -> tuple[list[dict], int, int]:
    chapter_pattern = re.compile(
        r"(?im)^\s*CHAPTER\s+(\d{1,2})(?:\s*[:.\-]\s*(.*))?\s*$",
        flags=re.MULTILINE,
    )
    chapter_matches = list(chapter_pattern.finditer(clean_text))

    chunks: list[dict] = []
    total_topics = 0

    intro_text = clean_text
    if chapter_matches:
        intro_text = clean_text[: chapter_matches[0].start()].strip()

    if intro_text:
        intro_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
        for intro_chunk in intro_splitter.split_text(intro_text):
            chunk_text = intro_chunk.strip()
            if not chunk_text:
                continue
            chunks.append(
                {
                    "chapter_number": 0,
                    "chapter_title": "Introduction",
                    "topic": "Introduction",
                    "text": chunk_text,
                }
            )

    for i, match in enumerate(chapter_matches):
        chapter_number = int(match.group(1))
        chapter_title = normalize_title(match.group(2), chapter_number)

        start = match.end()
        end = chapter_matches[i + 1].start() if i + 1 < len(chapter_matches) else len(clean_text)
        chapter_body = clean_text[start:end].strip()
        if not chapter_body:
            continue

        lines = [line.strip() for line in chapter_body.splitlines() if line.strip()]
        if not lines:
            continue

        topic_positions = [idx for idx, line in enumerate(lines) if is_topic_line(line)]
        topic_positions = sorted(set(topic_positions))

        if not topic_positions:
            chunks.append(
                {
                    "chapter_number": chapter_number,
                    "chapter_title": chapter_title,
                    "topic": chapter_title,
                    "text": re.sub(r"\s+", " ", chapter_body).strip(),
                }
            )
            total_topics += 1
            continue

        for idx, topic_start in enumerate(topic_positions):
            topic = lines[topic_start]
            content_start = topic_start + 1
            content_end = (
                topic_positions[idx + 1] if idx + 1 < len(topic_positions) else len(lines)
            )
            content_lines = lines[content_start:content_end]
            chunk_text = re.sub(r"\s+", " ", " ".join(content_lines)).strip()
            if not chunk_text:
                continue

            chunks.append(
                {
                    "chapter_number": chapter_number,
                    "chapter_title": chapter_title,
                    "topic": topic,
                    "text": chunk_text,
                }
            )
            total_topics += 1

    return chunks, len(chapter_matches), total_topics


def ingest() -> None:
    logger.info("Starting ingestion pipeline")
    logger.info("Loading PDF from %s", PDF_PATH)

    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()
    logger.info("Loaded %d pages", len(documents))

    combined_text = "\n".join(doc.page_content for doc in documents if doc.page_content.strip())
    clean_text = clean_pdf_text(combined_text)
    chunks, total_chapters, total_topics = build_structure_chunks(clean_text)

    texts = [chunk["text"] for chunk in chunks if chunk["text"].strip()]
    if not texts:
        raise ValueError("No valid chunks were created from the PDF content.")

    logger.info("Total chapters found: %d", total_chapters)
    logger.info("Total topics found: %d", total_topics)
    logger.info("Total chunks created: %d", len(chunks))
    print(f"total chapters found: {total_chapters}")
    print(f"total topics found: {total_topics}")
    print(f"total chunks created: {len(chunks)}")

    logger.info("Loading embedding model: %s", EMBEDDING_MODEL)

    model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = model.encode(texts, convert_to_numpy=True)

    logger.info("Building FAISS index")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    os.makedirs(VECTOR_DIR, exist_ok=True)

    faiss.write_index(index, INDEX_PATH)
    with open(TEXTS_PATH, "wb") as f:
        pickle.dump(chunks, f)

    logger.info("Saved FAISS index to %s", INDEX_PATH)
    logger.info("Saved chunk metadata to %s", TEXTS_PATH)
    logger.info("Ingestion complete")


if __name__ == "__main__":
    ingest()
