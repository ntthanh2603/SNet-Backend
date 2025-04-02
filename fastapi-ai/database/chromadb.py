import chromadb
from services.embeddings import Embeddings
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
from helpers.embeddinh_type import EmbeddingType

# Connect to ChromaDB
chroma_client = chromadb.HttpClient(host="localhost", port=8001)
collection = chroma_client.get_or_create_collection(name="posts")


# Search by text
class PaginatedQuery(BaseModel):
    query: str
    page: int = 1
    page_size: int = 10
    type: Optional[EmbeddingType] = None


# Search by embedding
class EmbeddingSearchQuery(BaseModel):
    embedding: List[float]
    page: int = 1
    page_size: int = 10
    type: Optional[EmbeddingType] = None


class ChromaDb:
    def __init__(self):
        self.collection = collection
        self.embeddings = Embeddings()

    # Add data with text
    async def create_with_text(self, metadata: dict):
        try:
            embedding = self.embeddings.get_embedding_text(metadata['text'])
            metadata_type = metadata['type'].value if metadata.get('type') else None
            self.collection.add(
                ids=[metadata['id']],
                embeddings=[embedding],
                metadatas=[{"type": metadata_type} if metadata_type else {}],
                documents=None 
            )
            return {"message": f"Created embedding {metadata['id']} successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error create embedding: {str(e)}")
    
    # Add data with embedding
    async def create_with_embedding(self, data: dict):
        try:
            metadata_type = data['type'].value if data.get('type') else None
            self.collection.add(
                ids=[data['id']],
                embeddings=[data['embedding']],
                metadatas=[{"type": metadata_type} if metadata_type else {}],
                documents=None 
            )
            return {"message": f"Created embedding with ID {data['id']} successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating embedding: {str(e)}")

    # Delete data by id
    async def delete_by_id(self, id: str):
        try:
            self.collection.delete(ids=[id])
            return {"message": f"Delete embedding has id {id} successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting: {str(e)}")

    # Update with text
    async def update_with_text(self, metadata: dict):
        try:
            embedding = self.embeddings.get_embedding_text(metadata['text'])
            self.collection.update(
                ids=[metadata['id']],
                embeddings=[embedding],
                metadatas=[{"type": metadata['type']} if metadata.get('type') else {}],
                documents=None  
            )
            return {"message": f"Updated embedding {metadata['id']} successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating: {str(e)}")
    
    # Update with embedding 
    async def update_with_embedding(self, data: dict):
        try:
            self.collection.update(
                ids=[data['id']],
                embeddings=[data['embedding']],
                metadatas=[{"type": data['type']} if data.get('type') else {}],
                documents=None 
            )
            return {"message": f"Updated embedding {data['id']} successfully using provided embedding"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating with embedding: {str(e)}")

    # Suggest 
    async def suggest_posts(self, query: PaginatedQuery) -> dict:
        try:
            query_embedding = self.embeddings.get_embedding_text(query.query)
            
            # Add filter
            where_filter = {"type": query.type} if query.type else None
            
            fetch_limit = query.page_size * query.page * 5  
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=fetch_limit,
                where=where_filter,
                include=["metadatas", "distances"]  # Get not documents
            )

            total_results = len(results['ids'][0]) if results['ids'] and len(results['ids']) > 0 else 0
            start_idx = (query.page - 1) * query.page_size
            end_idx = min(start_idx + query.page_size, total_results)
            
            paginated_results = {
                "ids": results['ids'][0][start_idx:end_idx] if total_results > 0 else [],
                "metadatas": results['metadatas'][0][start_idx:end_idx] if total_results > 0 else [],
                "distances": results['distances'][0][start_idx:end_idx] if total_results > 0 else [],
                "pagination": {
                    "current_page": query.page,
                    "page_size": query.page_size,
                    "total_results": total_results,
                    "total_pages": (total_results + query.page_size - 1) // query.page_size if total_results > 0 else 0
                }
            }
            return paginated_results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error querying: {str(e)}")

    # Find by embedding
    async def search_by_embedding(self, query: EmbeddingSearchQuery) -> dict:
        try:
            # Add filter if has type
            where_filter = {"type": query.type} if query.type else None
            
            fetch_limit = query.page_size * query.page * 5
            
            results = self.collection.query(
                query_embeddings=[query.embedding],
                n_results=fetch_limit,
                where=where_filter,
                include=["metadatas", "distances"]  
            )

            total_results = len(results['ids'][0]) if results['ids'] and len(results['ids']) > 0 else 0
            start_idx = (query.page - 1) * query.page_size
            end_idx = min(start_idx + query.page_size, total_results)

            paginated_results = {
                "ids": results['ids'][0][start_idx:end_idx] if total_results > 0 else [],
                "metadatas": results['metadatas'][0][start_idx:end_idx] if total_results > 0 else [],
                "distances": results['distances'][0][start_idx:end_idx] if total_results > 0 else [],
                "pagination": {
                    "current_page": query.page,
                    "page_size": query.page_size,
                    "total_results": total_results,
                    "total_pages": (total_results + query.page_size - 1) // query.page_size if total_results > 0 else 0
                }
            }
            return paginated_results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching by embedding: {str(e)}")
    
    # Get embedding by id
    async def get_by_id(self, id: str) -> dict:
        try:
            results = self.collection.get(
                ids=[id],
                include=["embeddings", "metadatas"] 
            )
            
            if not results["ids"] or len(results["ids"]) == 0:
                raise HTTPException(status_code=404, detail=f"Embedding with ID {id} not found")
                
            return {
                "id": results["ids"][0],
                "embedding": results["embeddings"][0],
                "metadata": results["metadatas"][0]
            }
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Error retrieving embedding by ID: {str(e)}")