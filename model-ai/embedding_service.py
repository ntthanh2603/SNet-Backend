import torch
import chromadb
from sentence_transformers import SentenceTransformer
from models import EmbeddingRequest
from typing import List

class Embedding:
    def __init__(self):
        # self.client = chromadb.HttpClient(host="localhost", port=8001) # Khi dùng với docker 
        self.client = chromadb.PersistentClient(path="./chroma_db") # Khi dùng lưu data trên thư mục 
        self.collection = self.client.get_or_create_collection(name="user_embeddings")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", device=self.device)

    async def embedding_process(self, request: EmbeddingRequest):
        bio_emb = self.model.encode(request.bio) * 0.5
        website_emb = self.model.encode(request.website) * 0.3
        address_emb = self.model.encode(request.address) * 0.2

        final_embeddings = bio_emb + website_emb + address_emb

        await self.save_embedding(request.id, final_embeddings)

        return final_embeddings

    async def save_embedding(self, id: str, embedding: List[float]):
        collections = self.client.list_collections()
        print("Collections:", collections)  # In ra màn hình console để kiểm tra

        self.collection.add(ids=[id], embeddings=[embedding], metadatas=[{"text": "user-embedding"}])
