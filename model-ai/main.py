from fastapi import FastAPI
from config import settings
from models import EmbeddingRequest
from embedding_service import Embedding

import uvicorn

app = FastAPI()

embedding_instance = Embedding()

# Embedding data
@app.post("/embedding")
async def get_embedding(request: EmbeddingRequest):

    embedding = await embedding_instance.embedding_process(request)
 
    return {"embedding": embedding.tolist()}

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
