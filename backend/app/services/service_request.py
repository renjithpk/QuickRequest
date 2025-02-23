class UserServiceRequest:
    STATE_NEW_TICKET = "NEW_TICKET_INITIATED"
    STATE_CATEGORY_SELECTED = "CATEGORY_SELECTED"
    STATE_SUB_CATEGORY_SELECTED = "SUB_CATEGORY_SELECTED"
    STATE_DETAILS_PROVIDED = "DETAILS_PROVIDED"
    STATE_TICKET_CREATED = "TICKET_CREATED"

    def __init__(self, phone_number):
        self.phone_number = phone_number
        self.state = self.STATE_NEW_TICKET
        self.category = None
        self.sub_category = None
        self.details = None
        self.ticket_id = None  # Will be assigned when ticket is created

    def set_category(self, category):
        self.category = category
        self.state = self.STATE_CATEGORY_SELECTED

    def set_sub_category(self, sub_category):
        self.sub_category = sub_category
        self.state = self.STATE_SUB_CATEGORY_SELECTED

    def set_details(self, details):
        self.details = details
        self.state = self.STATE_DETAILS_PROVIDED

    def create_ticket(self, ticket_id):
        self.ticket_id = ticket_id
        self.state = self.STATE_TICKET_CREATED

    def __repr__(self):
        return (f"UserServiceRequest(phone={self.phone_number}, state={self.state}, "
                f"category={self.category}, sub_category={self.sub_category}, details={self.details}, "
                f"ticket_id={self.ticket_id})")
