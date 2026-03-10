from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from ...database import get_db
from ...models.live_session import LiveSession, LiveSessionRegistration, LiveSessionMessage
from ...models.user import User
from ...models.language import Language
from ...dependencies import get_current_user, get_current_active_user, require_instructor

router = APIRouter(prefix="/live", tags=["Live Sessions"])

# ==================== PYDANTIC SCHEMAS ====================

class LiveSessionCreate(BaseModel):
    title: str
    description: str
    language_id: int
    scheduled_at: str  # ISO format
    duration_minutes: int = 60
    max_participants: int = 100
    stream_url: Optional[str] = None

class LiveSessionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_at: Optional[str] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    stream_url: Optional[str] = None

# ==================== INSTRUCTOR: CREATE LIVE SESSIONS ====================

@router.post("/sessions")
async def create_live_session(
    session_data: LiveSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Create a new live session (instructor only)"""
    # Verify language exists
    language = db.query(Language).filter(Language.id == session_data.language_id).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")
    
    # Parse scheduled time
    scheduled = datetime.fromisoformat(session_data.scheduled_at.replace('Z', '+00:00'))
    
    # Create session
    session = LiveSession(
        instructor_id=current_user.id,
        language_id=session_data.language_id,
        title=session_data.title,
        description=session_data.description,
        scheduled_at=scheduled,
        duration_minutes=session_data.duration_minutes,
        max_participants=session_data.max_participants,
        stream_url=session_data.stream_url,
        status="scheduled"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {
        "message": "Live session created",
        "session": {
            "id": session.id,
            "title": session.title,
            "scheduled_at": session.scheduled_at.isoformat() if session.scheduled_at else None,
            "status": session.status
        }
    }

@router.patch("/sessions/{session_id}")
async def update_live_session(
    session_id: int,
    update_data: LiveSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Update a live session (instructor only)"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify ownership
    if session.instructor_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to modify this session")
    
    # Update fields
    if update_data.title is not None:
        session.title = update_data.title
    if update_data.description is not None:
        session.description = update_data.description
    if update_data.scheduled_at is not None:
        session.scheduled_at = datetime.fromisoformat(update_data.scheduled_at.replace('Z', '+00:00'))
    if update_data.duration_minutes is not None:
        session.duration_minutes = update_data.duration_minutes
    if update_data.max_participants is not None:
        session.max_participants = update_data.max_participants
    if update_data.stream_url is not None:
        session.stream_url = update_data.stream_url
    
    db.commit()
    db.refresh(session)
    
    return {
        "message": "Session updated",
        "session": {
            "id": session.id,
            "title": session.title,
            "status": session.status
        }
    }

@router.delete("/sessions/{session_id}")
async def delete_live_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Delete/cancel a live session (instructor only)"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify ownership
    if session.instructor_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this session")
    
    # Only allow deletion of scheduled sessions
    if session.status not in ["scheduled", "cancelled"]:
        raise HTTPException(status_code=400, detail="Cannot delete active or completed sessions")
    
    session.status = "cancelled"
    db.commit()
    
    return {"message": "Session cancelled"}

@router.post("/sessions/{session_id}/start")
async def start_live_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Start a live session (instructor only)"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify ownership
    if session.instructor_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if session.status != "scheduled":
        raise HTTPException(status_code=400, detail="Session cannot be started")
    
    session.status = "live"
    session.started_at = datetime.utcnow()
    db.commit()
    
    return {
        "message": "Session is now live",
        "stream_url": session.stream_url
    }

@router.post("/sessions/{session_id}/end")
async def end_live_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """End a live session (instructor only)"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify ownership
    if session.instructor_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if session.status != "live":
        raise HTTPException(status_code=400, detail="Session is not currently live")
    
    session.status = "ended"
    session.ended_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Session ended"}

@router.get("/instructor/sessions")
async def get_my_live_sessions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor's own live sessions"""
    query = db.query(LiveSession).filter(LiveSession.instructor_id == current_user.id)
    
    if status:
        query = query.filter(LiveSession.status == status)
    
    total = query.count()
    sessions = query.order_by(LiveSession.scheduled_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for s in sessions:
        reg_count = db.query(LiveSessionRegistration).filter(
            LiveSessionRegistration.session_id == s.id
        ).count()
        
        language = db.query(Language).filter(Language.id == s.language_id).first()
        
        results.append({
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "language_id": s.language_id,
            "language_name": language.name if language else "Unknown",
            "scheduled_at": s.scheduled_at.isoformat() if s.scheduled_at else None,
            "duration_minutes": s.duration_minutes,
            "status": s.status,
            "max_participants": s.max_participants,
            "enrolled_count": reg_count,
            "is_live": s.status == "live"
        })
    
    return {
        "sessions": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

# ==================== PUBLIC: LIST LIVE SESSIONS ====================

@router.get("/sessions")
async def get_live_sessions(
    language_id: Optional[int] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get upcoming live sessions"""
    query = db.query(LiveSession)
    
    if language_id:
        query = query.filter(LiveSession.language_id == language_id)
    if status:
        query = query.filter(LiveSession.status == status)
    else:
        # Default to upcoming statuses
        query = query.filter(LiveSession.status.in_(["scheduled", "live"]))
    
    total = query.count()
    sessions = query.order_by(LiveSession.scheduled_at).offset((page - 1) * limit).limit(limit).all()
    
    # Serialize sessions
    sessions_data = []
    for s in sessions:
        instructor = db.query(User).filter(User.id == s.instructor_id).first()
        reg_count = db.query(LiveSessionRegistration).filter(
            LiveSessionRegistration.session_id == s.id
        ).count()
        
        sessions_data.append({
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "instructor_id": s.instructor_id,
            "instructor_name": instructor.full_name if instructor else "Instructor",
            "instructor_avatar": instructor.avatar_url if instructor else None,
            "language_id": s.language_id,
            "scheduled_at": s.scheduled_at.isoformat() if s.scheduled_at else None,
            "duration_minutes": s.duration_minutes,
            "status": s.status,
            "max_participants": s.max_participants,
            "enrolled_count": reg_count,
            "is_live": s.status == "live"
        })
    
    return {
        "sessions": sessions_data,
        "total": total,
        "page": page
    }

@router.get("/sessions/upcoming")
async def get_upcoming_sessions(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get upcoming sessions (next 7 days)"""
    now = datetime.utcnow()
    week_later = now + timedelta(days=7)
    
    sessions = db.query(LiveSession).filter(
        LiveSession.status == "scheduled",
        LiveSession.scheduled_at >= now,
        LiveSession.scheduled_at <= week_later
    ).order_by(LiveSession.scheduled_at).limit(limit).all()
    
    # Serialize sessions
    sessions_data = []
    for s in sessions:
        # Get instructor info
        instructor = db.query(User).filter(User.id == s.instructor_id).first()
        
        # Get registration count
        reg_count = db.query(LiveSessionRegistration).filter(
            LiveSessionRegistration.session_id == s.id
        ).count()
        
        sessions_data.append({
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "instructor_id": s.instructor_id,
            "instructor_name": instructor.full_name if instructor else "Instructor",
            "instructor_avatar": instructor.avatar_url if instructor else None,
            "language_id": s.language_id,
            "scheduled_at": s.scheduled_at.isoformat() if s.scheduled_at else None,
            "duration_minutes": s.duration_minutes,
            "status": s.status,
            "max_participants": s.max_participants,
            "enrolled_count": reg_count,
            "is_live": s.status == "live"
        })
    
    return {"sessions": sessions_data}

@router.get("/sessions/live")
async def get_live_now(
    db: Session = Depends(get_db)
):
    """Get currently live sessions"""
    sessions = db.query(LiveSession).filter(
        LiveSession.status == "live"
    ).order_by(LiveSession.scheduled_at.desc()).all()
    
    return {"sessions": sessions}

@router.get("/sessions/{session_id}")
async def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get session details"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check registration
    registration = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id
    ).first()
    
    # Get recent messages
    messages = db.query(LiveSessionMessage).filter(
        LiveSessionMessage.session_id == session_id,
        LiveSessionMessage.is_deleted == False
    ).order_by(LiveSessionMessage.sent_at.desc()).limit(50).all()
    
    return {
        "session": session,
        "is_registered": registration is not None,
        "messages": messages
    }

@router.post("/sessions/{session_id}/register")
async def register_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Register for a live session"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.status == "ended" or session.status == "cancelled":
        raise HTTPException(status_code=400, detail="Session is no longer available")
    
    # Check if already registered
    existing = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id
    ).first()
    
    if existing:
        return {"message": "Already registered"}
    
    registration = LiveSessionRegistration(
        session_id=session_id,
        user_id=current_user.id
    )
    db.add(registration)
    db.commit()
    
    return {"message": "Registered successfully"}

@router.post("/sessions/{session_id}/join")
async def join_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Join a live session"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.status not in ["scheduled", "live"]:
        raise HTTPException(status_code=400, detail="Session is not available")
    
    # Check registration
    registration = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=403, detail="Please register first")
    
    # Update join time
    if not registration.joined_at:
        registration.joined_at = datetime.utcnow()
    
    # Update viewer count
    session.current_viewers += 1
    
    db.commit()
    
    return {
        "message": "Joined session",
        "stream_url": session.stream_url if session.status == "live" else None
    }

@router.post("/sessions/{session_id}/leave")
async def leave_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Leave a live session"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    registration = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id
    ).first()
    
    if registration and not registration.left_at:
        registration.left_at = datetime.utcnow()
        session.current_viewers = max(0, session.current_viewers - 1)
    
    db.commit()
    
    return {"message": "Left session"}

@router.post("/sessions/{session_id}/messages")
async def send_message(
    session_id: int,
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Send a message in a live session"""
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check if user is in session
    registration = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id,
        LiveSessionRegistration.joined_at.isnot(None)
    ).first()
    
    if not registration:
        raise HTTPException(status_code=403, detail="Please join the session first")
    
    msg = LiveSessionMessage(
        session_id=session_id,
        user_id=current_user.id,
        message=message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    return {
        "message": "Message sent",
        "msg_id": msg.id,
        "user": current_user.full_name
    }

@router.post("/sessions/{session_id}/raise-hand")
async def raise_hand(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Raise hand in session"""
    registration = db.query(LiveSessionRegistration).filter(
        LiveSessionRegistration.session_id == session_id,
        LiveSessionRegistration.user_id == current_user.id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Not registered")
    
    registration.hand_raised = not registration.hand_raised
    
    session = db.query(LiveSession).filter(LiveSession.id == session_id).first()
    if registration.hand_raised:
        session.hands_raised += 1
    else:
        session.hands_raised = max(0, session.hands_raised - 1)
    
    db.commit()
    
    return {"hand_raised": registration.hand_raised}
