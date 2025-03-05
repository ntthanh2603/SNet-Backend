from enums import Gender
from pydantic import BaseModel

class EmbeddingRequest(BaseModel):
    id: str
    email: str
    username: str
    bio: str | None = None
    website: str | None = None
    gender: Gender
    address: str | None = None