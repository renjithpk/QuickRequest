from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import os
import requests
from app.database import get_db
from app.services.whatsapp_handler import process_whatsapp_message  # Import from new module


# Load sensitive information from environment variables
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "default_verification_token")
WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "default_access_token")
WHATSAPP_PHONE_ID = os.getenv("WHATSAPP_PHONE_ID", "your_phone_number_id")
WHATSAPP_API_URL = f"https://graph.facebook.com/v18.0/{WHATSAPP_PHONE_ID}/messages"

router = APIRouter()

# Webhook Verification (Meta requires this)
@router.get("/whatsapp/webhook")
def verify_whatsapp_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    print(WHATSAPP_VERIFY_TOKEN)
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == WHATSAPP_VERIFY_TOKEN:
        return int(challenge)  # Meta requires this response
    raise HTTPException(status_code=403, detail="Verification failed")

# Handle incoming WhatsApp messages
@router.post("/whatsapp/webhook")
async def receive_whatsapp_message(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Extract message details
    try:
        entry = data["entry"][0]
        changes = entry["changes"][0]
        message_data = changes["value"]["messages"][0]
        sender_id = message_data["from"]
        message_text = message_data["text"]["body"]
    except (KeyError, IndexError):
        return {"status": "No valid message received"}

    # Process message using `tickets.py` methods
    response_text = process_whatsapp_message(message_text, db)

    # Send a response back
    send_whatsapp_message(sender_id, response_text)
    
    return {"status": "Message processed"}

def send_whatsapp_message(to: str, message: str):
    """ Send a WhatsApp message via the WhatsApp Cloud API """
    headers = {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": message},
    }
    requests.post(WHATSAPP_API_URL, headers=headers, json=payload)
