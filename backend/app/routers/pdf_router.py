import hashlib
import os
import uuid

from datetime import datetime
from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.responses import JSONResponse

from loguru import logger

from app.config import settings

from app.services.pdf_service import (
    extract_text_from_pdf,
)

from app.services.text_service import (
    split_text,
)

from app.services.embedding_service import (
    create_embeddings,
)

from app.services.vector_service import (
    store_vectors,
    delete_vectors_by_file,
)


router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)


UPLOAD_DIR = Path(
    settings.UPLOAD_DIR
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


def generate_file_hash(
    file_bytes: bytes,
) -> str:
    """
    Generate SHA256 hash.
    """

    return hashlib.sha256(
        file_bytes
    ).hexdigest()


def save_pdf(
    file_bytes: bytes,
    filename: str,
):

    file_id = str(
        uuid.uuid4()
    )

    saved_filename = (
        f"{file_id}_{filename}"
    )

    file_path = (
        UPLOAD_DIR /
        saved_filename
    )

    with open(
        file_path,
        "wb",
    ) as pdf:

        pdf.write(
            file_bytes
        )

    return (
        file_id,
        file_path,
    )


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        if (
            file.content_type
            !=
            "application/pdf"
        ):

            raise HTTPException(

                status_code=400,

                detail="Only PDF files are allowed."

            )

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(

                status_code=400,

                detail="Uploaded PDF is empty."

            )

        file_hash = generate_file_hash(
            file_bytes
        )

        file_id, file_path = save_pdf(

            file_bytes,

            file.filename,

        )

        logger.success(
            f"Saved PDF -> {file_path}"
        )

        pages = extract_text_from_pdf(
            str(file_path)
        )

        if not pages:

            raise RuntimeError(
                "No readable text found."
            )

        logger.success(

            f"Extracted {len(pages)} pages"

        )

        all_chunks = []

        metadata = []

        uploaded_at = (
            datetime.utcnow()
            .isoformat()
        )

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

                        "file_id": file_id,

                        "filename": file.filename,

                        "page": page["page"],

                        "uploaded_at": uploaded_at,

                        "hash": file_hash,

                    }

                )

        if not all_chunks:

            raise RuntimeError(
                "Chunk generation failed."
            )

        logger.success(

            f"Generated {len(all_chunks)} chunks"

        )

        embeddings = create_embeddings(
            all_chunks
        )

        if not embeddings:

            raise RuntimeError(
                "Embedding generation failed."
            )

        stored = store_vectors(

            all_chunks,

            embeddings,

            metadata,

        )

        logger.success(

            f"Stored {stored} vectors"

        )

        return {

            "success": True,

            "file_id": file_id,

            "filename": file.filename,

            "hash": file_hash,

            "pages": len(pages),

            "chunks": len(all_chunks),

            "vectors": stored,

            "uploaded_at": uploaded_at,

            "message":
                "PDF uploaded successfully."

        }

    except HTTPException:

        raise

    except Exception as error:

        logger.exception(error)

        raise HTTPException(

            status_code=500,

            detail=str(error)

        )
@router.get("/list")
async def list_uploaded_pdfs(): 
    try:

        pdfs = []

        if not UPLOAD_DIR.exists():

            return {

                "success": True,

                "count": 0,

                "documents": []

            }

        files = sorted(

            UPLOAD_DIR.iterdir(),

            key=lambda file: file.stat().st_mtime,

            reverse=True

        )

        for file in files:

            if not file.is_file():

                continue

            if file.suffix.lower() != ".pdf":

                continue

            parts = file.name.split(

                "_",

                1

            )

            if len(parts) == 2:

                file_id = parts[0]

                filename = parts[1]

            else:

                file_id = ""

                filename = file.name

            pdfs.append(

                {

                    "file_id": file_id,

                    "filename": filename,

                    "size_mb": round(

                        file.stat().st_size /

                        (1024 * 1024),

                        2

                    ),

                    "uploaded_at": datetime.fromtimestamp(

                        file.stat().st_mtime

                    ).isoformat()

                }

            )

        logger.info(

            f"Found {len(pdfs)} uploaded PDFs."

        )

        return {

            "success": True,

            "count": len(pdfs),

            "documents": pdfs

        }

    except Exception as error:

        logger.exception(error)

        raise HTTPException(

            status_code=500,

            detail="Unable to retrieve uploaded PDFs."

        )


@router.delete("/{file_id}")
async def delete_pdf(
    file_id: str
):

    try:

        target_file = None

        for file in UPLOAD_DIR.glob(

            f"{file_id}_*.pdf"

        ):

            target_file = file

            break

        if target_file is None:

            raise HTTPException(

                status_code=404,

                detail="PDF not found."

            )

        filename = target_file.name

        os.remove(target_file)

        delete_vectors_by_file(
            file_id
        )

        logger.success(

            f"Deleted {filename}"

        )

        return {

            "success": True,

            "file_id": file_id,

            "filename": filename,

            "message": "PDF deleted successfully."

        }

    except HTTPException:

        raise

    except Exception as error:

        logger.exception(error)

        raise HTTPException(

            status_code=500,

            detail="Unable to delete PDF."

        )