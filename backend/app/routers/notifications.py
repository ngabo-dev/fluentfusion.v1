from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import get_db, User, Notification, NotificationReaction, NotificationReply, NotificationRead
from app.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

def _get_notif(notif_id: int, db: Session) -> Notification:
    n = db.query(Notification).filter(Notification.id == notif_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    return n

@router.get("/{notif_id}")
def get_notification(notif_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = _get_notif(notif_id, db)
    sender = db.query(User).filter(User.id == n.sender_id).first() if n.sender_id else None

    # Reactions grouped by emoji with reactor names
    reactions_raw = db.query(NotificationReaction).filter(NotificationReaction.notification_id == notif_id).all()
    reaction_map: dict = {}
    for r in reactions_raw:
        u = db.query(User).filter(User.id == r.user_id).first()
        if r.emoji not in reaction_map:
            reaction_map[r.emoji] = {"emoji": r.emoji, "count": 0, "users": [], "reacted": False}
        reaction_map[r.emoji]["count"] += 1
        reaction_map[r.emoji]["users"].append(u.name if u else "Unknown")
        if r.user_id == current_user.id:
            reaction_map[r.emoji]["reacted"] = True

    # Replies
    replies = db.query(NotificationReply).filter(NotificationReply.notification_id == notif_id).order_by(NotificationReply.created_at).all()
    reply_list = []
    for rep in replies:
        u = db.query(User).filter(User.id == rep.user_id).first()
        reply_list.append({
            "id": rep.id, "user_id": rep.user_id,
            "user_name": u.name if u else "Unknown",
            "user_initials": u.avatar_initials if u else "?",
            "user_avatar_url": u.avatar_url if u else None,
            "content": rep.content,
            "created_at": rep.created_at,
        })

    # My reaction
    my_reaction = db.query(NotificationReaction).filter(
        NotificationReaction.notification_id == notif_id,
        NotificationReaction.user_id == current_user.id
    ).first()

    return {
        "id": n.id, "title": n.title, "message": n.message,
        "target": n.target or "", "sent_at": n.sent_at,
        "allow_replies": n.allow_replies or False,
        "sender_name": sender.name if sender else "FluentFusion",
        "sender_initials": sender.avatar_initials if sender else "FF",
        "sender_avatar_url": sender.avatar_url if sender else None,
        "reactions": list(reaction_map.values()),
        "my_reaction": my_reaction.emoji if my_reaction else None,
        "replies": reply_list,
    }

@router.post("/{notif_id}/react")
def react(notif_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_notif(notif_id, db)
    emoji = body.get("emoji", "").strip()
    if not emoji:
        raise HTTPException(status_code=400, detail="emoji required")

    existing = db.query(NotificationReaction).filter(
        NotificationReaction.notification_id == notif_id,
        NotificationReaction.user_id == current_user.id
    ).first()

    if existing:
        if existing.emoji == emoji:
            # Toggle off
            db.delete(existing)
            db.commit()
            return {"ok": True, "action": "removed"}
        else:
            existing.emoji = emoji
            db.commit()
            return {"ok": True, "action": "changed"}
    else:
        db.add(NotificationReaction(notification_id=notif_id, user_id=current_user.id, emoji=emoji))
        db.commit()
        return {"ok": True, "action": "added"}

@router.post("/{notif_id}/reply")
def reply(notif_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = _get_notif(notif_id, db)
    if not n.allow_replies:
        raise HTTPException(status_code=403, detail="Replies not allowed on this notification")
    content = body.get("content", "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="content required")
    db.add(NotificationReply(notification_id=notif_id, user_id=current_user.id, content=content))
    db.commit()
    return {"ok": True}

@router.get("/{notif_id}/reactions")
def get_reactions(notif_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Returns full list of who reacted with what — for sender's view."""
    _get_notif(notif_id, db)
    rows = db.query(NotificationReaction).filter(NotificationReaction.notification_id == notif_id).all()
    result = []
    for r in rows:
        u = db.query(User).filter(User.id == r.user_id).first()
        result.append({"user_name": u.name if u else "Unknown", "user_initials": u.avatar_initials if u else "?", "emoji": r.emoji, "created_at": r.created_at})
    return result
