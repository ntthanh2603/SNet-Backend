from pydantic import BaseModel
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import jwt  
from schemas.user_interface import IUser
from services.auth import AuthService
from core.settings import settings

# API public
public_routes = {"/docs", "/openapi.json", "/token"}
# API backend nestjs call
system_routes = {"/posts/check-policy-for-post"}

# Middleware authorization
async def auth_middleware(request: Request, call_next):

  path = request.url.path
  key_auth = request.headers.get("key_auth")
  valid_key = settings.KEY_AUTH

  # Check if the request is for a public route
  if path in public_routes:
      return await call_next(request)

  # Check if the request is for a system route
  if path in system_routes:
      if key_auth == valid_key:
          return await call_next(request)
      else:
          return JSONResponse(
              status_code=status.HTTP_403_FORBIDDEN,
              content={"detail": "Your request is not access"}
          )
  
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