"""Meetings router — schedule, invite, WebSocket signaling for WebRTC"""
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import (
    get_db, User, Meeting, MeetingInvite, Notification,
    MeetingStatusEnum, MeetingAudienceEnum, RoleEnum, CourseStatusEnum
)
from app.auth import get_current_user
from app.email_utils import send_meeting_invite_email
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import secrets, json, os, asyncio
from collections import defaultdict

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ── WebSocket room manager ────────────────────────────────────────────────
class RoomManager:
    def __init__(self):
        # room_id -> list of (user_id, ws)
        self.rooms: dict[str, list[tuple[int, WebSocket]]] = defaultdict(list)

    async def join(self, room_id: str, user_id: int, ws: WebSocket):
        await ws.accept()
        self.rooms[room_id].append((user_id, ws))

    def leave(self, room_id: str, user_id: int, ws: WebSocket):
        self.rooms[room_id] = [(uid, w) for uid, w in self.rooms[room_id] if w is not ws]

    async def broadcast(self, room_id: str, sender_ws: WebSocket, data: dict):
        dead = []
        for uid, ws in self.rooms[room_id]:
            if ws is not sender_ws:
                try:
                    await ws.send_text(json.dumps(data))
                except Exception:
                    dead.append((uid, ws))
        for item in dead:
            self.rooms[room_id].remove(item)

    async def send_to(self, room_id: str, target_user_id: int, data: dict):
        for uid, ws in self.rooms[room_id]:
            if uid == target_user_id:
                try:
                    await ws.send_text(json.dumps(data))
                except Exception:
                    pass

    def peers(self, room_id: str, exclude_ws: WebSocket) -> list[int]:
        return [uid for uid, ws in self.rooms[room_id] if ws is not exclude_ws]

manager = RoomManager()


