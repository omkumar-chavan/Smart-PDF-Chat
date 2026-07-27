import cv2
import numpy as np
import pytesseract

from pathlib import Path
from typing import List, Dict

from pypdf import PdfReader
from pdf2image import convert_from_path
from loguru import logger


POPPLER_PATH = r"C:\poppler\poppler-26.02.0\Library\bin"

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def preprocess_image(image):
    """
    Preprocess image for OCR.
    """

    img = np.array(image)

    if len(img.shape) == 3:
        img = cv2.cvtColor(
            img,
            cv2.COLOR_RGB2GRAY
        )

    img = cv2.medianBlur(
        img,
        3
    )

    img = cv2.adaptiveThreshold(
        img,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        10
    )

    return img



def extract_text_from_pdf(
    file_path: str
) -> List[Dict]:
    """
    Extract PDF text page wise.

    Returns:
    [
        {
            "page": 1,
            "text": "content"
        }
    ]
    """

    pdf_path = Path(file_path)

    if not pdf_path.exists():

        raise RuntimeError(
            f"PDF not found: {file_path}"
        )


    pages = []


    logger.info(
        f"Processing PDF: {pdf_path.name}"
    )


    # -------------------------
    # Normal PDF extraction
    # -------------------------

    try:

        reader = PdfReader(
            str(pdf_path)
        )


        for index, page in enumerate(
            reader.pages
        ):

            text = page.extract_text() or ""


            if text.strip():

                pages.append(
                    {
                        "page": index + 1,
                        "text": text.strip()
                    }
                )


    except Exception as error:

        logger.warning(
            f"PDF extraction failed: {error}"
        )


    if pages:

        logger.success(
            f"Extracted {len(pages)} pages using PDF parser"
        )

        return pages



    # -------------------------
    # OCR fallback
    # -------------------------

    logger.info(
        "Starting OCR extraction"
    )


    try:

        images = convert_from_path(
            str(pdf_path),
            dpi=300,
            poppler_path=POPPLER_PATH
        )


        for index, image in enumerate(images):

            logger.info(
                f"OCR processing page {index+1}"
            )


            processed = preprocess_image(
                image
            )


            text = pytesseract.image_to_string(
                processed,
                config="--psm 11"
            )


            if text.strip():

                pages.append(
                    {
                        "page": index + 1,
                        "text": text.strip()
                    }
                )


    except Exception as error:

        logger.exception(
            f"OCR failed: {error}"
        )

        raise RuntimeError(
            f"OCR failed: {error}"
        )


    if not pages:

        raise RuntimeError(
            "No readable text found in PDF"
        )


    logger.success(
        f"OCR extracted {len(pages)} pages"
    )


    return pages