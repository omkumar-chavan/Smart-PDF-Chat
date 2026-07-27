from typing import List, Dict

from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import (
    BaseModel,
    Field
)

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





class Source(BaseModel):

    filename: str | None = None

    page: int | None = None





class ChatResponse(BaseModel):

    question: str

    answer: str

    sources: List[Source]






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




        # Search relevant chunks

        results = search_similar_chunks(

            question,

            limit=4

        )




        if not results:


            return {

                "question": question,

                "answer":
                    "No relevant information found in uploaded documents.",

                "sources": []

            }





        context = "\n\n".join(

            item["text"]

            for item in results

        )




        # Generate answer

        answer = ask_llm(

            context,

            question

        )




        sources = []


        for item in results:

            sources.append(

                {

                    "filename":
                        item.get("filename"),

                    "page":
                        item.get("page")

                }

            )





        return {

            "question": question,

            "answer": answer,

            "sources": sources

        }





    except Exception as error:


        logger.exception(

            f"Chat processing failed: {error}"

        )



        raise HTTPException(

            status_code=500,

            detail="Unable to process chat request."

        )