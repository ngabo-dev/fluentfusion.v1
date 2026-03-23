from app.models import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE notifications ADD COLUMN notif_type VARCHAR DEFAULT 'announcement'"))
        print("Added notif_type")
    except Exception as e:
        print(f"notif_type already exists: {e}")
    try:
        conn.execute(text("ALTER TABLE notifications ADD COLUMN link VARCHAR"))
        print("Added link")
    except Exception as e:
        print(f"link already exists: {e}")
    conn.commit()
    print("Done")
