from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Database Setup
DATABASE_URL = "sqlite:///./support.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI instance
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this based on your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    subcategories = relationship("SubCategory", back_populates="category")

class SubCategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="subcategories")

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    deadline = Column(DateTime)
    category_id = Column(Integer, ForeignKey("categories.id"))
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))
    resolved = Column(Boolean, default=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models (Request Schemas)
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
    status: str
    resolved: bool

# Category Endpoints
@app.post("/categories/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    new_category = Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/categories/")
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

# SubCategory Endpoints
@app.post("/subcategories/")
def create_subcategory(subcategory: SubCategoryCreate, db: Session = Depends(get_db)):
    new_subcategory = SubCategory(name=subcategory.name, category_id=subcategory.category_id)
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
    return new_subcategory

@app.get("/subcategories/")
def list_subcategories(db: Session = Depends(get_db)):
    return db.query(SubCategory).all()

# Ticket Endpoints
@app.post("/tickets/")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        category_id=ticket.category_id,
        subcategory_id=ticket.subcategory_id,
        deadline=ticket.deadline
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@app.get("/tickets/")
def list_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()

@app.get("/tickets/status/{status}")
def list_tickets_by_status(status: str, db: Session = Depends(get_db)):
    return db.query(Ticket).filter(Ticket.status == status).all()

@app.get("/tickets/overdue/")
def list_overdue_tickets(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    return db.query(Ticket).filter(Ticket.deadline < now, Ticket.resolved == False).all()

@app.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.status = ticket_update.status
    ticket.resolved = ticket_update.resolved
    db.commit()
    db.refresh(ticket)
    return ticket

@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"detail": "Ticket deleted"}
