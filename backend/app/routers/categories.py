from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import categories as crud
from app.schemas.schemas import Category, CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["Categories"])

# Create a category
@router.post("/", response_model=Category, status_code=201)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, category)

# Get a category by ID
@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = crud.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# List all categories
@router.get("/", response_model=list[Category])
def list_categories(db: Session = Depends(get_db)):
    return crud.list_categories(db)

# Update a category
@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    existing_category = crud.get_category_by_id(db, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return crud.update_category(db, category_id, category)

# Delete a category
@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    existing_category = crud.get_category_by_id(db, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    crud.delete_category(db, category_id)
    return
