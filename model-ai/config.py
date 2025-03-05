import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings  

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), './'))
load_dotenv(os.path.join(BASE_DIR, '.env'))


class Settings(BaseSettings):
    # PROJECT_NAME = os.getenv('PROJECT_NAME', 'Model AI')
    # API_PREFIX = ''
    # BACKEND_CORS_ORIGINS = ['*']
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = os.getenv('PORT', '8000')


settings = Settings()