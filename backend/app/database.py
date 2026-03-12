import os
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from .config import settings

# Path to Aiven CA certificate for SSL verification
_ca_cert = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ca.pem")

# Create engine with SSL for Aiven PostgreSQL (20-connection limit)
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_pre_ping=True,
    pool_size=8,
    max_overflow=7,
    pool_timeout=30,
    pool_recycle=1800,
    connect_args={"sslmode": "require", "sslrootcert": _ca_cert}
)

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()

# Dependency to get DB session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()