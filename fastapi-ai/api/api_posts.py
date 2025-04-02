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

# @router.post("/create")
# async def create_post(request: Request ,post: str , media: UploadFile = File(...)):
#     post = json.loads(post)
#     print(f"post: {post}")
#     # Chuyển dictionary thành CreatePostDto
#     post = CreatePostDto(**post)

#     file_path = os.path.join(UPLOAD_DIR, media.filename)
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(media.file, buffer)

#     embedding_post = await postService.create(request.state.user['id'], post)
#     return embedding_post

# @router.post("/create")
# async def create_post(request: Request ,post: CreatePostDto , media: UploadFile = File(...)):
#     print(f"request: {request.state.user}")
#     print(f"post: {post['content']}")
#     print(f"media: {media.filename}")
 
#     return post

@router.post("/create")
async def create_post(request: Request ,post: str = Form(...),  ):
    # post = post.dict()
    post = json.loads(post)
    print(f"request: {request.state.user}")
    print(f"post: {post}")

 
    return post

@router.post("/test")
async def create_post(request: Request ):
    print(f"request: {request.body}")
    return request.state.user