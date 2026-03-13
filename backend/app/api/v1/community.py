from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...database import get_db
from ...models.community import CommunityPost, CommunityPostTag, CommunityPostLike, CommunityComment, CommunityPostSave
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/community", tags=["Community"])

@router.get("/posts")
async def get_posts(
    language_id: Optional[int] = None,
    post_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get community posts"""
    query = db.query(CommunityPost).filter(CommunityPost.is_deleted == False)
    
    if language_id:
        query = query.filter(CommunityPost.language_id == language_id)
    if post_type:
        query = query.filter(CommunityPost.post_type == post_type)
    
    # Show pinned first, then by date
    query = query.order_by(CommunityPost.is_pinned.desc(), CommunityPost.created_at.desc())
    
    total = query.count()
    posts = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "posts": posts,
        "total": total,
        "page": page
    }

@router.get("/posts/{post_id}")
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get post with comments"""
    post = db.query(CommunityPost).filter(
        CommunityPost.id == post_id,
        CommunityPost.is_deleted == False
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get comments
    comments = db.query(CommunityComment).filter(
        CommunityComment.post_id == post_id,
        CommunityComment.is_deleted == False,
        CommunityComment.parent_id.is_(None)  # Top-level only
    ).order_by(CommunityComment.created_at.desc()).all()
    
    # Check if liked/saved
    is_liked = False
    is_saved = False
    if current_user:
        like = db.query(CommunityPostLike).filter(
            CommunityPostLike.post_id == post_id,
            CommunityPostLike.user_id == current_user.id
        ).first()
        is_liked = like is not None
        
        save = db.query(CommunityPostSave).filter(
            CommunityPostSave.post_id == post_id,
            CommunityPostSave.user_id == current_user.id
        ).first()
        is_saved = save is not None
    
    return {
        "post": post,
        "comments": comments,
        "is_liked": is_liked,
        "is_saved": is_saved
    }

@router.post("/posts")
async def create_post(
    body: str,
    post_type: str = "discussion",
    language_id: Optional[int] = None,
    tags: Optional[List[str]] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new post"""
    post = CommunityPost(
        user_id=current_user.id,
        language_id=language_id,
        body=body,
        post_type=post_type
    )
    db.add(post)
    db.flush()  # Get ID
    
    # Add tags
    if tags:
        for tag in tags:
            tag_obj = CommunityPostTag(post_id=post.id, tag=tag)
            db.add(tag_obj)
    
    db.commit()
    db.refresh(post)
    
    return {"message": "Post created", "post_id": post.id}

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Like a post"""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing = db.query(CommunityPostLike).filter(
        CommunityPostLike.post_id == post_id,
        CommunityPostLike.user_id == current_user.id
    ).first()
    
    if existing:
        # Unlike
        db.delete(existing)
        post.like_count = max(0, post.like_count - 1)
        liked = False
    else:
        like = CommunityPostLike(post_id=post_id, user_id=current_user.id)
        db.add(like)
        post.like_count += 1
        liked = True
    
    db.commit()
    
    return {"liked": liked, "like_count": post.like_count}

@router.post("/posts/{post_id}/save")
async def save_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Save a post"""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing = db.query(CommunityPostSave).filter(
        CommunityPostSave.post_id == post_id,
        CommunityPostSave.user_id == current_user.id
    ).first()
    
    if existing:
        db.delete(existing)
        saved = False
    else:
        save = CommunityPostSave(post_id=post_id, user_id=current_user.id)
        db.add(save)
        saved = True
    
    db.commit()
    
    return {"saved": saved}

@router.post("/posts/{post_id}/comments")
async def create_comment(
    post_id: int,
    body: str,
    parent_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a comment to a post"""
    post = db.query(CommunityPost).filter(
        CommunityPost.id == post_id,
        CommunityPost.is_deleted == False
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Validate parent if provided
    if parent_id:
        parent = db.query(CommunityComment).filter(CommunityComment.id == parent_id).first()
        if not parent or parent.post_id != post_id:
            raise HTTPException(status_code=400, detail="Invalid parent comment")
    
    comment = CommunityComment(
        post_id=post_id,
        user_id=current_user.id,
        parent_id=parent_id,
        body=body
    )
    db.add(comment)
    
    # Update comment count
    post.comment_count += 1
    
    db.commit()
    db.refresh(comment)
    
    return {"message": "Comment added", "comment_id": comment.id}

@router.get("/posts/{post_id}/comments")
async def get_comments(
    post_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get comments for a post"""
    query = db.query(CommunityComment).filter(
        CommunityComment.post_id == post_id,
        CommunityComment.is_deleted == False,
        CommunityComment.parent_id.is_(None)
    ).order_by(CommunityComment.created_at.desc())
    
    total = query.count()
    comments = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "comments": comments,
        "total": total,
        "page": page
    }

@router.get("/my-posts")
async def get_my_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's own posts"""
    query = db.query(CommunityPost).filter(
        CommunityPost.user_id == current_user.id,
        CommunityPost.is_deleted == False
    ).order_by(CommunityPost.created_at.desc())
    
    total = query.count()
    posts = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "posts": posts,
        "total": total,
        "page": page
    }

@router.get("/saved")
async def get_saved_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's saved posts"""
    query = db.query(CommunityPost).join(CommunityPostSave).filter(
        CommunityPostSave.user_id == current_user.id,
        CommunityPost.is_deleted == False
    ).order_by(CommunityPostSave.saved_at.desc())
    
    total = query.count()
    posts = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "posts": posts,
        "total": total,
        "page": page
    }

# ==================== STUDY GROUPS ====================

@router.get("/groups")
async def get_study_groups(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all study groups"""
    from ...models.extras import StudyGroup, StudyGroupMember
    groups = db.query(StudyGroup).filter(StudyGroup.is_active == True).order_by(
        StudyGroup.created_at.desc()
    ).offset((page - 1) * limit).limit(limit).all()
    total = db.query(StudyGroup).filter(StudyGroup.is_active == True).count()
    result = []
    for g in groups:
        member_record = db.query(StudyGroupMember).filter(
            StudyGroupMember.group_id == g.id, StudyGroupMember.user_id == current_user.id
        ).first()
        result.append({
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "language": g.language,
            "member_count": g.member_count,
            "is_joined": member_record is not None,
            "created_at": g.created_at.isoformat() if g.created_at else None,
        })
    return {"groups": result, "total": total, "page": page}


@router.post("/groups")
async def create_study_group(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new study group"""
    from ...models.extras import StudyGroup, StudyGroupMember
    name = body.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    group = StudyGroup(
        name=name,
        description=body.get("description", ""),
        language=body.get("language", ""),
        creator_id=current_user.id,
        member_count=1,
    )
    db.add(group)
    db.flush()
    db.add(StudyGroupMember(group_id=group.id, user_id=current_user.id))
    db.commit()
    db.refresh(group)
    return {"message": "Group created", "group_id": group.id}


@router.post("/groups/{group_id}/join")
async def join_study_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Join a study group"""
    from ...models.extras import StudyGroup, StudyGroupMember
    group = db.query(StudyGroup).filter(StudyGroup.id == group_id, StudyGroup.is_active == True).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    existing = db.query(StudyGroupMember).filter(
        StudyGroupMember.group_id == group_id, StudyGroupMember.user_id == current_user.id
    ).first()
    if existing:
        return {"message": "Already a member"}
    db.add(StudyGroupMember(group_id=group_id, user_id=current_user.id))
    group.member_count += 1
    db.commit()
    return {"message": "Joined group"}


@router.post("/groups/{group_id}/leave")
async def leave_study_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Leave a study group"""
    from ...models.extras import StudyGroup, StudyGroupMember
    group = db.query(StudyGroup).filter(StudyGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    member = db.query(StudyGroupMember).filter(
        StudyGroupMember.group_id == group_id, StudyGroupMember.user_id == current_user.id
    ).first()
    if member:
        db.delete(member)
        group.member_count = max(0, group.member_count - 1)
        db.commit()
    return {"message": "Left group"}
