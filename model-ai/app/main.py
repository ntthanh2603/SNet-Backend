from fastapi import FastAPI
from config import settings
from models import EmbeddingRequest
from embedding_service import embedding_process
import uvicorn

app = FastAPI()

# Embedding data
@app.post("/embedding")
async def get_embedding(request: EmbeddingRequest):
    embedding = await embedding_process(request)
    print(embedding)
    return {"embedding": str(embedding)}

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
