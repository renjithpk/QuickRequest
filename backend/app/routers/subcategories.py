from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import subcategories as crud
from app.schemas.schemas import SubCategoryCreate

router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

@router.post("/")
def create_subcategory(subcategory: SubCategoryCreate, db: Session = Depends(get_db)):
    return crud.create_subcategory(db, subcategory)

@router.get("/")
def list_subcategories(db: Session = Depends(get_db)):
    return crud.list_subcategories(db)
