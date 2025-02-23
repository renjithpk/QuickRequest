from sqlalchemy.orm import Session
from app.models.models import Category
from app.schemas.schemas import CategoryCreate

def create_category(db: Session, category: CategoryCreate):
    new_category = Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def list_categories(db: Session):
    return db.query(Category).all()
