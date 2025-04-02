from pydantic import BaseModel
from helpers.embeddinh_type import EmbeddingType
from typing import Optional, List

class Metadata(BaseModel):
  id: str
  text: str
  type: Optional[EmbeddingType] = None
  Embedding: Optional[List[float]] = None
