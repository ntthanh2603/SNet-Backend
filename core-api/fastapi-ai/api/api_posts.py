from fastapi import APIRouter
from services.post import PostService
from schemas.id_request import IDRequest

router = APIRouter()

postService = PostService()

@router.post("/check-policy-for-post")
async def check_policy_for_post(dto: IDRequest):
    return await postService.check_policy_for_posts(dto.id)


