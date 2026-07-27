from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.config import settings
from app.database import health_check

from app.routers import (
    pdf_router,
    chat_router
)



app = FastAPI(

    title=settings.APP_NAME,

    version="1.0.0"

)



app.add_middleware(

    CORSMiddleware,

    allow_origins=settings.CORS_ORIGINS,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)



@app.get("/")
def home():

    return {

        "message": "Smart PDF Chat Backend Running"

    }




@app.get("/health")
def health():

    qdrant_status = health_check()


    return {

        "status": "healthy"
        if qdrant_status
        else "unhealthy",

        "qdrant": qdrant_status

    }




@app.on_event("startup")
async def startup_event():

    logger.info(
        "Starting Smart PDF Chat API"
    )


    try:

        health_check()

        logger.success(
            "Database connection verified"
        )


    except Exception as error:

        logger.warning(
            f"Startup check failed: {error}"
        )




app.include_router(
    pdf_router.router
)


app.include_router(
    chat_router.router
)