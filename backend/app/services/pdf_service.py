import os
from pathlib import Path

import cv2
import numpy as np
import pytesseract

from pathlib import Path
from pypdf import PdfReader
from pdf2image import convert_from_path
from loguru import logger


POPPLER_PATH = r"C:\poppler\poppler-26.02.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def preprocess_image(image):
    """
    Prepare PDF image for OCR.
    Handles PIL image conversion and preprocessing.
    """

    # PIL Image -> numpy array
    img = np.array(image)

    # RGB/RGBA -> Gray
    if len(img.shape) == 3:
        img = cv2.cvtColor(
            img,
            cv2.COLOR_RGB2GRAY
        )

    # Remove noise
    img = cv2.medianBlur(
        img,
        3
    )

    # Improve contrast
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
) -> str:
    """
    Extract text from any PDF.

    Pipeline:
    1. Try normal PDF text extraction
    2. If no text found -> OCR
    3. Supports scanned/cropped PDFs
    """

    pdf_path = Path(file_path)

    if not pdf_path.exists():
        raise RuntimeError(
            f"PDF file not found: {file_path}"
        )

    logger.info(
        f"Processing PDF: {pdf_path.name}"
    )


    text = ""


    # ----------------------------
    # Method 1: Normal PDF Text
    # ----------------------------

    try:

        reader = PdfReader(
            str(pdf_path)
        )

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"


    except Exception as e:

        logger.warning(
            f"Normal extraction failed: {e}"
        )


    # If readable text exists
    if len(text.strip()) > 50:

        logger.success(
            f"Extracted {len(text)} characters using PDF parser"
        )

        return text



    # ----------------------------
    # Method 2: OCR
    # ----------------------------

    logger.info(
        "No readable text found. Starting OCR..."
    )


    try:

        images = convert_from_path(
            str(pdf_path),
            dpi=300,
            poppler_path=POPPLER_PATH
        )


        for index, image in enumerate(images):

            logger.info(
                f"OCR page {index + 1}"
            )


            processed = preprocess_image(
                image
            )


            page_text = pytesseract.image_to_string(
                processed,
                config="--psm 11"
            )


            text += page_text + "\n"



    except Exception as e:

        logger.error(
            f"OCR failed: {e}"
        )

        raise RuntimeError(
            f"OCR processing failed: {e}"
        )



    if len(text.strip()) == 0:

        raise RuntimeError(
            "No text could be extracted from PDF"
        )


    logger.success(
        f"OCR extracted {len(text)} characters"
    )


    return text