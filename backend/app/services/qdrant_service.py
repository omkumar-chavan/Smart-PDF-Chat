from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
)

client = QdrantClient(
    host="localhost",
    port=6333,
)

COLLECTION = "smart_pdf_chat"


def create_collection():

    collections = client.get_collections().collections

    names = [c.name for c in collections]

    if COLLECTION not in names:

        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=768,
                distance=Distance.COSINE,
            ),
        )


def store_vectors(chunks, vectors):

    create_collection()

    points = []

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):

        points.append(
            PointStruct(
                id=i,
                vector=vector,
                payload={
                    "text": chunk
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION,
        points=points,
    )


def search_vectors(query_vector, limit=5):

    result = client.query_points(
        collection_name=COLLECTION,
        query=query_vector,
        limit=limit,
        with_payload=True,
    )

    return result.points