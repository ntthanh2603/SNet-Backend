from services.embeddings import Embeddings
from dto.create_post import CreatePostDto

class PostService:


  async def create(self,user_id: str, post: CreatePostDto):
    embeddings = Embeddings()
    embedding_post =  embeddings.get_embedding_text(post.content)
    return embedding_post

  





     
    