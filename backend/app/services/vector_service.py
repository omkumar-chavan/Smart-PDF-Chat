from typing import List, Dict
from uuid import uuid4

from loguru import logger
from qdrant_client.http import models

from app.database import get_qdrant_client
from app.config import settings
from app.services.embedding_service import embed_query



def store_vectors(
    chunks: List[str],
    embeddings_list: List[List[float]],
    metadata: List[Dict]
) -> int:
    """
    Store document chunks with metadata inside Qdrant.
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


    if len(chunks) != len(metadata):

        raise ValueError(
            "Chunks and metadata count mismatch."
        )


    client = get_qdrant_client()


    points = []


    for chunk, vector, info in zip(
        chunks,
        embeddings_list,
        metadata
    ):

        points.append(

            models.PointStruct(

                id=str(uuid4()),

                vector=vector,

                payload={
                    "text": chunk,
                    "page": info.get("page"),
                    "filename": info.get("filename")
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
) -> List[Dict]:
    """
    Search relevant chunks with metadata.
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

                    {
                        "text": point.payload["text"],

                        "page": point.payload.get(
                            "page"
                        ),

                        "filename": point.payload.get(
                            "filename"
                        )
                    }

                )



        logger.info(
            f"Retrieved {len(chunks)} chunks"
        )


        return chunks



    except Exception as error:


        logger.exception(
            f"Vector search failed: {error}"
        )


        raise RuntimeError(
            "Failed to search vectors"
        ) from error