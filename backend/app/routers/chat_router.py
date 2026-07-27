from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from loguru import logger

from app.services.vector_service import search_similar_chunks
from app.services.llm_service import ask_llm


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="User question"
    )


class Source(BaseModel):

    filename: str | None = None
    page: int | None = None


class ChatResponse(BaseModel):

    question: str
    answer: str
    sources: List[Source]


def build_context(results: List[dict]) -> str:

    context_parts = []

    for item in results:

        text = item.get("text", "").strip()

        if text:

            context_parts.append(text)

    return "\n\n".join(context_parts)


def build_sources(results: List[dict]) -> List[dict]:

    seen = set()

    sources = []

    for item in results:

        key = (
            item.get("filename"),
            item.get("page")
        )

        if key in seen:
            continue

        seen.add(key)

        sources.append(
            {
                "filename": item.get("filename"),
                "page": item.get("page")
            }
        )

    return sources


@router.post(
    "/",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    try:

        question = request.question.strip()

        logger.info(
            f"Incoming question: {question}"
        )

        results = search_similar_chunks(
            question=question,
            limit=5
        )

        if not results:

            return ChatResponse(

                question=question,

                answer=(
                    "No relevant information "
                    "was found in the uploaded documents."
                ),

                sources=[]
            )

        context = build_context(results)

        answer = ask_llm(
            context=context,
            question=question
        )

        sources = build_sources(results)

        logger.success(
            f"Answer generated with {len(sources)} sources."
        )

        return ChatResponse(

            question=question,

            answer=answer,

            sources=sources

        )

    except HTTPException:
        raise

    except Exception as error:

        logger.exception(
            f"Chat failed: {error}"
        )

        raise HTTPException(

            status_code=500,

            detail="Unable to process chat request."

        )