from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.crud.tickets import create_ticket, list_tickets_by_status
from app.schemas.schemas import TicketCreate
from app.services.message_builder import MessageBuilder
from fastapi import HTTPException
import json

def process_whatsapp_message(message_data: dict, db: Session):
    """Processes WhatsApp messages and responds accordingly"""
    print("Received message data")
    
    parsed_message = parse_message(message_data)
    
    # Log parsed message
    print(f"Parsed Message: {parsed_message}")
    
    phone_number = parsed_message.get("phone_number")
    message_type = parsed_message.get("type")
    message_text = parsed_message.get("message")

    message_builder = MessageBuilder(db)

    if message_text.lower() == "help":
        response_message = message_builder.build_category_message(phone_number)
        return response_message
    
    elif message_type == "category":
        response_message = message_builder.build_subcategory_message(phone_number, message_text)
        return response_message
    
    else:
        print("No action required for this message.")
    # if message.lower().startswith("new ticket:"):
    #     details = message[11:].strip()  # Extract ticket details
    #     ticket_data = TicketCreate(
    #         title=details,
    #         description=details,
    #         category_id=1,
    #         subcategory_id=1,
    #         deadline=datetime.utcnow() + timedelta(hours=1),  # Can modify logic to extract deadlines from messages
    #     )
    #     new_ticket = create_ticket(db, ticket_data)  # Uses tickets.py
    #     return f"Ticket created with ID {new_ticket.id}"
    
    # elif message.lower().startswith("status "):
    #     try:
    #         ticket_id = int(message.split()[1])
    #         tickets = list_tickets_by_status(db, ticket_id)  # Uses tickets.py
    #         if tickets:
    #             return f"Ticket {ticket_id} Status: {tickets[0].status}"
    #         return "Ticket not found."
    #     except ValueError:
    #         return "Invalid ticket ID."

    # return "Invalid command. Use 'New Ticket: <description>' or 'Status <ID>'."


def parse_message(message_data):
    """
    Parses incoming WhatsApp webhook data to identify message type and extract relevant details.

    Args:
        message_data (dict): The JSON payload from WhatsApp webhook.

    Returns:
        dict: A dictionary containing:
            - "type": "category", "sub_category", or "message"
            - "phone_number": Sender's phone number
            - "message": Text content (if applicable)
    """
    try:
        phone_number = message_data.get("from")

        # Check for interactive list reply
        if message_data.get("type") == "interactive":
            interactive_data = message_data.get("interactive", {})
            if interactive_data.get("type") == "list_reply":
                list_reply_id = interactive_data["list_reply"]["id"]
                if list_reply_id.startswith("CAT_"):
                    return {"type": "category", "phone_number": phone_number, "message": list_reply_id[4:]}
                elif list_reply_id.startswith("SUB_"):
                    return {"type": "sub_category", "phone_number": phone_number, "message": list_reply_id[4:]}
                else:
                    return {"type": "message", "phone_number": phone_number, "message": list_reply_id}

        # Check for normal text message
        elif message_data.get("type") == "text":
            text_body = message_data["text"]["body"]
            return {"type": "message", "phone_number": phone_number, "message": text_body}

        return {"error": "Unknown message format"}

    except (KeyError, IndexError, json.JSONDecodeError):
        return {"error": "Invalid webhook data"}
