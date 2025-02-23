from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import and_

from .database import get_db, engine
from .models.models import Category, SubCategory, Ticket
from .models.models import CategoryCreate, SubCategoryCreate, TicketCreate, TicketUpdate

# FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
from .database import Base
Base.metadata.create_all(bind=engine)

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
        deadline=ticket.deadline,
        status="open",  # Default status
        resolved=False
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
    return db.query(Ticket).filter(and_(Ticket.deadline < now, Ticket.resolved.is_(False))).all()

@app.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket_update.status is not None:
        ticket.status = ticket_update.status
    if ticket_update.resolved is not None:
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
