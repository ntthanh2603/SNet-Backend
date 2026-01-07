from fastapi import APIRouter
from  api import api_posts, api_users 

router = APIRouter()

router.include_router(api_posts.router, tags=["posts"], prefix="/posts")
router.include_router(api_users.router, tags=["users"], prefix="/users")