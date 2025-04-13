from services.embeddings import Embeddings



class UserService: 
  def __init__(self, embeddings: Embeddings):
    self.embeddings = embeddings

  # async def create(self,dto: CreateUserDto, user_id: str):
  #   embedding_text = await self.embeddings.get_embedding_text(dto.text)
  

