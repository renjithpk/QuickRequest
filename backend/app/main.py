from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import categories, subcategories, tickets
from app.routers.whatsapp import router as whatsapp_router
from app.config import Config

# FastAPI instance
app = FastAPI()

Config.initialize("config/settings.yaml", lambda: print("Config updated!"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(categories.router)
app.include_router(subcategories.router)
app.include_router(tickets.router)
app.include_router(whatsapp_router)