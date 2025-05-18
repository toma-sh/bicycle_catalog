# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from .database.database import engine, get_db
from .database import models
from .routers import auth, users
from .utils.auth import get_password_hash

app = FastAPI(title="Katalog rowerów", description="Aplikacja do przeglądania modeli rowerów")

# Konfiguracja CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tworzenie tabeli w bazie danych
models.Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory="frontend/templates")

# Inicjalizacja danych (tylko dla celów demonstracyjnych)
def init_db(db: Session):
    # Sprawdź, czy już istnieją dane
    admin_user = db.query(models.User).filter(models.User.is_admin == True).first()
    if not admin_user:
        # Utwórz administratora
        admin = models.User(
            username="admin",
            email="admin@example.com",
            first_name="Admin",
            last_name="User",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        
        
        
        db.commit()

# Inicjalizacja danych przy starcie aplikacji
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    init_db(db)

# Dodanie routerów
app.include_router(auth.router)
app.include_router(users.router)


# Obsługa stron statycznych
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
app.mount("/", StaticFiles(directory="frontend/templates"), name="templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)