from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PostRequest(BaseModel):
    post_id: str
    text: str

@router.post("/createPosts")
def create_post():
    # add_post(body.post_id, body.text)
    # return {"message": "Post added", "post_id": body.post_id}
    return "hahaha"

# @router.put("/posts/{post_id}")
# def edit_post(post_id: str, body: PostRequest):
#     if post_id != body.post_id:
#         raise HTTPException(status_code=400, detail="Post ID mismatch")
#     update_post(post_id, body.text)
#     return {"message": "Post updated", "post_id": post_id}

# @router.get("/posts/search/")
# def search(text: str, page: int = 1, page_size: int = 5):
#     results = search_posts(text, page, page_size)
#     return results

# @router.delete("/posts/{post_id}")
# def delete(post_id: str):
#     delete_post(post_id)
#     return {"message": "Post deleted"}

# @router.post("/posts/recommend/")
# def recommend(body: RecommendRequest):
#     results = recommend_posts(body.embedding, body.n)
#     return results