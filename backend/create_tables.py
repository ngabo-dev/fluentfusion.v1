#!/usr/bin/env python3
"""
Create all database tables in Supabase.
Run this script after setting up the .env file with Supabase credentials.
"""

import sys
sys.path.insert(0, '.')

from app.database import Base, engine
from app.models import *  # Import all models

def create_tables():
    """Create all tables in the database."""
    print("Creating all tables...")
    
    # Import all model modules to ensure they're registered with Base
    from app.models import user, course, language, progress
    from app.models import announcement, assignment, certificate
    from app.models import community, message, meeting
    from app.models import notification, payment, practice
    from app.models import quiz, report, activity
    from app.models import gamification, live_session
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("All tables created successfully!")

if __name__ == "__main__":
    create_tables()
