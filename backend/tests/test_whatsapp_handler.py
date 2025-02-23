import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.services.whatsapp_handler import process_whatsapp_message
from app.database import Base
from app.models.models import Ticket

# Setup a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"  # In-memory database for testing
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a new session for testing
@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)  # Create tables
    session = TestingSessionLocal()
    yield session  # Provide the session to the test
    session.close()
    Base.metadata.drop_all(bind=engine)  # Clean up after test

def test_create_ticket(db):
    """Test creating a new ticket via WhatsApp message"""
    message = "New Ticket: AC not working"
    response = process_whatsapp_message(message, db)

    # Verify response and ticket creation
    assert response.startswith("Ticket created with ID")
    ticket = db.query(Ticket).first()
    assert ticket is not None
    assert ticket.title == "AC not working"

def test_get_ticket_status_not_found(db):
    """Test checking the status of a non-existing ticket"""
    message = "Status 999"
    response = process_whatsapp_message(message, db)
    assert response == "Ticket not found."

def test_invalid_command(db):
    """Test invalid commands"""
    message = "Random text"
    response = process_whatsapp_message(message, db)
    assert response == "Invalid command. Use 'New Ticket: <description>' or 'Status <ID>'."
