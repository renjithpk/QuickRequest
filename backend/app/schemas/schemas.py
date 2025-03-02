from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Create subcategory schema
class SubCategoryCreate(BaseModel):
    name: str
    category_id: int

# Update subcategory schema (new)
class SubCategoryUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None  # Optional for partial updates

# Schema for returning subcategory data
class SubCategory(BaseModel):
    id: int
    name: str
    category_id: int

    class Config:
        orm_mode = True  # Enables ORM mode for SQLAlchemy integration

# Create category schema
class CategoryCreate(BaseModel):
    name: str

# Update category schema
class CategoryUpdate(BaseModel):
    name: Optional[str] = None  # Optional for partial updates

# Schema for returning category data
class Category(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True  # Enables ORM mode for SQLAlchemy integration

# Ticket schema for creation
class TicketCreate(BaseModel):
    title: str
    description: str
    category_id: int
    subcategory_id: int
    deadline: datetime

# Ticket schema for updates
class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    resolved: Optional[bool] = None

# Schema for returning ticket data
class Ticket(BaseModel):
    id: int
    title: str
    description: str
    category_id: int
    subcategory_id: int
    deadline: datetime
    status: Optional[str] = None
    resolved: Optional[bool] = None

    class Config:
        orm_mode = True  # Enables ORM mode for SQLAlchemy integration
