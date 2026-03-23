"""Shared helper — fire a system notification (notif_type='notification')."""
from app.models import Notification
from sqlalchemy.orm import Session


def notify(db: Session, *, title: str, message: str, target: str, link: str | None = None, course_id: int | None = None):
    """
    target examples:
      str(user_id)   — single user
      "admins"       — all admins / super_admins
      "students"     — all students
      "instructors"  — all instructors
      "all"          — everyone
    """
    n = Notification(
        title=title,
        message=message,
        target=target,
        link=link,
        course_id=course_id,
        notif_type="notification",
    )
    db.add(n)
    # caller must db.commit() after
