from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy.sql import and_
from app.database import get_db
from app.crud import tickets as crud
from app.schemas.schemas import TicketCreate, TicketUpdate

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket)

@router.get("/")
def list_tickets(db: Session = Depends(get_db)):
    return crud.list_tickets(db)

@router.get("/status/{status}")
def list_tickets_by_status(status: str, db: Session = Depends(get_db)):
    return crud.list_tickets_by_status(db, status)

@router.get("/overdue/")
def list_overdue_tickets(db: Session = Depends(get_db)):
    return crud.list_overdue_tickets(db)

@router.put("/{ticket_id}")
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    return crud.update_ticket(db, ticket_id, ticket_update)

@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return crud.delete_ticket(db, ticket_id)
