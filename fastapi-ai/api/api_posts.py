from fastapi import APIRouter, Request, UploadFile, File, Form
from services.post import PostService
from dto.create_post import CreatePostDto
import os
import shutil
import json

router = APIRouter()

postService = PostService()

UPLOAD_DIR = "medias/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/create")
async def create_post(request: Request ,post: str = Form(...),  media: UploadFile = File(...)):
    post = json.loads(post)
    # Transform to CreatePostDto
    post = CreatePostDto(**post)

    return await postService.create(request.state.user['id'], post, media)



