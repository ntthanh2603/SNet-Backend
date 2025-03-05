import torch
from sentence_transformers import SentenceTransformer
from models import EmbeddingRequest

device = "cuda" if torch.cuda.is_available() else "cpu"

async def embedding_process(request: EmbeddingRequest):
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", device=device)

    bio_emb = model.encode(request.bio) * 0.5
    website_emb = model.encode(request.website) * 0.3
    address_emb = model.encode(request.address) * 0.2

    final_embeddings = bio_emb + website_emb + address_emb

    return final_embeddings
