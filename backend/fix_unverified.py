"""
One-time script: verify all unverified users in the live DB
so they can log in without needing an OTP email.
Run once: python3 fix_unverified.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.models import SessionLocal, User

db = SessionLocal()

unverified = db.query(User).filter(User.is_verified == False).all()
print(f"Found {len(unverified)} unverified users:")
for u in unverified:
    print(f"  - {u.email} ({u.role})")
    u.is_verified = True
    u.otp_code = None
    u.otp_expiry = None

db.commit()
print(f"✅ All {len(unverified)} users are now verified.")
db.close()
