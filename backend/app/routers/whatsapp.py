import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import os
import requests
from app.database import get_db
from app.config import Config
from app.services.whatsapp_handler import process_whatsapp_message  # Import from new module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import json


# Load sensitive information from environment variables
 
router = APIRouter()

# Webhook Verification (Meta requires this)
@router.get("/whatsapp/webhook")
def verify_whatsapp_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    print(Config.get("whatsapp_verify_token"))
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == Config.get("whatsapp_verify_token"):
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
    except (KeyError, IndexError):
        return {"status": "No valid message received"}

    # Process message using `tickets.py` methods
    response_message = process_whatsapp_message(message_data, db)
    # Send a response back
    send_whatsapp_message(response_message)
    
    return {"status": "Message processed"}

def send_whatsapp_message(payload):
    """Send a WhatsApp message via the WhatsApp Cloud API with error handling and logging."""
    headers = {
        "Authorization": f"Bearer {Config.get('whatsapp_access_token')}",
        "Content-Type": "application/json",
    }
    
    try:

        logger.info(f"Sending WhatsApp message: {payload}")
        response = requests.post(Config.get('whatsapp_api_url'), headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            logger.info(f"WhatsApp message sent successfully: {response.json()}")
            return response.json()
        else:
            logger.error(f"Failed to send WhatsApp message. Status: {response.status_code}, Response: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        logger.exception(f"Error sending WhatsApp message: {e}")
        return None
