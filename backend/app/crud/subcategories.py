from sqlalchemy.orm import Session
from app.models.models import SubCategory
from app.schemas.schemas import SubCategoryCreate

def create_subcategory(db: Session, subcategory: SubCategoryCreate):
    new_subcategory = SubCategory(name=subcategory.name, category_id=subcategory.category_id)
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
    return new_subcategory

def list_subcategories(db: Session):
    return db.query(SubCategory).all()
