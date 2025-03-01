from sqlalchemy.orm import Session
from app.models.models import Category
from app.schemas.schemas import CategoryCreate, CategoryUpdate

# Create a category
def create_category(db: Session, category: CategoryCreate):
    new_category = Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

# List all categories
def list_categories(db: Session):
    return db.query(Category).all()

# Get a category by name
def get_category(db: Session, name: str):
    return db.query(Category).filter(Category.name == name).first()

# Get a category by ID
def get_category_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

# Update a category
def update_category(db: Session, category_id: int, category_data: CategoryUpdate):
    db_category = get_category_by_id(db, category_id)
    if db_category:
        for key, value in category_data.dict(exclude_unset=True).items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

# Delete a category
def delete_category(db: Session, category_id: int):
    db_category = get_category_by_id(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
