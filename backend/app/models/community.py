from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class CommunityPost(Base):
    __tablename__ = "community_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"))
    
    body = Column(Text, nullable=False)
    post_type = Column(String(50), default="discussion")  # discussion, question, tip
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="community_posts")
    language = relationship("Language", back_populates="community_posts")
    tags = relationship("CommunityPostTag", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("CommunityPostLike", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("CommunityComment", back_populates="post", cascade="all, delete-orphan")
    saves = relationship("CommunityPostSave", back_populates="post", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_community_posts_user_id', user_id),
        Index('ix_community_posts_language_id', language_id),
        Index('ix_community_posts_post_type', post_type),
        Index('ix_community_posts_created_at', created_at),
    )

class CommunityPostTag(Base):
    __tablename__ = "community_post_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    tag = Column(String(50), nullable=False)
    
    # Relationships
    post = relationship("CommunityPost", back_populates="tags")
    
    __table_args__ = (
        Index('ix_community_post_tags_post_id', post_id),
        Index('ix_community_post_tags_tag', tag),
    )

class CommunityPostLike(Base):
    __tablename__ = "community_post_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("CommunityPost", back_populates="likes")
    user = relationship("User", back_populates="community_likes")
    
    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='uq_post_like'),
    )

class CommunityComment(Base):
    __tablename__ = "community_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("community_comments.id", ondelete="CASCADE"))
    
    body = Column(Text, nullable=False)
    like_count = Column(Integer, default=0)
    is_deleted = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    post = relationship("CommunityPost", back_populates="comments")
    user = relationship("User", back_populates="community_comments")
    parent = relationship("CommunityComment", remote_side=[id])
    replies = relationship("CommunityComment", back_populates="parent", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_community_comments_post_id', post_id),
        Index('ix_community_comments_user_id', user_id),
        Index('ix_community_comments_parent_id', parent_id),
    )

class CommunityPostSave(Base):
    __tablename__ = "community_post_saves"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("CommunityPost", back_populates="saves")
    user = relationship("User", back_populates="community_saves")
    
    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='uq_post_save'),
        Index('ix_community_saves_user_id', user_id),
    )