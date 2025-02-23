from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy.sql import and_
from fastapi import HTTPException
from app.models.models import Ticket
from app.schemas.schemas import TicketCreate, TicketUpdate

def create_ticket(db: Session, ticket: TicketCreate):
    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        category_id=ticket.category_id,
        subcategory_id=ticket.subcategory_id,
        deadline=ticket.deadline,
        status="open",
        resolved=False
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

def list_tickets(db: Session):
    return db.query(Ticket).all()

def list_tickets_by_status(db: Session, status: str):
    return db.query(Ticket).filter(Ticket.status == status).all()

def list_overdue_tickets(db: Session):
    now = datetime.utcnow()
    return db.query(Ticket).filter(and_(Ticket.deadline < now, Ticket.resolved.is_(False))).all()

def update_ticket(db: Session, ticket_id: int, ticket_update: TicketUpdate):
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

def delete_ticket(db: Session, ticket_id: int):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"detail": "Ticket deleted"}
