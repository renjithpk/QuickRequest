from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    resolved: Optional[bool] = None
