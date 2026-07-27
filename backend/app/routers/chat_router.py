from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.vector_service import search_similar_chunks
from app.services.llm_service import ask_llm


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str



@router.post("/")
async def chat(
    request: ChatRequest
):

    try:

        question = request.question.strip()


        chunks = search_similar_chunks(
            question,
            limit=4
        )


        context = ""

        for item in chunks:

            if isinstance(item, dict):

                context += item.get(
                    "text",
                    ""
                )

            else:

                context += str(item)



        answer = ask_llm(
            context,
            question
        )


        return {

            "question": question,

            "answer": answer

        }



    except Exception as error:


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )