from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class InstructorApplication(Base):
    __tablename__ = "instructor_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, nullable=False)
    expertise_tags = Column(JSON, default=list)  # ["French", "Spanish"]
    status = Column(String(50), default="pending")  # pending, approved, rejected
    rejection_reason = Column(Text)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", foreign_keys=[user_id], back_populates="instructor_application")

    __table_args__ = (
        Index('ix_instructor_applications_user_id', user_id),
        Index('ix_instructor_applications_status', status),
    )


class CourseWishlist(Base):
    __tablename__ = "course_wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    course = relationship("Course")

    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='uq_wishlist_user_course'),
        Index('ix_wishlist_user_id', user_id),
    )


class CourseDiscussion(Base):
    __tablename__ = "course_discussions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    reply_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    course = relationship("Course")
    replies = relationship("CourseDiscussionReply", back_populates="thread", cascade="all, delete-orphan")

    __table_args__ = (
        Index('ix_course_discussions_course_id', course_id),
    )


class CourseDiscussionReply(Base):
    __tablename__ = "course_discussion_replies"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("course_discussions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    thread = relationship("CourseDiscussion", back_populates="replies")

    __table_args__ = (
        Index('ix_discussion_replies_thread_id', thread_id),
    )


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    language = Column(String(100))
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    member_count = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", foreign_keys=[creator_id])
    members = relationship("StudyGroupMember", back_populates="group", cascade="all, delete-orphan")

    __table_args__ = (
        Index('ix_study_groups_creator_id', creator_id),
    )


class StudyGroupMember(Base):
    __tablename__ = "study_group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("StudyGroup", back_populates="members")
    user = relationship("User")

    __table_args__ = (
        UniqueConstraint('group_id', 'user_id', name='uq_study_group_member'),
        Index('ix_study_group_members_user_id', user_id),
    )
