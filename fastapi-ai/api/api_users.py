from fastapi import APIRouter, Request
from services.user import UserService


router = APIRouter()

# Embedding user by text when create user
# @router.post("/create")
# def create_user(dto: CreateUserDto, request: Request):
#     return UserService.create(dto, request.state.user.id)
