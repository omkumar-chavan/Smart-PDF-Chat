import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
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

    file_path = None

    try:

        # Validate file type

        if not file.filename.lower().endswith(".pdf"):

            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed."
            )


        # Create unique filename

        file_id = str(uuid.uuid4())

        safe_filename = f"{file_id}_{file.filename}"

        file_path = os.path.join(
            UPLOAD_DIR,
            safe_filename
        )


        # Save uploaded PDF

        with open(
            file_path,
            "wb"
        ) as buffer:

            content = await file.read()

            buffer.write(content)



        logger.info(
            f"PDF saved: {file_path}"
        )



        # Extract text (pypdf + OCR fallback)

        text = extract_text_from_pdf(
            file_path
        )


        if not text.strip():

            raise RuntimeError(
                "No readable text found in PDF."
            )


        logger.success(
            f"Extracted {len(text)} characters"
        )



        # Split text into chunks

        chunks = split_text(
            text
        )


        if not chunks:

            raise RuntimeError(
                "Text chunk generation failed."
            )


        logger.success(
            f"Generated {len(chunks)} chunks"
        )



        # Generate embeddings

        embeddings = create_embeddings(
            chunks
        )


        if not embeddings:

            raise RuntimeError(
                "Embedding generation failed."
            )


        logger.success(
            f"Generated {len(embeddings)} embeddings"
        )



        # Store vectors in Qdrant

        stored_count = store_vectors(
            chunks,
            embeddings
        )


        logger.success(
            f"Stored {stored_count} vectors in Qdrant"
        )



        return {

            "success": True,

            "filename": file.filename,

            "characters": len(text),

            "chunks": len(chunks),

            "vectors": stored_count,

            "message": "PDF uploaded and indexed successfully."

        }



    except HTTPException:

        raise



    except Exception as error:


        logger.exception(
            f"PDF processing failed: {error}"
        )


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )



    finally:

        # Optional cleanup
        # Keep uploaded PDFs if you want history
        pass