# ── Schemas ───────────────────────────────────────────────────────────────
class ScheduleRequest(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: str          # ISO string
    duration_min: int = 60
    audience: str = "individual"   # individual | course | all_students | all_instructors | everyone
    course_id: Optional[int] = None
    invite_user_ids: Optional[List[int]] = []  # for individual / manual picks


# ── Helpers ───────────────────────────────────────────────────────────────
def _resolve_invitees(body: ScheduleRequest, host: User, db: Session) -> list[User]:
    audience = body.audience
    if audience == "individual":
        if not body.invite_user_ids:
            return []
        return db.query(User).filter(User.id.in_(body.invite_user_ids)).all()
    if audience == "course":
        if not body.course_id:
            return []
        from app.models import Enrollment
        rows = db.query(Enrollment).filter(Enrollment.course_id == body.course_id).all()
        ids = [r.student_id for r in rows]
        return db.query(User).filter(User.id.in_(ids)).all()
    if audience == "all_students":
        return db.query(User).filter(User.role == RoleEnum.student).all()
    if audience == "all_instructors":
        return db.query(User).filter(User.role == RoleEnum.instructor).all()
    if audience == "everyone":
        return db.query(User).filter(User.id != host.id).all()
    return []


def _meeting_dict(m: Meeting, db: Session) -> dict:
    host = db.query(User).filter(User.id == m.host_id).first()
    invite_count = db.query(MeetingInvite).filter(MeetingInvite.meeting_id == m.id).count()
    return {
        "id": m.id,
        "title": m.title,
        "description": m.description,
        "host_id": m.host_id,
        "host_name": host.name if host else "Unknown",
        "host_initials": host.avatar_initials if host else "?",
        "course_id": m.course_id,
        "audience": m.audience,
        "scheduled_at": m.scheduled_at.isoformat(),
        "duration_min": m.duration_min,
        "status": m.status,
        "room_id": m.room_id,
        "invite_count": invite_count,
        "created_at": m.created_at.isoformat(),
    }


# ── Schedule a meeting ────────────────────────────────────────────────────
@router.post("")
def schedule_meeting(body: ScheduleRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        scheduled_at = datetime.fromisoformat(body.scheduled_at.replace("Z", "+00:00")).replace(tzinfo=None)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid scheduled_at format")

    room_id = secrets.token_urlsafe(12)
    meeting = Meeting(
        title=body.title,
        description=body.description,
        host_id=current_user.id,
        course_id=body.course_id,
        audience=MeetingAudienceEnum(body.audience),
        scheduled_at=scheduled_at,
        duration_min=body.duration_min,
        room_id=room_id,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    invitees = _resolve_invitees(body, current_user, db)
    join_url = f"{FRONTEND_URL}/meeting/{room_id}"
    scheduled_str = scheduled_at.strftime("%B %d, %Y at %H:%M UTC")

    for user in invitees:
        if user.id == current_user.id:
            continue
        invite = MeetingInvite(meeting_id=meeting.id, user_id=user.id)
        db.add(invite)
        # Platform notification
        notif = Notification(
            title=f"📅 Session Invite: {body.title}",
            message=f"{current_user.name} invited you to a session on {scheduled_str}",
            target=str(user.id),
            sent_at=datetime.utcnow(),
            recipients=1,
        )
        db.add(notif)

    db.commit()

    # Send emails async-style (fire and forget)
    for user in invitees:
        if user.id != current_user.id:
            send_meeting_invite_email(
                to=user.email,
                name=user.name,
                host_name=current_user.name,
                title=body.title,
                scheduled_at=scheduled_str,
                join_url=join_url,
            )

    return _meeting_dict(meeting, db)


# ── List meetings for current user ───────────────────────────────────────
@router.get("")
def list_meetings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Meetings hosted by user
    hosted = db.query(Meeting).filter(Meeting.host_id == current_user.id).all()
    # Meetings user is invited to
    invite_rows = db.query(MeetingInvite).filter(MeetingInvite.user_id == current_user.id).all()
    invited_ids = {i.meeting_id for i in invite_rows}
    invited = db.query(Meeting).filter(Meeting.id.in_(invited_ids)).all() if invited_ids else []

    seen = set()
    result = []
    for m in hosted + invited:
        if m.id not in seen:
            seen.add(m.id)
            d = _meeting_dict(m, db)
            d["is_host"] = m.host_id == current_user.id
            result.append(d)

    result.sort(key=lambda x: x["scheduled_at"], reverse=True)
    return result


# ── List users available to invite ───────────────────────────────────────
@router.get("/contacts/search")
def search_contacts(q: str = "", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(User).filter(User.id != current_user.id, User.is_verified == True)
    if q:
        query = query.filter(or_(User.name.ilike(f"%{q}%"), User.email.ilike(f"%{q}%")))
    users = query.limit(20).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "avatar_initials": u.avatar_initials} for u in users]


# ── Get single meeting ────────────────────────────────────────────────────
@router.get("/{room_id}")
def get_meeting(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = db.query(Meeting).filter(Meeting.room_id == room_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    # Check access
    is_host = m.host_id == current_user.id
    is_invited = db.query(MeetingInvite).filter(
        MeetingInvite.meeting_id == m.id,
        MeetingInvite.user_id == current_user.id
    ).first() is not None
    if not is_host and not is_invited:
        raise HTTPException(status_code=403, detail="Not invited to this meeting")
    d = _meeting_dict(m, db)
    d["is_host"] = is_host
    return d


# ── Start meeting (host only) ─────────────────────────────────────────────
@router.patch("/{room_id}/start")
def start_meeting(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = db.query(Meeting).filter(Meeting.room_id == room_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Not found")
    if m.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only host can start")
    m.status = MeetingStatusEnum.live
    db.commit()
    return {"status": "live"}


# ── End meeting (host only) ───────────────────────────────────────────────
@router.patch("/{room_id}/end")
def end_meeting(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = db.query(Meeting).filter(Meeting.room_id == room_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Not found")
    if m.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only host can end")
    m.status = MeetingStatusEnum.ended
    db.commit()
    return {"status": "ended"}


# ── Cancel meeting ────────────────────────────────────────────────────────
@router.delete("/{room_id}")
def cancel_meeting(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = db.query(Meeting).filter(Meeting.room_id == room_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Not found")
    if m.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only host can cancel")
    m.status = MeetingStatusEnum.cancelled
    db.commit()
    return {"status": "cancelled"}


# ── WebSocket signaling endpoint ──────────────────────────────────────────
@router.websocket("/ws/{room_id}/{user_id}")
async def meeting_ws(room_id: str, user_id: int, ws: WebSocket, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.room_id == room_id).first()
    if not meeting:
        await ws.close(code=4004)
        return

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        await ws.close(code=4001)
        return

    await manager.join(room_id, user_id, ws)

    # Notify existing peers that a new user joined
    peers = manager.peers(room_id, ws)
    await manager.broadcast(room_id, ws, {
        "type": "user-joined",
        "user_id": user_id,
        "name": user.name,
        "initials": user.avatar_initials,
        "peers": peers,
    })

    # Send current peer list to the new joiner
    await ws.send_text(json.dumps({
        "type": "room-info",
        "room_id": room_id,
        "user_id": user_id,
        "peers": peers,
    }))

    try:
        while True:
            raw = await ws.receive_text()
            data = json.loads(raw)
            msg_type = data.get("type")

            if msg_type in ("offer", "answer", "ice-candidate"):
                # WebRTC signaling — forward to specific peer
                target = data.get("target")
                if target:
                    await manager.send_to(room_id, target, {**data, "from": user_id})

            elif msg_type == "chat":
                # Broadcast chat message to everyone in room
                await manager.broadcast(room_id, ws, {
                    "type": "chat",
                    "from": user_id,
                    "name": user.name,
                    "initials": user.avatar_initials,
                    "text": data.get("text", ""),
                    "ts": datetime.utcnow().isoformat(),
                })

            elif msg_type == "media-state":
                # Broadcast mute/video toggle state
                await manager.broadcast(room_id, ws, {
                    "type": "media-state",
                    "from": user_id,
                    "audio": data.get("audio"),
                    "video": data.get("video"),
                })

            elif msg_type == "screen-share":
                await manager.broadcast(room_id, ws, {
                    "type": "screen-share",
                    "from": user_id,
                    "active": data.get("active"),
                })

            elif msg_type == "end-meeting":
                await manager.broadcast(room_id, ws, {"type": "meeting-ended"})

    except WebSocketDisconnect:
        manager.leave(room_id, user_id, ws)
        await manager.broadcast(room_id, ws, {
            "type": "user-left",
            "user_id": user_id,
            "name": user.name,
        })
