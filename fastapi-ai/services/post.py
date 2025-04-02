from database.chromadb import ChromaDb
from dto.create_post import CreatePostDto
from fastapi import File
import os
import shutil
from PIL import Image
from helpers.embeddinh_type import EmbeddingType
import uuid

class PostService:
  def __init__(self):
    self.chromadb = ChromaDb()

  async def create(self,user_id: str, post: CreatePostDto, media: File):
    file_path = os.path.join(os.getenv('UPLOAD_DIR'), media.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(media.file, buffer)

    post_id: str = str(uuid.uuid4())
    
    return await self.chromadb.create_with_text({
      "id": post_id,
      "text": post.content,
      "type": EmbeddingType.POST
    })

  





     
    