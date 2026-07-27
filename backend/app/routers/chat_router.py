from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import BaseModel, Field

from loguru import logger

from app.services.vector_service import (
    search_similar_chunks
)

from app.services.llm_service import (
    ask_llm
)



router = APIRouter(

    prefix="/chat",

    tags=["Chat"]

)



class ChatRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=3,
        description="User question"
    )



class ChatResponse(BaseModel):

    question: str

    answer: str

    sources: int





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
            f"Chat query received: {question}"
        )



        # Retrieve relevant document chunks

        context_chunks = search_similar_chunks(

            question,

            limit=4

        )



        if not context_chunks:

            return {

                "question": question,

                "answer":
                    "No relevant information found in uploaded documents.",

                "sources": 0

            }



        context = "\n\n".join(
            context_chunks
        )



        # Generate answer using Ollama

        answer = ask_llm(

            context,

            question

        )



        return {

            "question": question,

            "answer": answer,

            "sources": len(context_chunks)

        }



    except Exception as error:


        logger.exception(
            f"Chat processing failed: {error}"
        )


        raise HTTPException(

            status_code=500,

            detail="Unable to process chat request."

        )