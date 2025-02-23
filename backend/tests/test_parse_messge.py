import pytest
from app.services.whatsapp_handler import parse_message  # Replace 'your_module' with the actual module name

def test_parse_message_text():
    """Test normal text message parsing"""
    message_data = {
        "from": "16315551234",
        "type": "text",
        "text": {"body": "Hello!"}
    }
    expected = {"type": "message", "phone_number": "16315551234", "message": "Hello!"}
    assert parse_message(message_data) == expected

def test_parse_message_category():
    """Test interactive list reply for category selection"""
    message_data = {
        "from": "16505551234",
        "type": "interactive",
        "interactive": {
            "type": "list_reply",
            "list_reply": {
                "id": "CAT_Electricity",
                "title": "Electricity Issue",
                "description": "Report electricity problems"
            }
        }
    }
    expected = {"type": "category", "phone_number": "16505551234", "message": "Electricity"}
    assert parse_message(message_data) == expected

def test_parse_message_sub_category():
    """Test interactive list reply for sub-category selection"""
    message_data = {
        "from": "16505551234",
        "type": "interactive",
        "interactive": {
            "type": "list_reply",
            "list_reply": {
                "id": "SUB_NoPower",
                "title": "No Power",
                "description": "Report power outage"
            }
        }
    }
    expected = {"type": "sub_category", "phone_number": "16505551234", "message": "NoPower"}
    assert parse_message(message_data) == expected

def test_parse_message_generic_interactive():
    """Test interactive list reply with generic ID"""
    message_data = {
        "from": "16505551234",
        "type": "interactive",
        "interactive": {
            "type": "list_reply",
            "list_reply": {
                "id": "priority_express",
                "title": "Priority Mail Express",
                "description": "Next Day to 2 Days"
            }
        }
    }
    expected = {"type": "message", "phone_number": "16505551234", "message": "priority_express"}
    assert parse_message(message_data) == expected

def test_parse_message_unknown_type():
    """Test unknown message type handling"""
    message_data = {
        "from": "16315551234",
        "type": "unknown"
    }
    expected = {"error": "Unknown message format"}
    assert parse_message(message_data) == expected

def test_parse_message_missing_fields():
    """Test handling of missing fields in webhook data"""
    message_data = {}
    expected = {"error": "Unknown message format"}
    assert parse_message(message_data) == expected
