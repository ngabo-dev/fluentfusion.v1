"""
One-shot migration:
  1. Delete the student account ngabo470@gmail.com (and cascade its data)
  2. Create the super_admin account with the same email
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.models import SessionLocal, User, RoleEnum, StatusEnum
from app.auth import hash_password
from datetime import datetime
from sqlalchemy import text

db = SessionLocal()

# ── Step 0: add super_admin to the postgres enum if missing ──────────────
try:
    db.execute(text("ALTER TYPE roleenum ADD VALUE IF NOT EXISTS 'super_admin'"))
    db.commit()
    print("✅ roleenum updated with super_admin")
except Exception as e:
    db.rollback()
    print(f"ℹ️  roleenum already has super_admin or error: {e}")

# ── Step 1: drop the existing student account ────────────────────────────
existing = db.query(User).filter(User.email == "ngabo470@gmail.com").first()
if existing:
    print(f"Found user: {existing.name} | role={existing.role} | id={existing.id}")
    # Cascade-delete dependent rows manually (messages, enrollments, etc.)
    db.execute(text("DELETE FROM messages    WHERE sender_id   = :id OR receiver_id = :id"), {"id": existing.id})
    db.execute(text("DELETE FROM enrollments WHERE student_id  = :id"), {"id": existing.id})
    db.execute(text("DELETE FROM payments    WHERE user_id     = :id"), {"id": existing.id})
    db.execute(text("DELETE FROM reviews     WHERE student_id  = :id"), {"id": existing.id})
    db.execute(text("DELETE FROM audit_logs  WHERE admin_id    = :id"), {"id": existing.id})
    db.delete(existing)
    db.commit()
    print("✅ Deleted student account ngabo470@gmail.com")
else:
    print("ℹ️  No existing account found for ngabo470@gmail.com")

# ── Step 2: create super admin ───────────────────────────────────────────
super_admin = User(
    name="Jean Pierre Niyongabo",
    email="ngabo470@gmail.com",
    hashed_password=hash_password("superadmin123"),
    role=RoleEnum.super_admin,
    status=StatusEnum.active,
    avatar_initials="JP",
    is_verified=True,
    last_active=datetime.utcnow(),
    created_at=datetime.utcnow(),
)
db.add(super_admin)
db.commit()
db.refresh(super_admin)
print(f"✅ Super admin created: id={super_admin.id} | {super_admin.email} | role={super_admin.role}")
print()
print("Login credentials:")
print("  Email:    ngabo470@gmail.com")
print("  Password: superadmin123")
print("  Role:     super_admin  →  routes to /admin")

db.close()
