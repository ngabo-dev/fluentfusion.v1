from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ...database import get_db
from ...models.payment import SubscriptionPlan, UserSubscription, Payment, CoursePurchase
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/payments", tags=["Payments"])

# ==================== SUBSCRIPTION PLANS ====================

@router.get("/plans")
async def get_subscription_plans(
    db: Session = Depends(get_db)
):
    """Get all subscription plans"""
    plans = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.is_active == True
    ).all()
    
    return {"plans": plans}

@router.get("/plans/{plan_id}")
async def get_plan_details(
    plan_id: int,
    db: Session = Depends(get_db)
):
    """Get subscription plan details"""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return plan

# ==================== USER SUBSCRIPTION ====================

@router.get("/subscription")
async def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's current subscription"""
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.status.in_(["trialing", "active"])
    ).first()
    
    if not subscription:
        return {"subscription": None, "plan": None}
    
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription.plan_id).first()
    
    return {
        "subscription": subscription,
        "plan": plan
    }

@router.post("/subscribe")
async def subscribe_to_plan(
    plan_id: int,
    billing_interval: str = "monthly",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Subscribe to a plan"""
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == plan_id,
        SubscriptionPlan.is_active == True
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Check for existing active subscription
    existing = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.status.in_(["trialing", "active"])
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already subscribed")
    
    # Calculate periods
    now = datetime.utcnow()
    if billing_interval == "monthly":
        period_end = now + timedelta(days=30)
        trial_end = now + timedelta(days=7)  # 7-day trial
    else:
        period_end = now + timedelta(days=365)
        trial_end = now + timedelta(days=14)  # 14-day trial
    
    subscription = UserSubscription(
        user_id=current_user.id,
        plan_id=plan_id,
        status="trialing",
        billing_interval=billing_interval,
        current_period_start=now,
        current_period_end=period_end,
        trial_start=now,
        trial_end=trial_end
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    # In production, this would create a Stripe checkout session
    return {
        "message": "Subscription created",
        "subscription_id": subscription.id,
        "status": subscription.status,
        "trial_end": trial_end
    }

@router.post("/subscription/cancel")
async def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel subscription"""
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.status.in_(["trialing", "active"])
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription")
    
    subscription.status = "cancelled"
    subscription.cancelled_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Subscription cancelled"}

# ==================== COURSE PURCHASES ====================

@router.get("/purchases")
async def get_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's purchased courses"""
    purchases = db.query(CoursePurchase).filter(
        CoursePurchase.user_id == current_user.id
    ).all()
    
    return {"purchases": purchases}

@router.post("/courses/{course_id}/purchase")
async def purchase_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Purchase a course"""
    from ...models.course import Course
    from ...models.progress import Enrollment
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.is_free:
        raise HTTPException(status_code=400, detail="Course is free")
    
    # Check if already purchased
    existing = db.query(CoursePurchase).filter(
        CoursePurchase.user_id == current_user.id,
        CoursePurchase.course_id == course_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already purchased")
    
    # Check if already enrolled (should have purchase record)
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    # In production, this would process payment through Stripe
    # For now, just create the purchase and enrollment
    
    # Create payment record
    payment = Payment(
        user_id=current_user.id,
        course_id=course_id,
        amount=course.price_usd,
        status="succeeded",
        payment_method="card",
        processor="stripe"
    )
    db.add(payment)
    db.flush()
    
    # Create purchase
    purchase = CoursePurchase(
        user_id=current_user.id,
        course_id=course_id,
        payment_id=payment.id,
        amount_paid=course.price_usd
    )
    db.add(purchase)
    
    # Create enrollment
    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id
    )
    db.add(enrollment)
    
    # Update course enrollments
    course.total_enrollments += 1
    
    db.commit()
    
    return {
        "message": "Course purchased successfully",
        "purchase_id": purchase.id
    }

# ==================== PAYMENT HISTORY ====================

@router.get("/history")
async def get_payment_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's payment history"""
    query = db.query(Payment).filter(
        Payment.user_id == current_user.id
    ).order_by(Payment.created_at.desc())
    
    total = query.count()
    payments = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "payments": payments,
        "total": total,
        "page": page
    }
