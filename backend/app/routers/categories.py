from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import categories as crud
from app.schemas.schemas import CategoryCreate

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, category)

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return crud.list_categories(db)
