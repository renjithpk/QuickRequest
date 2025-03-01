from sqlalchemy.orm import Session
from app.models.models import SubCategory
from app.schemas.schemas import SubCategoryCreate, SubCategoryUpdate

# Create a subcategory
def create_subcategory(db: Session, subcategory: SubCategoryCreate):
    new_subcategory = SubCategory(name=subcategory.name, category_id=subcategory.category_id)
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
    return new_subcategory

# List all subcategories
def list_subcategories(db: Session):
    return db.query(SubCategory).all()

# List subcategories by category
def list_subcategories_by_category(db: Session, category_id: int):
    return db.query(SubCategory).filter(SubCategory.category_id == category_id).all()

# Get a subcategory by ID
def get_subcategory_by_id(db: Session, subcategory_id: int):
    return db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()

# Update a subcategory
def update_subcategory(db: Session, subcategory_id: int, subcategory_data: SubCategoryUpdate):
    db_subcategory = get_subcategory_by_id(db, subcategory_id)
    if db_subcategory:
        for key, value in subcategory_data.dict(exclude_unset=True).items():
            setattr(db_subcategory, key, value)
        db.commit()
        db.refresh(db_subcategory)
    return db_subcategory

# Delete a subcategory
def delete_subcategory(db: Session, subcategory_id: int):
    db_subcategory = get_subcategory_by_id(db, subcategory_id)
    if db_subcategory:
        db.delete(db_subcategory)
        db.commit()
