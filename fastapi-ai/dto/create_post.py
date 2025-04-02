from pydantic import BaseModel
from typing import List
from helpers.privacy_type import PrivacyType

class CreatePostDto(BaseModel):
    content: str
    hashtags: List[str]
    privacy: PrivacyType