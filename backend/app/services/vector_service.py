from typing import List, Dict
from uuid import uuid4

from loguru import logger
from qdrant_client.http import models

from app.database import get_qdrant_client
from app.config import settings
from app.services.embedding_service import embed_query


def store_vectors(
    chunks: List[str],
    embeddings: List[List[float]],
    metadata: List[Dict]
) -> int:
    """
    Store document chunks inside Qdrant.
    """

    if not chunks:
        raise ValueError("No chunks provided.")

    if not embeddings:
        raise ValueError("No embeddings provided.")

    if len(chunks) != len(embeddings):
        raise ValueError(
            "Chunks and embeddings count mismatch."
        )

    if len(chunks) != len(metadata):
        raise ValueError(
            "Chunks and metadata count mismatch."
        )

    client = get_qdrant_client()

    points = []

    for chunk, vector, info in zip(
        chunks,
        embeddings,
        metadata
    ):

        point = models.PointStruct(

            id=str(uuid4()),

            vector=vector,

            payload={

                "text": chunk,

                "page": info.get("page"),

                "filename": info.get("filename"),

                "file_id": info.get("file_id"),

                "uploaded_at": info.get("uploaded_at")

            }

        )

        points.append(point)

    try:

        client.upsert(

            collection_name=settings.QDRANT_COLLECTION,

            points=points,

            wait=True

        )

        logger.success(

            f"Stored {len(points)} vectors."

        )

        return len(points)

    except Exception as error:

        logger.exception(

            f"Vector storage failed: {error}"

        )

        raise RuntimeError(

            "Failed to store vectors."

        ) from error


def search_similar_chunks(
    question: str,
    limit: int = 5
) -> List[Dict]:
    """
    Retrieve relevant document chunks.
    """

    if not question.strip():

        raise ValueError(
            "Question cannot be empty."
        )

    client = get_qdrant_client()

    query_vector = embed_query(question)

    try:

        results = client.query_points(

            collection_name=settings.QDRANT_COLLECTION,

            query=query_vector,

            limit=limit,

            with_payload=True

        )

        chunks = []

        for point in results.points:

            payload = point.payload or {}

            text = payload.get("text")

            if not text:
                continue

            chunks.append(

                {

                    "text": text,

                    "page": payload.get("page"),

                    "filename": payload.get("filename"),

                    "file_id": payload.get("file_id"),

                    "uploaded_at": payload.get("uploaded_at")

                }

            )

        logger.info(

            f"Retrieved {len(chunks)} chunks."

        )

        return chunks

    except Exception as error:

        logger.exception(

            f"Vector search failed: {error}"

        )

        raise RuntimeError(

            "Failed to search vectors."

        ) from error


def delete_vectors_by_file(
    file_id: str
):
    """
    Delete all vectors belonging to one PDF.
    """

    client = get_qdrant_client()

    try:

        client.delete(

            collection_name=settings.QDRANT_COLLECTION,

            points_selector=models.Filter(

                must=[

                    models.FieldCondition(

                        key="file_id",

                        match=models.MatchValue(

                            value=file_id

                        )

                    )

                ]

            )

        )

        logger.success(

            f"Deleted vectors of file {file_id}"

        )

    except Exception as error:

        logger.exception(

            f"Delete failed: {error}"

        )

        raise RuntimeError(

            "Unable to delete vectors."

        )