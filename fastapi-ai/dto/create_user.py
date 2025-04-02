from pydantic import BaseModel

class CreateUserDto(BaseModel):
    text: str
    image: str