from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy.sql import and_
from app.database import get_db
from app.crud import tickets as crud
from app.schemas.schemas import TicketCreate, TicketUpdate, Ticket  # Import Ticket schema

router = APIRouter(prefix="/tickets", tags=["Tickets"])

# Create a ticket
@router.post("/", response_model=Ticket)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket)

# Get a ticket by ID
@router.get("/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

# List all tickets
@router.get("/", response_model=list[Ticket])
def list_tickets(db: Session = Depends(get_db)):
    return crud.list_tickets(db)

# List tickets by status
@router.get("/status/{status}", response_model=list[Ticket])
def list_tickets_by_status(status: str, db: Session = Depends(get_db)):
    return crud.list_tickets_by_status(db, status)

# List overdue tickets
@router.get("/overdue/", response_model=list[Ticket])
def list_overdue_tickets(db: Session = Depends(get_db)):
    return crud.list_overdue_tickets(db)

# Update a ticket
@router.put("/{ticket_id}", response_model=Ticket)
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return crud.update_ticket(db, ticket_id, ticket_update)

# Delete a ticket
@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    crud.delete_ticket(db, ticket_id)
    return {"detail": "Ticket deleted successfully"}
