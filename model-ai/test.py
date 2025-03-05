import torch
from sentence_transformers import SentenceTransformer

device = "cuda" if torch.cuda.is_available() else "cpu"

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device=device)

sentences = "This is an example sentence"
embeddings = model.encode(sentences)

print(embeddings.shape) 


embedding()