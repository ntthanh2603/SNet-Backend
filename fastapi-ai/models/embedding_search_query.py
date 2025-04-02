from pydantic import BaseModel
from typing import Optional, List
from helpers.embeddinh_type import EmbeddingType


# Search by embedding
class EmbeddingSearchQuery(BaseModel):
    embedding: List[float]
    page: int = 1
    page_size: int = 10
    type: Optional[EmbeddingType] = None
