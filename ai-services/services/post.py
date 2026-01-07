from database.chromadb import ChromaDb
from database.base import get_db
from sqlalchemy import text
from fastapi import HTTPException
from schemas.posts import PostsBase
from services.ai import AIService


class PostService:
    def __init__(self):
        self.chromadb = ChromaDb()
        self.model_ai = AIService()
    
    async def find_post_by_id(self, posts_id: str):
      
      async for db in get_db():
        try:
          query = text(
              "SELECT * FROM post WHERE id = :post_id"
          )
          result = await db.execute(query, {"post_id": posts_id})
          post = result.mappings().first()
          
          if not post:
            raise HTTPException(
              status_code=404,
              detail="Post not found"
            )

          return post

        except HTTPException as http_exc:
          raise http_exc
        except Exception as e:
            raise HTTPException(
              status_code=500,
              detail=f"Database error: {str(e)}"
            )
    
    # Check policy for post
    async def check_policy_for_posts(self, posts_id: str):
      posts: PostsBase = await self.find_post_by_id(posts_id)
      # Get medias
      medias = posts["medias"]
      # Check medias empty
      if not medias:
        return {"message": "Post is'n media"}
      
      result = []

      # Loop medias and detect image 
      for media in medias:
        detect = await self.model_ai.classify_image(media)
        result.append(detect)

      return result
         
