from typing import List

from langchain_text_splitters import RecursiveCharacterTextSplitter
from loguru import logger



def split_text(
    text: str
) -> List[str]:
    """
    Split extracted PDF text into smaller chunks
    for embedding and vector storage.

    Args:
        text:
            Extracted PDF text.

    Returns:
        List of text chunks.
    """


    if not text or not text.strip():

        raise ValueError(
            "Cannot split empty text."
        )


    try:

        splitter = RecursiveCharacterTextSplitter(

            chunk_size=500,

            chunk_overlap=50,

            length_function=len,

            separators=[
                "\n\n",
                "\n",
                " ",
                ""
            ]

        )


        chunks = splitter.split_text(
            text.strip()
        )


        if not chunks:

            raise ValueError(
                "Text splitting produced no chunks."
            )


        logger.success(
            f"Created {len(chunks)} text chunks"
        )


        return chunks



    except Exception as error:

        logger.exception(
            f"Text splitting failed: {error}"
        )


        raise RuntimeError(
            "Failed to split document text"
        ) from error