from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import subcategories as crud
from app.schemas.schemas import SubCategoryCreate, SubCategoryUpdate, SubCategory  # Import the new schema

router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

# Create a subcategory
@router.post("/", response_model=SubCategory)
def create_subcategory(subcategory: SubCategoryCreate, db: Session = Depends(get_db)):
    return crud.create_subcategory(db, subcategory)

# Get a subcategory by ID
@router.get("/{subcategory_id}", response_model=SubCategory)
def get_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    subcategory = crud.get_subcategory_by_id(db, subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return subcategory

# List all subcategories
@router.get("/", response_model=list[SubCategory])
def list_subcategories(db: Session = Depends(get_db)):
    return crud.list_subcategories(db)

# Update a subcategory
@router.put("/{subcategory_id}", response_model=SubCategory)
def update_subcategory(subcategory_id: int, subcategory: SubCategoryUpdate, db: Session = Depends(get_db)):
    existing_subcategory = crud.get_subcategory_by_id(db, subcategory_id)
    if not existing_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return crud.update_subcategory(db, subcategory_id, subcategory)

# Delete a subcategory
@router.delete("/{subcategory_id}")
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    existing_subcategory = crud.get_subcategory_by_id(db, subcategory_id)
    if not existing_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    crud.delete_subcategory(db, subcategory_id)
    return {"detail": "Subcategory deleted successfully"}
