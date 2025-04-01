from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load biến môi trường từ file .env
load_dotenv()

# Lấy thông tin kết nối từ biến môi trường
DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")  # Giá trị mặc định là "localhost"
DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")  # Giá trị mặc định là "5432"
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME", "user")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "password")
DATABASE_NAME = os.getenv("DATABASE_NAME", "database")

# Kiểm tra nếu biến môi trường bị None
if not all([DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME]):
    raise ValueError("Thiếu biến môi trường! Kiểm tra lại file .env.")

DATABASE_URL = f"postgresql+asyncpg://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
