from typing import Optional, List

from qdrant_client import QdrantClient
from qdrant_client.http import models
from loguru import logger

from app.config import settings



class QdrantDatabaseManager:
    """
    Handles Qdrant connection and collection initialization.
    """

    def __init__(self):
        self._client: Optional[QdrantClient] = None


    def get_client(self) -> QdrantClient:
        """
        Returns singleton Qdrant client.
        """

        if self._client is None:
            self._client = self._initialize()

        return self._client



    def _initialize(self) -> QdrantClient:

        logger.info(
            f"Connecting Qdrant at {settings.QDRANT_HOST}:{settings.QDRANT_PORT}"
        )

        try:

            client = QdrantClient(
                host=settings.QDRANT_HOST,
                port=settings.QDRANT_PORT,
                timeout=10
            )


            client.get_collections()

            logger.success(
                "Qdrant connection successful"
            )


            self._create_collection_if_missing(client)


            return client


        except Exception as error:

            logger.exception(
                f"Qdrant connection failed: {error}"
            )

            raise RuntimeError(
                "Unable to connect with Qdrant"
            ) from error




    def _create_collection_if_missing(
        self,
        client: QdrantClient
    ):

        collection = settings.QDRANT_COLLECTION


        if client.collection_exists(collection):

            logger.info(
                f"Collection already exists: {collection}"
            )

            return



        logger.info(
            f"Creating collection: {collection}"
        )


        client.create_collection(

            collection_name=collection,

            vectors_config=models.VectorParams(

                size=settings.EMBEDDING_DIMENSION,

                distance=models.Distance.COSINE
            )
        )


        logger.success(
            f"Collection created: {collection}"
        )



    def close(self):

        if self._client:

            self._client.close()

            self._client = None





db_manager = QdrantDatabaseManager()



def get_qdrant_client() -> QdrantClient:
    return db_manager.get_client()



def health_check() -> bool:

    try:

        get_qdrant_client().get_collections()

        return True

    except Exception:

        return False




def search_chunks(
    query_vector: List[float],
    limit: int = 3
):

    client = get_qdrant_client()


    results = client.query_points(

        collection_name=settings.QDRANT_COLLECTION,

        query=query_vector,

        limit=limit,

        with_payload=True
    )


    return results.points