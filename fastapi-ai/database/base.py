from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from core.settings import settings

# Get info database from settings
DATABASE_HOST = settings.DATABASE_HOST
DATABASE_PORT = settings.DATABASE_PORT
DATABASE_USERNAME = settings.DATABASE_USERNAME
DATABASE_PASSWORD = settings.DATABASE_PASSWORD
DATABASE_NAME = settings.DATABASE_NAME

DATABASE_URL = f"postgresql+asyncpg://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
