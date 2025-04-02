from pydantic import BaseModel
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import jwt  
from models.user_interface import IUser
from services.auth import AuthService


# Middleware authorization
async def auth_middleware(request: Request, call_next):
  # List routers public
  public_routes = {"/docs", "/openapi.json", "/token"}

  if request.url.path in public_routes:
      return await call_next(request)

  # Get token from header
  token = request.headers.get("authorization").split(" ")[1]

  if not token:
      return JSONResponse(
          status_code=status.HTTP_401_UNAUTHORIZED,
          content={"detail": "Authorization header missing or invalid"}
      )
  
  try:
      auth_service = AuthService()
      payload: IUser = await auth_service.verify_token(token)
      
      request.state.user = payload
      
      # Continue process request
      response = await call_next(request)
      
      return response
  
  except HTTPException as e:
      return JSONResponse(
          status_code=e.status_code,
          content={"detail": e.detail}
      )