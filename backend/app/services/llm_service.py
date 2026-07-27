from langchain_ollama import ChatOllama
from loguru import logger

from app.config import settings



def get_llm():
    """
    Create Ollama chat model instance.
    """

    return ChatOllama(

        model=settings.OLLAMA_CHAT_MODEL,

        base_url=settings.OLLAMA_BASE_URL,

        temperature=0

    )




def ask_llm(
    context: str,
    question: str
) -> str:
    """
    Generate answer using retrieved PDF context.
    """

    if not question.strip():

        raise ValueError(
            "Question cannot be empty."
        )


    if not context.strip():

        raise ValueError(
            "Context cannot be empty."
        )


    prompt = f"""
You are an AI assistant for answering questions from uploaded documents.

Rules:
- Answer only using the provided context.
- Do not use outside knowledge.
-If the context contains relevant information, answer using it even if wording is slightly different.
Only say "I could not find the answer in the uploaded PDF." when there is absolutely no related information.
Context:
{context}


Question:
{question}


Answer:
"""


    try:

        llm = get_llm()


        response = llm.invoke(
            prompt
        )


        logger.success(
            "LLM response generated successfully"
        )


        return response.content.strip()



    except Exception as error:

        logger.exception(
            f"LLM generation failed: {error}"
        )


        raise RuntimeError(
            "Failed to generate AI response."
        ) from error