import jwt 
from schemas.user_interface import IUser
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from services.device_session import DeviceSessionService
import os

class AuthService:
    # Decode token
    def decode_token(self, token: str) -> IUser:
        try:
            payload = jwt.decode(token, options={"verify_signature": False})

            return payload
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # Verify token
    async def verify_token(self, token: str) -> IUser:
        try:
            payload = self.decode_token(token)

            secret_key: str = await DeviceSessionService.get_secret_key(
                device_session_id=payload['deviceSecssionId'], 
                user_id=payload['id'])

            result = jwt.decode(token, secret_key, algorithms=[os.getenv('JWT_ALGORITHM')])

            return result

        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )