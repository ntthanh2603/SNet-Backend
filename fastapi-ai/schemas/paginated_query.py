from pydantic import BaseModel
from typing import Optional
from helpers.embeddinh_type import EmbeddingType


class PaginatedQuery(BaseModel):
    query: str
    page: int = 1
    page_size: int = 10
    type: Optional[EmbeddingType] = None