from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Job Board API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "helloUtsav123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    GOOGLE_CLIENT_ID: str = "799840615635-m21c2hiti7oln1s6aucroaa90bsd17dt.apps.googleusercontent.com" # Add your Google Client ID here
    
    DATABASE_URL: str = "postgresql://postgres:admin123@localhost:5432/job_board"
    
    class Config:
        case_sensitive = True

settings = Settings()
