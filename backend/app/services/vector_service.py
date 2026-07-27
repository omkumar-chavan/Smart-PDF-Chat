from typing import List
from uuid import uuid4

from qdrant_client.http import models
from loguru import logger

from app.database import get_qdrant_client
from app.config import settings
from app.services.embedding_service import (
    create_embeddings,
    embed_query
)



def store_vectors(
    chunks: List[str],
    embeddings_list: List[List[float]]
) -> int:
    """
    Store document chunks and embeddings inside Qdrant.
    """


    if not chunks:

        raise ValueError(
            "No chunks provided."
        )


    if not embeddings_list:

        raise ValueError(
            "No embeddings provided."
        )


    if len(chunks) != len(embeddings_list):

        raise ValueError(
            "Chunks and embeddings count mismatch."
        )


    client = get_qdrant_client()


    points = []


    for chunk, vector in zip(
        chunks,
        embeddings_list
    ):

        points.append(

            models.PointStruct(

                id=str(uuid4()),

                vector=vector,

                payload={
                    "text": chunk
                }

            )

        )


    try:

        client.upsert(

            collection_name=settings.QDRANT_COLLECTION,

            points=points

        )


        logger.success(
            f"Stored {len(points)} vectors in Qdrant"
        )


        return len(points)



    except Exception as error:

        logger.exception(
            f"Vector storage failed: {error}"
        )


        raise RuntimeError(
            "Failed to store vectors"
        ) from error





def search_similar_chunks(
    question: str,
    limit: int = 4
) -> List[str]:
    """
    Search relevant document chunks from Qdrant.
    """


    if not question.strip():

        raise ValueError(
            "Question cannot be empty."
        )


    client = get_qdrant_client()


    query_vector = embed_query(
        question
    )


    try:

        results = client.query_points(

            collection_name=settings.QDRANT_COLLECTION,

            query=query_vector,

            limit=limit,

            with_payload=True

        )


        chunks = []


        for point in results.points:

            if point.payload and "text" in point.payload:

                chunks.append(
                    point.payload["text"]
                )


        logger.info(
            f"Retrieved {len(chunks)} relevant chunks"
        )


        return chunks



    except Exception as error:

        logger.exception(
            f"Vector search failed: {error}"
        )


        raise RuntimeError(
            "Failed to search vectors"
        ) from error