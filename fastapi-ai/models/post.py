from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import datetime
import uuid
import enum
from helpers.enum import PrivacyType

Base = declarative_base()



class Post(Base):
    __tablename__ = "post"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    content = Column(String, nullable=False)
    hashtags = Column(String, nullable=True)  
    medias = Column(String, nullable=True)  
    privacy = Column(Enum(PrivacyType), nullable=False, default=PrivacyType.PUBLIC)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    