from pydantic import BaseModel
from datetime import datetime

class DeviceSessionBase(BaseModel):
    user_id: str
    device_id: str
    ip_address: str
    secret_key: str
    refresh_token: str
    expired_at: datetime

class DeviceSessionCreate(DeviceSessionBase):
     pass

class DeviceSessionResponse(DeviceSessionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
