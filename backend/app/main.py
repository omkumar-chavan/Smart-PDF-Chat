from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    pdf_router,
    chat_router
)


app = FastAPI(
    title="Smart PDF Chat API"
)



app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]

)




app.include_router(
    pdf_router.router
)


app.include_router(
    chat_router.router
)




@app.get("/")
def home():

    return {
        "message":
        "Smart PDF Chat API running"
    }