from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # Starter, Learner, Fluent
    slug = Column(String(100), unique=True, nullable=False)
    tier = Column(String(50), nullable=False)  # free, pro, premium
    
    price_monthly = Column(DECIMAL(8,2), default=0.00)
    price_annual = Column(DECIMAL(8,2), default=0.00)
    billing_interval = Column(String(50))  # monthly, annual
    
    # Feature flags
    max_free_courses = Column(Integer, default=3)  # -1 = unlimited
    has_ai_pronunciation = Column(Boolean, default=False)
    live_sessions_per_month = Column(Integer, default=0)  # -1 = unlimited
    has_certificates = Column(Boolean, default=False)
    has_offline_access = Column(Boolean, default=False)
    has_custom_path = Column(Boolean, default=False)
    has_priority_support = Column(Boolean, default=False)
    has_advanced_analytics = Column(Boolean, default=False)
    has_early_access = Column(Boolean, default=False)
    has_tutoring = Column(Boolean, default=False)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="plan")

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    
    status = Column(String(50), nullable=False, default="trialing")  # trialing, active, past_due, cancelled, expired
    billing_interval = Column(String(50), nullable=False)  # monthly, annual
    
    current_period_start = Column(DateTime(timezone=True), nullable=False)
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    trial_start = Column(DateTime(timezone=True))
    trial_end = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    cancel_reason = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")
    
    __table_args__ = (
        Index('ix_user_subscriptions_user_id', user_id),
        Index('ix_user_subscriptions_status', status),
        Index('ix_user_subscriptions_current_period_end', current_period_end),
    )

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("user_subscriptions.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))  # For one-time purchases
    
    amount = Column(DECIMAL(8,2), nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), nullable=False)  # pending, succeeded, failed, refunded
    payment_method = Column(String(50))  # card, mobile_money, apple_pay
    
    # Processor fields
    processor = Column(String(50))  # stripe, paystack, etc.
    processor_payment_id = Column(String(255))  # e.g., pi_xxx from Stripe
    
    # Card info (non-sensitive)
    card_last4 = Column(String(4))
    card_brand = Column(String(50))
    card_exp_month = Column(Integer)
    card_exp_year = Column(Integer)
    
    receipt_url = Column(String(500))
    refunded_at = Column(DateTime(timezone=True))
    refund_reason = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="payments")
    subscription = relationship("UserSubscription", back_populates="payments")
    course = relationship("Course")
    course_purchase = relationship("CoursePurchase", back_populates="payment", uselist=False, cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_payments_user_id', user_id),
        Index('ix_payments_status', status),
        Index('ix_payments_created_at', created_at),
    )

class CoursePurchase(Base):
    __tablename__ = "course_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id", ondelete="CASCADE"), nullable=False)
    
    amount_paid = Column(DECIMAL(8,2), nullable=False)
    purchased_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="course_purchases")
    course = relationship("Course", back_populates="purchases")
    payment = relationship("Payment", back_populates="course_purchase")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='uq_course_purchase'),
        Index('ix_course_purchases_user_id', user_id),
    )