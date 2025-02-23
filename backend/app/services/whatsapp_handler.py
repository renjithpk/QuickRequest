from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.crud.tickets import create_ticket, list_tickets_by_status
from app.schemas.schemas import TicketCreate
from fastapi import HTTPException

def process_whatsapp_message(message: str, db: Session):
    """ Processes WhatsApp messages and returns responses """

    if message.lower().startswith("new ticket:"):
        details = message[11:].strip()  # Extract ticket details
        ticket_data = TicketCreate(
            title=details,
            description=details,
            category_id=1,
            subcategory_id=1,
            deadline=datetime.utcnow() + timedelta(hours=1),  # Can modify logic to extract deadlines from messages
        )
        new_ticket = create_ticket(db, ticket_data)  # Uses tickets.py
        return f"Ticket created with ID {new_ticket.id}"
    
    elif message.lower().startswith("status "):
        try:
            ticket_id = int(message.split()[1])
            tickets = list_tickets_by_status(db, ticket_id)  # Uses tickets.py
            if tickets:
                return f"Ticket {ticket_id} Status: {tickets[0].status}"
            return "Ticket not found."
        except ValueError:
            return "Invalid ticket ID."

    return "Invalid command. Use 'New Ticket: <description>' or 'Status <ID>'."
