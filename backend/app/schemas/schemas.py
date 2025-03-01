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

# Create category schema
class CategoryCreate(BaseModel):
    name: str

# Update category schema
class CategoryUpdate(BaseModel):
    name: Optional[str] = None  # Optional for partial updates

# Ticket schema
class TicketCreate(BaseModel):
    title: str
    description: str
    category_id: int
    subcategory_id: int
    deadline: datetime

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    resolved: Optional[bool] = None
