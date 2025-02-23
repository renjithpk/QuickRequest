import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from fastapi.testclient import TestClient

# Create a new test database
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
SQLALCHEMY_DATABASE_URL = f"sqlite:///{BASE_DIR}/test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override to use a test database session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Pytest fixture to set up and tear down the database
@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# Test case for creating a ticket
def test_create_ticket(setup_database):
    # First, create a category and subcategory
    category_response = client.post("/categories/", json={"name": "Support"})
    category_id = category_response.json()["id"]

    subcategory_response = client.post("/subcategories/", json={"name": "Network", "category_id": category_id})
    subcategory_id = subcategory_response.json()["id"]

    # Now, create a ticket
    ticket_data = {
        "title": "Internet Issue",
        "description": "WiFi is not working",
        "category_id": category_id,
        "subcategory_id": subcategory_id,
        "deadline": "2025-03-01T12:00:00"
    }
    response = client.post("/tickets/", json=ticket_data)
    
    assert response.status_code == 200
    created_ticket = response.json()
    assert created_ticket["title"] == "Internet Issue"
    assert created_ticket["description"] == "WiFi is not working"
    assert created_ticket["category_id"] == category_id
    assert created_ticket["subcategory_id"] == subcategory_id


# Test case for listing all tickets
def test_list_tickets(setup_database):
    response = client.get("/tickets/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# Test case for updating a ticket
def test_update_ticket(setup_database):
    # Create a category, subcategory, and ticket
    category_response = client.post("/categories/", json={"name": "Electrical"})
    category_id = category_response.json()["id"]

    subcategory_response = client.post("/subcategories/", json={"name": "Wiring", "category_id": category_id})
    subcategory_id = subcategory_response.json()["id"]

    ticket_data = {
        "title": "Bulb not working",
        "description": "The light bulb in the hallway is broken",
        "category_id": category_id,
        "subcategory_id": subcategory_id,
        "deadline": "2025-03-05T10:00:00"
    }
    create_response = client.post("/tickets/", json=ticket_data)
    ticket_id = create_response.json()["id"]

    # Update ticket status
    update_data = {"status": "Resolved", "resolved": True}
    update_response = client.put(f"/tickets/{ticket_id}", json=update_data)

    assert update_response.status_code == 200
    updated_ticket = update_response.json()
    assert updated_ticket["status"] == "Resolved"
    assert updated_ticket["resolved"] is True


# Test case for deleting a ticket
def test_delete_ticket(setup_database):
    # Create a category, subcategory, and ticket
    category_response = client.post("/categories/", json={"name": "Plumbing"})
    category_id = category_response.json()["id"]

    subcategory_response = client.post("/subcategories/", json={"name": "Leaking Pipe", "category_id": category_id})
    subcategory_id = subcategory_response.json()["id"]

    ticket_data = {
        "title": "Pipe Leakage",
        "description": "Water is leaking from the kitchen sink",
        "category_id": category_id,
        "subcategory_id": subcategory_id,
        "deadline": "2025-03-10T09:00:00"
    }
    create_response = client.post("/tickets/", json=ticket_data)
    ticket_id = create_response.json()["id"]

    # Delete the ticket
    delete_response = client.delete(f"/tickets/{ticket_id}")
    
    assert delete_response.status_code == 200
    assert delete_response.json() == {"detail": "Ticket deleted"}

    # Verify ticket no longer exists
    get_response = client.get("/tickets/")
    tickets = get_response.json()
    assert not any(ticket["id"] == ticket_id for ticket in tickets)
