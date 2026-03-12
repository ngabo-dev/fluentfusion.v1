"""
LiveKit live-session endpoints for FluentFusion.

Endpoints
---------
GET  /api/v1/session/token         – Return a signed LiveKit JWT for a room.
POST /api/v1/session/create        – Create & store a session record.
GET  /api/v1/session/list          – List upcoming / available sessions.
POST /api/v1/session/record/start  – Start an Egress recording to S3.
POST /api/v1/session/record/stop   – Stop a running Egress recording.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...config import settings
from ...database import get_db
from ...dependencies import require_instructor
from ...models.language import Language
from ...models.live_session import LiveSession, LiveSessionRegistration
from ...models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/session", tags=["Session (LiveKit)"])


# ---------------------------------------------------------------------------
# Helper — build a LiveKit access token
# ---------------------------------------------------------------------------

def _build_livekit_token(
    room_name: str,
    identity: str,
    display_name: str,
    is_host: bool = False,
) -> str:
    """Return a signed JWT for the given room and participant."""
    if not settings.LIVEKIT_API_KEY or not settings.LIVEKIT_API_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LiveKit credentials are not configured on this server.",
        )

    # Use livekit.api for proper token generation
    try:
        from livekit import api
        
        token = api.AccessToken(
            settings.LIVEKIT_API_KEY,
            settings.LIVEKIT_API_SECRET,
            identity=identity,
            name=display_name,
        )
        
        # Add video grants
        token.add_grant(
            room=room_name,
            join=True,
            publish=is_host,
            subscribe=True,
            admin=is_host,
        )
        
        # Set token expiry
        token.valid_for = 3600  # 1 hour
        
        return token.to_jwt()
        
    except ImportError:
        # Fallback to manual JWT generation if livekit package not available
        import jwt
        import time
        
        now = int(time.time())
        claims = {
            "sub": identity,
            "name": display_name,
            "iss": settings.LIVEKIT_API_KEY,
            "exp": now + 3600,
            "nbf": now - 60,
            "video": {
                "room": room_name,
                "join": True,
                "admin": is_host,
                "publish": True,
                "subscribe": True,
                "publishData": True,
                "record": is_host,
            },
        }
        
        token = jwt.encode(
            claims,
            settings.LIVEKIT_API_SECRET,
            algorithm="HS256"
        )
        return token


# ---------------------------------------------------------------------------
# GET /api/v1/session/token
# ---------------------------------------------------------------------------

@router.get("/token", summary="Get a LiveKit room token")
async def get_session_token(
    room_name: str = Query(..., description="LiveKit room name"),
    username: str = Query(..., description="Participant username / identity"),
    role: str = Query("student", description="'teacher' to get host grants"),
):
    """
    Return a signed LiveKit JWT.

    The frontend calls this on page load to obtain the token needed to
    connect to the LiveKit room.  Pass ``role=teacher`` to receive
    ``room_admin`` / ``room_record`` grants.
    """
    is_host = role.lower() in ("teacher", "host", "instructor")

    token = _build_livekit_token(
        room_name=room_name,
        identity=username,
        display_name=username,
        is_host=is_host,
    )

    return {
        "token": token,
        "livekit_url": settings.LIVEKIT_URL,
        "room_name": room_name,
        "identity": username,
        "role": "teacher" if is_host else "student",
    }


# ---------------------------------------------------------------------------
# POST /api/v1/session/create
# ---------------------------------------------------------------------------

class SessionCreate(BaseModel):
    room_name: Optional[str] = None          # auto-generated when omitted
    title: str
    description: Optional[str] = None
    language_id: int
    level: Optional[str] = None              # beginner | intermediate | advanced
    scheduled_at: str                        # ISO-8601 string
    duration_minutes: int = 60
    max_participants: int = 100


@router.post("/create", summary="Create a live session", status_code=status.HTTP_201_CREATED)
async def create_session(
    data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """
    Create and persist a new live session.

    Only instructors (or admins) may create sessions.  A unique
    ``room_name`` is generated automatically when one is not supplied.
    """
    language = db.query(Language).filter(Language.id == data.language_id).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")

    room_name = data.room_name or f"ff-{uuid.uuid4().hex[:12]}"

    # Ensure room_name is unique
    existing = db.query(LiveSession).filter(LiveSession.room_name == room_name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Room name already in use")

    scheduled = datetime.fromisoformat(data.scheduled_at.replace("Z", "+00:00"))

    session = LiveSession(
        instructor_id=current_user.id,
        language_id=data.language_id,
        title=data.title,
        description=data.description,
        level=data.level,
        scheduled_at=scheduled,
        duration_min=data.duration_minutes,
        max_participants=data.max_participants,
        room_name=room_name,
        status="scheduled",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "message": "Session created",
        "session": {
            "id": session.id,
            "title": session.title,
            "room_name": session.room_name,
            "language_id": session.language_id,
            "level": session.level,
            "scheduled_at": session.scheduled_at.isoformat(),
            "duration_minutes": session.duration_min,
            "max_participants": session.max_participants,
            "status": session.status,
        },
    }


# ---------------------------------------------------------------------------
# GET /api/v1/session/list
# ---------------------------------------------------------------------------

@router.get("/list", summary="List upcoming / available sessions")
async def list_sessions(
    language_id: Optional[int] = None,
    level: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Return paginated upcoming (and live) sessions.

    Filters by ``language_id`` and/or ``level`` when supplied.
    """
    try:
        query = db.query(LiveSession).filter(
            LiveSession.status.in_(["scheduled", "live"])
        )

        if language_id:
            query = query.filter(LiveSession.language_id == language_id)
        if level:
            query = query.filter(LiveSession.level == level)

        total = query.count()
        sessions = (
            query.order_by(LiveSession.scheduled_at)
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        results = []
        for s in sessions:
            instructor = db.query(User).filter(User.id == s.instructor_id).first()
            reg_count = (
                db.query(LiveSessionRegistration)
                .filter(LiveSessionRegistration.session_id == s.id)
                .count()
            )
            lang = db.query(Language).filter(Language.id == s.language_id).first()

            results.append(
                {
                    "id": s.id,
                    "title": s.title,
                    "description": s.description,
                    "room_name": s.room_name,
                    "language_id": s.language_id,
                    "language_name": lang.name if lang else "Unknown",
                    "level": s.level,
                    "instructor_id": s.instructor_id,
                    "instructor_name": instructor.full_name if instructor else "Instructor",
                    "instructor_avatar": instructor.avatar_url if instructor else None,
                    "scheduled_at": s.scheduled_at.isoformat() if s.scheduled_at else None,
                    "duration_minutes": s.duration_min,
                    "max_participants": s.max_participants,
                    "enrolled_count": reg_count,
                    "status": s.status,
                    "is_live": s.status == "live",
                }
            )

        return {
            "sessions": results,
            "total": total,
            "page": page,
            "total_pages": (total + limit - 1) // limit,
        }
    except Exception as e:
        logger.error(f"Error listing sessions: {e}", exc_info=True)
        # Return empty list instead of error if table doesn't exist
        return {
            "sessions": [],
            "total": 0,
            "page": page,
            "total_pages": 0,
        }


# ---------------------------------------------------------------------------
# POST /api/v1/session/record/start
# ---------------------------------------------------------------------------

class RecordStartRequest(BaseModel):
    session_id: int


@router.post("/record/start", summary="Start Egress recording to S3")
async def start_recording(
    body: RecordStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """
    Start a LiveKit Egress room-composite recording and save to S3.

    Only the session's instructor (or admin) may call this endpoint.
    The ``egress_id`` is stored on the session record so the recording
    can be stopped later.
    """
    session = db.query(LiveSession).filter(LiveSession.id == body.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.instructor_id != current_user.id and current_user.role not in (
        "admin",
        "super_admin",
    ):
        raise HTTPException(status_code=403, detail="Not authorised to record this session")

    if session.status not in ("live", "scheduled"):
        raise HTTPException(
            status_code=400, detail="Session must be live or scheduled to record"
        )

    if session.egress_id:
        raise HTTPException(status_code=409, detail="Recording already in progress")

    if not settings.LIVEKIT_API_KEY or not settings.LIVEKIT_API_SECRET:
        raise HTTPException(
            status_code=503, detail="LiveKit credentials are not configured"
        )

    if not settings.AWS_S3_BUCKET:
        raise HTTPException(
            status_code=503, detail="S3 bucket is not configured for recordings"
        )

    try:
        from livekit.api import LiveKitAPI
        from livekit.protocol.egress import (
            EncodedFileOutput,
            RoomCompositeEgressRequest,
            S3Upload,
        )

        room_name = session.room_name or str(session.id)
        output_key = f"recordings/{room_name}/{uuid.uuid4().hex}.mp4"

        s3_upload = S3Upload(
            access_key=settings.AWS_ACCESS_KEY_ID,
            secret=settings.AWS_SECRET_ACCESS_KEY,
            region=settings.AWS_REGION,
            bucket=settings.AWS_S3_BUCKET,
        )

        file_output = EncodedFileOutput(
            filepath=output_key,
            s3=s3_upload,
        )

        egress_request = RoomCompositeEgressRequest(
            room_name=room_name,
            layout="speaker",
            file=file_output,
        )

        # Start recording via LiveKit Egress (async call within async endpoint)
        async with LiveKitAPI(
            url=settings.LIVEKIT_URL,
            api_key=settings.LIVEKIT_API_KEY,
            api_secret=settings.LIVEKIT_API_SECRET,
        ) as lk:
            egress_info = await lk.egress.start_room_composite_egress(egress_request)

    except Exception as exc:
        logger.error("Failed to start Egress recording: %s", exc)
        raise HTTPException(
            status_code=500, detail=f"Failed to start recording: {exc}"
        ) from exc

    # Persist the Egress ID so we can stop it later
    session.egress_id = egress_info.egress_id
    # Derive a public recording URL (object will be available once recording stops)
    session.recording_url = (
        f"{settings.S3_PUBLIC_URL}/{output_key}"
    )
    db.commit()

    return {
        "message": "Recording started",
        "egress_id": egress_info.egress_id,
        "recording_url": session.recording_url,
    }


# ---------------------------------------------------------------------------
# POST /api/v1/session/record/stop
# ---------------------------------------------------------------------------

class RecordStopRequest(BaseModel):
    session_id: int


@router.post("/record/stop", summary="Stop an active Egress recording")
async def stop_recording(
    body: RecordStopRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """
    Stop a running LiveKit Egress recording.

    The ``egress_id`` stored on the session is used to identify the
    recording to stop.  The field is cleared afterwards.
    """
    session = db.query(LiveSession).filter(LiveSession.id == body.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.instructor_id != current_user.id and current_user.role not in (
        "admin",
        "super_admin",
    ):
        raise HTTPException(status_code=403, detail="Not authorised")

    if not session.egress_id:
        raise HTTPException(status_code=409, detail="No active recording for this session")

    if not settings.LIVEKIT_API_KEY or not settings.LIVEKIT_API_SECRET:
        raise HTTPException(
            status_code=503, detail="LiveKit credentials are not configured"
        )

    try:
        from livekit.api import LiveKitAPI

        egress_id = session.egress_id

        # Stop recording via LiveKit Egress (async call within async endpoint)
        async with LiveKitAPI(
            url=settings.LIVEKIT_URL,
            api_key=settings.LIVEKIT_API_KEY,
            api_secret=settings.LIVEKIT_API_SECRET,
        ) as lk:
            await lk.egress.stop_egress(egress_id)

    except Exception as exc:
        logger.error("Failed to stop Egress recording: %s", exc)
        raise HTTPException(
            status_code=500, detail=f"Failed to stop recording: {exc}"
        ) from exc

    recording_url = session.recording_url
    session.egress_id = None
    db.commit()

    return {
        "message": "Recording stopped",
        "recording_url": recording_url,
    }
