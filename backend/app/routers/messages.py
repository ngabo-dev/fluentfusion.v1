import os, uuid, shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import get_db, User, Course, Enrollment, Message, RoleEnum
from app.auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/api/messages", tags=["messages"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME = {
    # images
    "image/jpeg": "image", "image/png": "image", "image/gif": "image",
    "image/webp": "image", "image/svg+xml": "image",
    # audio
    "audio/mpeg": "audio", "audio/mp4": "audio", "audio/ogg": "audio",
    "audio/wav": "audio", "audio/webm": "audio",
    # documents
    "application/pdf": "document",
    "application/msword": "document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
    "application/vnd.ms-excel": "document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
    "application/vnd.ms-powerpoint": "document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "document",
    "text/plain": "document", "text/csv": "document",
    "application/zip": "document", "application/x-zip-compressed": "document",
}

def _user_shape(u: User):
    return {"id": u.id, "name": u.name, "role": u.role, "avatar_initials": u.avatar_initials or u.name[:2].upper()}

def _msg_shape(m: Message):
    return {
        "id": m.id,
        "sender_id": m.sender_id,
        "content": m.content,
        "attachment_url": m.attachment_url,
        "attachment_type": m.attachment_type,
        "attachment_name": m.attachment_name,
        "is_read": m.is_read,
        "created_at": m.created_at,
    }

# ── file upload ───────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_attachment(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    mime = file.content_type or ""
    att_type = ALLOWED_MIME.get(mime)
    if not att_type:
        return {"ok": False, "error": f"File type '{mime}' not allowed"}

    ext = os.path.splitext(file.filename or "file")[1] or ""
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {
        "ok": True,
        "url": f"/uploads/{filename}",
        "attachment_type": att_type,
        "attachment_name": file.filename,
    }

# ── contacts / recipient search ───────────────────────────────────────────────

@router.get("/contacts")
def get_contacts(
    search: Optional[str] = None,
    role: Optional[str] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(User).filter(User.id != current_user.id)
    if current_user.role in (RoleEnum.student, RoleEnum.instructor):
        q = q.filter(User.role.in_([RoleEnum.student, RoleEnum.instructor]))
    if role:
        q = q.filter(User.role == role)
    if course_id:
        enrolled_ids = [e.student_id for e in db.query(Enrollment).filter(Enrollment.course_id == course_id).all()]
        q = q.filter(User.id.in_(enrolled_ids))
    if search:
        q = q.filter(or_(User.name.ilike(f"%{search}%"), User.email.ilike(f"%{search}%")))
    return [_user_shape(u) for u in q.order_by(User.name).limit(100).all()]


@router.get("/courses-list")
def get_courses_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == RoleEnum.instructor:
        courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    else:
        courses = db.query(Course).filter(Course.status == "published").all()
    return [{"id": c.id, "title": c.title, "flag_emoji": c.flag_emoji} for c in courses]


# ── threads ───────────────────────────────────────────────────────────────────

@router.get("/threads")
def get_threads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sent_to   = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct().all()
    recv_from = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct().all()
    peer_ids  = set([r for (r,) in sent_to] + [s for (s,) in recv_from])
    result = []
    for pid in peer_ids:
        peer = db.query(User).filter(User.id == pid).first()
        if not peer:
            continue
        last = db.query(Message).filter(
            or_(
                (Message.sender_id == current_user.id) & (Message.receiver_id == pid),
                (Message.sender_id == pid) & (Message.receiver_id == current_user.id),
            )
        ).order_by(Message.created_at.desc()).first()
        unread = db.query(Message).filter(
            Message.sender_id == pid,
            Message.receiver_id == current_user.id,
            Message.is_read == False,
        ).count()
        preview = last.content[:60] if last and last.content else (f"📎 {last.attachment_name or 'Attachment'}" if last else "")
        result.append({
            **_user_shape(peer),
            "last_message": preview,
            "last_at": last.created_at if last else None,
            "unread": unread,
        })
    result.sort(key=lambda x: x["last_at"] or "", reverse=True)
    return result


@router.get("/thread/{peer_id}")
def get_thread(
    peer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msgs = db.query(Message).filter(
        or_(
            (Message.sender_id == current_user.id) & (Message.receiver_id == peer_id),
            (Message.sender_id == peer_id) & (Message.receiver_id == current_user.id),
        )
    ).order_by(Message.created_at).all()
    db.query(Message).filter(
        Message.sender_id == peer_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return [_msg_shape(m) for m in msgs]


# ── send ──────────────────────────────────────────────────────────────────────

@router.post("/send")
def send_message(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    body: { content, recipient_ids, attachment_url?, attachment_type?, attachment_name? }
    """
    content         = (body.get("content") or "").strip()
    recipient_ids   = body.get("recipient_ids", [])
    attachment_url  = body.get("attachment_url")
    attachment_type = body.get("attachment_type")
    attachment_name = body.get("attachment_name")

    if not recipient_ids or (not content and not attachment_url):
        return {"ok": False, "error": "content or attachment and recipient_ids required"}

    for rid in recipient_ids:
        db.add(Message(
            sender_id=current_user.id,
            receiver_id=rid,
            content=content,
            attachment_url=attachment_url,
            attachment_type=attachment_type,
            attachment_name=attachment_name,
        ))
    db.commit()
    return {"ok": True, "sent_to": len(recipient_ids)}
