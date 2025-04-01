import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from embeddings import get_embedding
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Kết nối ChromaDB
chroma_client = chromadb.HttpClient(host="chromadb", port=8000)
collection = chroma_client.get_or_create_collection(name="posts")

def add_post(post_id: str, text: str):
    embedding = get_embedding(text)
    collection.add(ids=[post_id], embeddings=[embedding], metadatas=[{"text": text}])

def update_post(post_id: str, new_text: str):
    """ Chỉnh sửa bài viết bằng cách cập nhật nội dung và embedding """
    delete_post(post_id)  # Xóa bài cũ
    add_post(post_id, new_text)  # Thêm bài mới

def search_posts(query: str, page: int = 1, page_size: int = 5):
    query_embedding = get_embedding(query)
    results = collection.query(query_embeddings=[query_embedding], n_results=page * page_size)
    
    # Lấy kết quả cho trang hiện tại
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_results = results["documents"][0][start_idx:end_idx] if results["documents"] else []

    return {
        "page": page,
        "page_size": page_size,
        "total_results": len(results["documents"][0]) if results["documents"] else 0,
        "results": paginated_results
    }

def delete_post(post_id: str):
    collection.delete(ids=[post_id])    


def recommend_posts(embedding: List[float], n: int = 5):
    results = collection.query(query_embeddings=[embedding], n_results=n)
    
    recommended_posts = results["documents"][0] if results["documents"] else []
    
    return {
        "num_recommendations": len(recommended_posts),
        "recommended_posts": recommended_posts
    }