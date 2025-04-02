from helpers.gender_type import GenderType
from helpers.role_type import RoleType
from helpers.privacy_type import PrivacyType
from sqlalchemy import Column, String, DateTime, Integer, Enum
from sqlalchemy.ext.declarative import declarative_base
import datetime
import uuid

Base = declarative_base()

class User(Base):
  __tablename__ = "user"

  id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
  email = Column(String, nullable=False, unique=True)
  password = Column(String, nullable=False)
  avatar = Column(String, nullable=True)
  username = Column(String, nullable=False, unique=True)
  bio = Column(String, nullable=True)
  birthday = Column(DateTime, nullable=True)
  website = Column(String, nullable=True)
  gender = Column(Enum(GenderType), nullable=True)
  address = Column(String, nullable=True)
  company = Column(String, nullable=True)
  education = Column(String, nullable=True)
  last_active = Column(DateTime, nullable=True)
  user_category = Column(Integer, nullable=True)
  role = Column(Enum(RoleType), nullable=False, default=RoleType.USER)
  privacy = Column(Enum(PrivacyType), nullable=False, default=PrivacyType.PUBLIC)
  created_at = Column(DateTime, default=datetime.datetime.utcnow, oncreate=datetime.datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)