from fastapi import APIRouter, Request
from middlewares.auth_middleware import auth_middleware
from  api import api_posts 

router = APIRouter()

router.include_router(api_posts.router, tags=["posts"], prefix="")