from pydantic import BaseModel
from typing import Optional

class IUser(BaseModel):
    id: str
    deviceSessionId: Optional[str] = None
    role: str
    iat: int
    exp: int

