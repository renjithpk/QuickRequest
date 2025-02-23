import json
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Category, SubCategory
from app.services.message_builder import MessageBuilder

# Setup in-memory SQLite for testing
@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    TestingSessionLocal = sessionmaker(bind=engine)
    
    # Create tables
    Base.metadata.create_all(engine)
    
    session = TestingSessionLocal()
    
    # Populate categories and subcategories
    electricity = Category(name="Electricity")
    plumbing = Category(name="Plumbing")
    
    session.add_all([electricity, plumbing])
    session.commit()
    
    subcategories = [
        SubCategory(name="No Power", category_id=electricity.id),
        SubCategory(name="Voltage Issue", category_id=electricity.id),
        SubCategory(name="Leak", category_id=plumbing.id),
        SubCategory(name="Clogged Drain", category_id=plumbing.id),
    ]
    
    session.add_all(subcategories)
    session.commit()
    
    yield session  # Provide session for tests
    
    session.close()
    engine.dispose()

@pytest.fixture
def message_builder(db_session):
    return MessageBuilder(db_session)

def test_build_category_message(message_builder):
    number = "1234567890"
    result = message_builder.build_category_message(number)

    assert result["messaging_product"] == "whatsapp"
    assert result["recipient_type"] == "individual"
    assert result["to"] == number
    assert result["type"] == "interactive"
    assert result["interactive"]["type"] == "list"
    assert result["interactive"]["header"]["type"] == "text"
    assert "Please select a category:" in result["interactive"]["body"]["text"]
    assert result["interactive"]["footer"]["text"] == "Choose a category from the list below:"
    assert result["interactive"]["action"]["button"] == "Choose Category"
    
    sections = result["interactive"]["action"]["sections"]
    assert len(sections) == 1
    assert sections[0]["title"] == "Categories"
    
    rows = sections[0]["rows"]
    assert len(rows) == 2  # Since we added two categories
    expected_categories = ["Electricity", "Plumbing"]
    for category, row in zip(expected_categories, rows):
        assert row["title"] == category
        assert "Select this category" in row["description"]

def test_build_subcategory_message(message_builder):
    number = "1234567890"
    category = "Electricity"
    result = message_builder.build_subcategory_message(number, category)

    assert result["messaging_product"] == "whatsapp"
    assert result["recipient_type"] == "individual"
    assert result["to"] == number
    assert result["type"] == "interactive"
    assert result["interactive"]["type"] == "list"
    assert result["interactive"]["header"]["type"] == "text"
    assert f"Select a sub-category for {category}:" in result["interactive"]["body"]["text"]
    assert result["interactive"]["footer"]["text"] == "Choose a sub-category from the list below:"
    assert result["interactive"]["action"]["button"] == "Choose Sub-Category"
    
    sections = result["interactive"]["action"]["sections"]
    assert len(sections) == 1
    assert sections[0]["title"] == "Available Options"
    
    rows = sections[0]["rows"]
    assert len(rows) == 2  # Since we added two subcategories for Electricity
    expected_subcategories = ["No Power", "Voltage Issue"]
    for sub_category, row in zip(expected_subcategories, rows):
        assert row["title"] == sub_category
        assert "Select this sub-category" in row["description"]

def test_invalid_category_message(message_builder):
    number = "1234567890"
    invalid_category = "NonExistingCategory"
    result = json.loads(message_builder.build_subcategory_message(number, invalid_category))
    
    assert result["messaging_product"] == "whatsapp"
    assert result["to"] == number
    assert result["text"]["body"] == "Invalid category selected."
