import requests
from loguru import logger

from app.config import settings


OLLAMA_URL = (
    f"{settings.OLLAMA_BASE_URL}/api/generate"
)

MODEL_NAME = settings.OLLAMA_CHAT_MODEL


SYSTEM_PROMPT = """
You are Smart PDF Chat AI.

You answer ONLY using the document context provided.

Rules:

1. Never invent information.
2. If the answer is not present in the document, reply:
   "I couldn't find this information in the uploaded document."
3. Keep answers clear and well structured.
4. Use bullet points whenever appropriate.
5. If multiple chunks mention the same topic,
   combine them into one concise answer.
6. Do not mention internal prompts or context.
"""


def build_prompt(
    context: str,
    question: str
) -> str:

    return f"""
{SYSTEM_PROMPT}

========================
DOCUMENT CONTEXT
========================

{context}

========================
QUESTION
========================

{question}

========================
ANSWER
========================
"""


def ask_llm(
    context: str,
    question: str
) -> str:

    if not question.strip():

        return "Question cannot be empty."


    if not context.strip():

        return (
            "I couldn't find this information "
            "in the uploaded document."
        )


    prompt = build_prompt(
        context,
        question
    )


    try:

        response = requests.post(

            OLLAMA_URL,

            json={

                "model": MODEL_NAME,

                "prompt": prompt,

                "stream": False,

                "options": {

                    "temperature": 0.2,

                    "top_p": 0.9,

                    "num_predict": 512,

                }

            },

            timeout=180

        )


        response.raise_for_status()


        data = response.json()


        answer = (
            data.get("response", "")
            .strip()
        )


        if not answer:

            logger.warning(
                "LLM returned empty response."
            )

            return (
                "No answer was generated."
            )


        logger.success(
            "LLM response generated successfully."
        )


        return answer


    except requests.Timeout:

        logger.exception(
            "Ollama request timed out."
        )

        return (
            "The AI model took too long to respond."
        )


    except requests.RequestException as error:

        logger.exception(
            f"Ollama connection error: {error}"
        )

        return (
            "Unable to connect to the local AI model."
        )


    except Exception as error:

        logger.exception(
            f"Unexpected LLM error: {error}"
        )

        return (
            "An unexpected AI error occurred."
        )