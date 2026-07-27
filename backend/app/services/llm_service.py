import requests
from loguru import logger


OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL_NAME = "qwen3.5:4b"



def ask_llm(context, question):

    try:

        prompt = f"""
You are Smart PDF Chat AI.

Use this document context to answer.

Context:
{context}


Question:
{question}


Answer:
"""


        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=180
        )


        logger.info(
            f"Ollama status: {response.status_code}"
        )


        logger.info(
            f"Ollama raw response: {response.text}"
        )


        data = response.json()


        if "response" in data:

            return data["response"]


        return "No answer generated."



    except Exception as e:

        logger.exception(
            f"LLM failed: {e}"
        )

        return "AI generation failed."