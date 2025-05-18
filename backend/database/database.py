# backend/database/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..config import settings

# Tworzymy silnik bazy danych
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Tworzymy SessionLocal klasę
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tworzymy instancję bazową
Base = declarative_base()

# Funkcja pomocnicza do uzyskania sesji bazy danych
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()