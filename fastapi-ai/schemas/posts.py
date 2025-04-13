from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from helpers.privacy_type import PrivacyType


class PostsBase(BaseModel):
    id: str
    user_id: str
    content: str
    hashtags: Optional[str] = None
    medias: Optional[str] = None
    privacy: PrivacyType = PrivacyType.PUBLIC
    created_at: datetime



