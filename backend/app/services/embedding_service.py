from langchain_ollama import OllamaEmbeddings
from loguru import logger

from app.config import settings


embeddings = OllamaEmbeddings(
    model=settings.OLLAMA_EMBED_MODEL,
    base_url=settings.OLLAMA_BASE_URL,
)



def create_embeddings(chunks):

    try:

        if not chunks:
            raise ValueError(
                "No chunks provided for embedding."
            )


        logger.info(
            f"Creating embeddings for {len(chunks)} chunks"
        )


        vectors = embeddings.embed_documents(
            chunks
        )


        if not vectors:
            raise RuntimeError(
                "Embedding model returned empty vectors."
            )


        logger.success(
            f"Created {len(vectors)} embeddings"
        )


        return vectors


    except Exception as error:

        logger.exception(
            f"Embedding creation failed: {error}"
        )

        raise RuntimeError(
            f"Failed to create document embeddings: {error}"
        )



def embed_query(question):

    try:

        return embeddings.embed_query(
            question
        )


    except Exception as error:

        logger.exception(
            f"Query embedding failed: {error}"
        )

        raise RuntimeError(
            f"Failed to create query embedding: {error}"
        )