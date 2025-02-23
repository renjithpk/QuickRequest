from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database import Base
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Database Models
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    subcategories = relationship("SubCategory", back_populates="category")

class SubCategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="subcategories")

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))
    deadline = Column(DateTime, index=True)
    status = Column(String, index=True, default="open")
    resolved = Column(Boolean, index=True, default=False)

# Pydantic Models (Request Schemas)
class CategoryCreate(BaseModel):
    name: str

class SubCategoryCreate(BaseModel):
    name: str
    category_id: int

class TicketCreate(BaseModel):
    title: str
    description: str
    category_id: int
    subcategory_id: int
    deadline: datetime

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    resolved: Optional[bool] = None
