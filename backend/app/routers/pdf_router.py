import os
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from loguru import logger

from app.services.pdf_service import extract_text_from_pdf
from app.services.text_service import split_text
from app.services.embedding_service import create_embeddings
from app.services.vector_service import store_vectors


router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)



@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        if not file.filename.lower().endswith(".pdf"):

            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed."
            )


        file_id = str(uuid.uuid4())


        filename = (
            f"{file_id}_{file.filename}"
        )


        file_path = os.path.join(
            UPLOAD_DIR,
            filename
        )


        # Save PDF

        with open(
            file_path,
            "wb"
        ) as buffer:

            buffer.write(
                await file.read()
            )


        logger.success(
            f"PDF saved: {file_path}"
        )


        # Extract page wise text

        pages = extract_text_from_pdf(
            file_path
        )


        if not pages:

            raise RuntimeError(
                "No text extracted from PDF."
            )


        logger.success(
            f"Extracted {len(pages)} pages"
        )



        # Create chunks with metadata

        all_chunks = []
        metadata = []


        for page in pages:

            chunks = split_text(
                page["text"]
            )


            for chunk in chunks:

                all_chunks.append(
                    chunk
                )


                metadata.append(
                    {
                        "page": page["page"],
                        "filename": file.filename
                    }
                )



        if not all_chunks:

            raise RuntimeError(
                "Chunk generation failed."
            )


        logger.success(
            f"Generated {len(all_chunks)} chunks"
        )



        # Create embeddings

        embeddings = create_embeddings(
            all_chunks
        )


        if not embeddings:

            raise RuntimeError(
                "Embedding generation failed."
            )



        # Store in Qdrant

        stored_count = store_vectors(
            all_chunks,
            embeddings,
            metadata
        )


        logger.success(
            f"Stored {stored_count} vectors"
        )


        return {

            "success": True,

            "filename": file.filename,

            "pages": len(pages),

            "chunks": len(all_chunks),

            "vectors": stored_count,

            "message":
                "PDF uploaded and indexed successfully."

        }



    except HTTPException:

        raise



    except Exception as error:

        logger.exception(
            f"PDF upload failed: {error}"
        )


        raise HTTPException(
            status_code=500,
            detail=str(error)
        )