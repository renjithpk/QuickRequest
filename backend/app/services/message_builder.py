import json
from sqlalchemy.orm import Session
from app.crud.categories import list_categories, get_category
from app.crud.subcategories import list_subcategories_by_category

class MessageBuilder:
    def __init__(self, db: Session):
        self.db = db

    def build_text_message(self, number, message):
        """Creates a normal text message."""
        return json.dumps({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {"body": message}
        }, indent=2)

    def build_category_message(self, number):
        """Creates an interactive list message for category selection."""
        categories = list_categories(self.db)

        return {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {"type": "text", "text": "Category Selection"},
                "body": {"text": "Please select a category:"},
                "footer": {"text": "Choose a category from the list below:"},
                "action": {
                    "button": "Choose Category",
                    "sections": [{
                        "title": "Categories",
                        "rows": [
                            {
                                "id": f"CAT_{category.id}",
                                "title": category.name,
                                "description": "Select this category"
                            }
                            for category in categories
                        ]
                    }]
                }
            }
        }

    def build_subcategory_message(self, number, category_name: str):
        """Creates an interactive list message for sub-category selection."""
        category = get_category(self.db, category_name).first()
        if not category:
            return self.build_text_message(number, "Invalid category selected.")

        sub_categories = list_subcategories_by_category(self.db, category.id)

        return {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {"type": "text", "text": f"Subcategories for {category.name}"},
                "body": {"text": f"Select a sub-category for {category.name}:"},
                "footer": {"text": "Choose a sub-category from the list below:"},
                "action": {
                    "button": "Choose Sub-Category",
                    "sections": [{
                        "title": "Available Options",
                        "rows": [
                            {
                                "id": f"SUB_{sub_category.id}",
                                "title": sub_category.name,
                                "description": "Select this sub-category"
                            }
                            for sub_category in sub_categories
                        ]
                    }]
                }
            }
        }
