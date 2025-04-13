from pydantic import BaseModel


class IDRequest(BaseModel):
    id: str
