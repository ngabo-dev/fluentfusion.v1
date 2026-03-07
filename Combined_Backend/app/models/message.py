from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    # For instructor-student direct messages
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Or for group conversations
    is_group = Column(Boolean, default=False)
    group_name = Column(String(255))
    
    # Last message preview
    last_message_preview = Column(String(255))
    last_message_at = Column(DateTime(timezone=True))
    
    # Status
    is_archived_by_instructor = Column(Boolean, default=False)
    is_archived_by_student = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    instructor = relationship("User", foreign_keys=[instructor_id], back_populates="conversations_as_instructor")
    student = relationship("User", foreign_keys=[student_id], back_populates="conversations_as_student")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint('instructor_id', 'student_id', 'is_group', name='uq_conversation_participants'),
        Index('ix_conversations_instructor_id', instructor_id),
        Index('ix_conversations_student_id', student_id),
    )

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Message content
    content = Column(Text, nullable=False)
    message_type = Column(String(50), default="text")  # text, file, image, system
    
    # Attachments
    attachment_url = Column(String(500))
    attachment_name = Column(String(255))
    attachment_type = Column(String(100))
    attachment_size = Column(Integer)
    
    # Read status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True))
    
    # For reply threading
    reply_to_id = Column(Integer, ForeignKey("messages.id"))
    
    # @mentions (stored as JSON array of user IDs)
    mentions = Column(JSON)  # [{"user_id": 1, "username": "john"}, ...]
    
    # System message flag
    is_system_message = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages")
    reply_to = relationship("Message", remote_side=[id], back_populates="replies")
    replies = relationship("Message", back_populates="reply_to", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_messages_conversation_id', conversation_id),
        Index('ix_messages_sender_id', sender_id),
        Index('ix_messages_created_at', created_at),
    )

# Update User model relationships to include messages
# This will be added to the existing user.py relationships
