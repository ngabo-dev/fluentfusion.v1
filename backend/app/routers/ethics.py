from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.models import (
    get_db, User, RoleEnum,
    ConsentRecord, ConsentTypeEnum,
    DataSubjectRequest, DSRTypeEnum, DSRStatusEnum,
    ConsentVersion, ConsentDocTypeEnum,
    ProcessingActivityLog, EthicsChangeLog, PulseStateFeedback, PulseStateEnum,
)
from app.auth import get_current_user, require_role
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter(prefix="/api/v1/ethics", tags=["ethics"])
guard_any   = get_current_user
guard_admin = require_role(RoleEnum.admin)

REC_EMAIL = "researchethics@alueducation.com"

# ── Pydantic schemas ──────────────────────────────────────────────────────

class ConsentIn(BaseModel):
    consent_type: str
    version: Optional[str] = "1.0"
    accepted: bool
    session_id: Optional[str] = None

class DSRIn(BaseModel):
    request_type: str
    details: Optional[str] = None

class DSRResolveIn(BaseModel):
    status: str
    resolution_notes: Optional[str] = None

class PulseFeedbackIn(BaseModel):
    current_state: str
    disagreed: bool = True
    user_reported_state: Optional[str] = None
    comment: Optional[str] = None

class ProcessingActivityIn(BaseModel):
    activity_name: str
    purpose: Optional[str] = None
    legal_basis: Optional[str] = None
    data_categories: Optional[str] = None
    data_subjects: Optional[str] = None
    recipients: Optional[str] = None
    retention_period: Optional[str] = None
    cross_border_transfer: bool = False
    safeguards: Optional[str] = None

class EthicsChangeIn(BaseModel):
    change_type: str
    description: str
    notify_rec: bool = True

# ── Document content (static) ─────────────────────────────────────────────

DOCUMENTS = {
    "terms": {
        "title": "Terms and Conditions",
        "version": "1.0",
        "last_updated": "06 February 2026",
        "content": """# FluentFusion Terms and Conditions

**Version 1.0 — Effective 06 February 2026**

## Clause 1: Acceptance of Terms

By creating an account or using FluentFusion, you agree to these Terms. If you do not agree, do not use the platform. These Terms form a binding contract between you and FluentFusion AI.

## Clause 2: User Accounts and Eligibility

You must be at least 18 years old to create an account without parental consent. You are responsible for keeping your login credentials secure. You must not share your account with others.

## Clause 3: Permitted Use and Prohibited Conduct

You may use FluentFusion for personal language learning. You must not scrape data, impersonate other users, abuse the PULSE feedback system, or attempt to reverse-engineer the platform.

## Clause 4: Subscription, Payments, and Refunds

Payments are processed by Stripe. Subscriptions renew automatically. You may cancel at any time. Refunds are available within 14 days of purchase if you have not completed more than 20% of a course.

## Clause 5: Intellectual Property

All platform content, code, and branding belong to FluentFusion AI. By uploading content as an instructor, you grant FluentFusion a non-exclusive licence to host and display that content.

## Clause 6: PULSE Automated Processing Disclosure

FluentFusion uses PULSE, an AI system that analyses your learning behaviour to classify your learner state into one of five categories. This constitutes automated profiling under GDPR Article 22. You have the right to request human review of any classification and to object to automated processing. See /pulse-disclosure for full details.

## Clause 7: Live Session Recording

Recording a live session requires your separate consent. Recordings are stored for 30 days then permanently deleted. You may request earlier deletion via your Data Rights Dashboard.

## Clause 8: Third-Party Services

We use the following sub-processors: Stripe (payments), LiveKit (live sessions), AWS S3 (media storage), SendGrid (email). Each sub-processor is bound by data processing agreements.

## Clause 9: Limitation of Liability

FluentFusion is liable for data breaches caused by our negligence and for service quality failures under Rwandan consumer protection law. We are not liable for indirect losses.

## Clause 10: Governing Law

These Terms are governed by the laws of the Republic of Rwanda. Disputes are resolved under Rwandan jurisdiction.

## Clause 11: Changes to Terms

We will give 30 days notice of material changes. Continued use after the notice period constitutes acceptance.

## Clause 12: Contact

legal@fluentfusion.com"""
    },
    "privacy_policy": {
        "title": "Privacy Policy",
        "version": "1.0",
        "last_updated": "06 February 2026",
        "content": """# FluentFusion Privacy Policy

**Version 1.0 — Effective 06 February 2026**

## 1. Who We Are

FluentFusion AI operates this platform. Contact: privacy@fluentfusion.com

## 2. What Data We Collect

| Data Category | Source | Purpose |
|---|---|---|
| Registration data | You | Account creation |
| Behavioural telemetry | Platform | PULSE classification |
| PULSE signals | Platform | Adaptive learning |
| Payment data | Stripe | Billing |
| Session data | LiveKit | Live classes |
| Device/IP | Browser | Security |

## 3. Legal Basis for Processing

We process your data under GDPR Article 6 and Rwanda Law No. 058/2021. Legal bases include: contract performance, legitimate interest, and explicit consent (for PULSE and recordings).

## 4. PULSE Automated Decision-Making

PULSE is an AI system that classifies your learner state. This is automated profiling under GDPR Article 22. You have the right to request human review and to object. See /pulse-disclosure.

## 5. How We Share Your Data

Sub-processors: Stripe, LiveKit, AWS S3 (eu-west-1), SendGrid. We do not sell your data.

## 6. Cross-Border Transfers

AWS S3 is hosted in eu-west-1 (Ireland), which provides adequate protection under GDPR.

## 7. Data Retention

- Account data: account lifetime + 2 years
- Session recordings: 30 days
- PULSE logs: 12 months then anonymised
- Payment records: 7 years
- Consent records: indefinite

## 8. Your Rights

Access, Rectification, Erasure, Portability, Restriction, Objection, Human Review of AI decisions. Exercise via /dashboard/data-rights.

## 9. Children's Data

Users under 18 require parental consent. See /children for details.

## 10. Cookies

See /cookies for our full cookie policy.

## 11. Contact

privacy@fluentfusion.com | researchethics@alueducation.com"""
    },
    "pulse_disclosure": {
        "title": "PULSE AI Disclosure",
        "version": "1.0",
        "last_updated": "06 February 2026",
        "content": """# PULSE AI Disclosure

**REC Approval: J26BSE087 — 06 February 2026**

## What is PULSE?

PULSE (Predictive Unified Learner State Engine) is an AI system that analyses your learning behaviour and classifies you into one of five learner states: Thriving, Coasting, Struggling, Burning Out, or Disengaged.

## What signals does PULSE use?

Total clicks, active days, average clicks per day, assessment scores, number of assessments submitted, days to first submission, previous attempts, studied credits, registration timing, and early withdrawal signals.

## How are classifications used?

Your state is used to adapt your curriculum difficulty, session length, flashcard volume, and lesson types. Your instructor can see your state to provide targeted support.

## What PULSE does NOT determine

PULSE does not determine your grades, certifications, or account status. All consequential decisions require human review.

## Your rights

- View your current state on your dashboard
- Submit a disagreement if you believe the classification is wrong
- Request human review via your Data Rights Dashboard
- Object to automated processing entirely

## Contact

pulse@fluentfusion.com"""
    },
    "cookie_policy": {
        "title": "Cookie Policy",
        "version": "1.0",
        "last_updated": "06 February 2026",
        "content": """# Cookie Policy

**Version 1.0 — Effective 06 February 2026**

## Strictly Necessary Cookies

These cookies are required for the platform to work. No consent needed.

| Cookie | Purpose | Duration | Provider |
|---|---|---|---|
| ff_access_token | Authentication | 24 hours | FluentFusion |
| ff_user | User session data | 24 hours | FluentFusion |

## Analytics Cookies

These cookies help us understand how the platform is used. Consent required.

| Cookie | Purpose | Duration | Provider |
|---|---|---|---|
| _ga | Google Analytics | 2 years | Google |

## Preference Cookies

These cookies remember your settings. Consent required.

| Cookie | Purpose | Duration | Provider |
|---|---|---|---|
| ff_theme | Dark/light mode | 1 year | FluentFusion |
| ff_lang | Language preference | 1 year | FluentFusion |"""
    },
    "children_policy": {
        "title": "Children's Data Policy",
        "version": "1.0",
        "last_updated": "06 February 2026",
        "content": """# Children's Data Policy

**Version 1.0 — Effective 06 February 2026**

## Minimum Age

FluentFusion requires users to be at least 18 years old, or to have verifiable parental consent if under 18. This complies with GDPR Article 8 and Rwanda Law No. 058/2021.

## Parental Consent Process

If a user indicates they are under 18 during registration, we send a consent request to their parent or guardian. The account is not activated until the guardian confirms consent via email.

## PULSE Restrictions for Minor Accounts

PULSE automated classification is disabled for minor accounts until parental consent for data processing is confirmed.

## What Data is Collected from Minor Accounts

The same registration and learning data as adult accounts, but with stricter retention limits and no marketing communications.

## Parental Rights

Parents and guardians may request to view, correct, or delete their child's data at any time by contacting privacy@fluentfusion.com."""
    },
}

# ── Consent endpoints ─────────────────────────────────────────────────────

@router.post("/consent")
def record_consent(body: ConsentIn, request: Request,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(guard_any)):
    try:
        ct = ConsentTypeEnum(body.consent_type)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Unknown consent_type: {body.consent_type}")
    record = ConsentRecord(
        user_id=current_user.id,
        consent_type=ct,
        version=body.version,
        accepted=body.accepted,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        session_id=body.session_id,
        accepted_at=datetime.utcnow(),
        revoked_at=None if body.accepted else datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    return {"ok": True, "id": record.id}

@router.get("/consent/me")
def my_consents(db: Session = Depends(get_db), current_user: User = Depends(guard_any)):
    records = db.query(ConsentRecord).filter(ConsentRecord.user_id == current_user.id)\
                .order_by(ConsentRecord.accepted_at.desc()).all()
    return [{"id": r.id, "consent_type": r.consent_type, "version": r.version,
             "accepted": r.accepted, "accepted_at": r.accepted_at, "revoked_at": r.revoked_at}
            for r in records]

@router.delete("/consent/me/{consent_type}")
def revoke_consent(consent_type: str, db: Session = Depends(get_db),
                   current_user: User = Depends(guard_any)):
    try:
        ct = ConsentTypeEnum(consent_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Unknown consent_type")
    record = db.query(ConsentRecord).filter(
        ConsentRecord.user_id == current_user.id,
        ConsentRecord.consent_type == ct,
        ConsentRecord.accepted == True,
    ).order_by(ConsentRecord.accepted_at.desc()).first()
    if not record:
        raise HTTPException(status_code=404, detail="No active consent found")
    record.accepted = False
    record.revoked_at = datetime.utcnow()
    db.commit()
    return {"ok": True}

@router.get("/consent/versions")
def consent_versions(db: Session = Depends(get_db)):
    versions = db.query(ConsentVersion).order_by(ConsentVersion.effective_date.desc()).all()
    return [{"id": v.id, "document_type": v.document_type, "version_number": v.version_number,
             "effective_date": v.effective_date, "created_at": v.created_at}
            for v in versions]

# ── Data Subject Requests ─────────────────────────────────────────────────

@router.post("/data-rights")
def submit_dsr(body: DSRIn, db: Session = Depends(get_db),
               current_user: User = Depends(guard_any)):
    try:
        rt = DSRTypeEnum(body.request_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Unknown request_type")
    dsr = DataSubjectRequest(
        user_id=current_user.id,
        request_type=rt,
        details=body.details,
    )
    db.add(dsr)
    db.commit()
    # Send acknowledgement email
    try:
        from app.email_utils import send_email, _BASE
        html = _BASE.format(body=f"""
          <h2 style="color:#BFFF00;margin:0 0 8px;">Data Request Received ✅</h2>
          <p style="color:#aaa;">Hi {current_user.name}, we have received your <b style="color:#fff;">{rt.value.replace('_',' ').title()}</b> request.</p>
          <p style="color:#aaa;">We will respond within <b style="color:#fff;">30 days</b> as required by Rwandan Law No. 058/2021 and the EU GDPR.</p>
          <p style="color:#555;font-size:12px;">Reference: DSR-{dsr.id:05d}</p>
        """)
        send_email(current_user.email, "Your Data Request — FluentFusion", html)
    except Exception:
        pass
    return {"ok": True, "id": dsr.id, "reference": f"DSR-{dsr.id:05d}"}

@router.get("/data-rights/me")
def my_dsrs(db: Session = Depends(get_db), current_user: User = Depends(guard_any)):
    dsrs = db.query(DataSubjectRequest).filter(DataSubjectRequest.user_id == current_user.id)\
              .order_by(DataSubjectRequest.created_at.desc()).all()
    return [{"id": d.id, "request_type": d.request_type, "status": d.status,
             "details": d.details, "created_at": d.created_at,
             "resolved_at": d.resolved_at, "resolution_notes": d.resolution_notes}
            for d in dsrs]

@router.get("/data-rights")
def all_dsrs(status: str = "", db: Session = Depends(get_db),
             current_user: User = Depends(guard_admin)):
    q = db.query(DataSubjectRequest)
    if status:
        try:
            q = q.filter(DataSubjectRequest.status == DSRStatusEnum(status))
        except ValueError:
            pass
    dsrs = q.order_by(DataSubjectRequest.created_at.desc()).all()
    result = []
    for d in dsrs:
        user = db.query(User).filter(User.id == d.user_id).first()
        result.append({
            "id": d.id, "user": user.name if user else "", "email": user.email if user else "",
            "request_type": d.request_type, "status": d.status,
            "details": d.details, "created_at": d.created_at,
            "resolved_at": d.resolved_at, "resolution_notes": d.resolution_notes,
        })
    return result

@router.patch("/data-rights/{dsr_id}")
def resolve_dsr(dsr_id: int, body: DSRResolveIn, db: Session = Depends(get_db),
                current_user: User = Depends(guard_admin)):
    dsr = db.query(DataSubjectRequest).filter(DataSubjectRequest.id == dsr_id).first()
    if not dsr:
        raise HTTPException(status_code=404, detail="DSR not found")
    try:
        dsr.status = DSRStatusEnum(body.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")
    dsr.resolved_at = datetime.utcnow()
    dsr.resolved_by = current_user.id
    dsr.resolution_notes = body.resolution_notes
    db.commit()
    # Notify user
    try:
        user = db.query(User).filter(User.id == dsr.user_id).first()
        if user:
            from app.email_utils import send_email, _BASE
            html = _BASE.format(body=f"""
              <h2 style="color:#BFFF00;margin:0 0 8px;">Data Request Update</h2>
              <p style="color:#aaa;">Hi {user.name}, your data request (DSR-{dsr.id:05d}) has been <b style="color:#fff;">{body.status.replace('_',' ').title()}</b>.</p>
              {f'<p style="color:#aaa;">{body.resolution_notes}</p>' if body.resolution_notes else ''}
            """)
            send_email(user.email, f"Data Request {body.status.title()} — FluentFusion", html)
    except Exception:
        pass
    return {"ok": True}

# ── PULSE Feedback ────────────────────────────────────────────────────────

@router.post("/pulse-feedback")
def submit_pulse_feedback(body: PulseFeedbackIn, db: Session = Depends(get_db),
                          current_user: User = Depends(guard_any)):
    try:
        cs = PulseStateEnum(body.current_state)
        urs = PulseStateEnum(body.user_reported_state) if body.user_reported_state else None
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid pulse state")
    fb = PulseStateFeedback(
        user_id=current_user.id,
        current_state=cs,
        disagreed=body.disagreed,
        user_reported_state=urs,
        comment=body.comment,
    )
    db.add(fb)
    db.commit()
    return {"ok": True, "id": fb.id}

@router.get("/pulse-feedback/me")
def my_pulse_feedback(db: Session = Depends(get_db), current_user: User = Depends(guard_any)):
    items = db.query(PulseStateFeedback).filter(PulseStateFeedback.user_id == current_user.id)\
               .order_by(PulseStateFeedback.created_at.desc()).all()
    return [{"id": f.id, "current_state": f.current_state, "disagreed": f.disagreed,
             "user_reported_state": f.user_reported_state, "comment": f.comment,
             "created_at": f.created_at} for f in items]

@router.get("/pulse-feedback")
def all_pulse_feedback(db: Session = Depends(get_db), current_user: User = Depends(guard_admin)):
    total = db.query(PulseStateFeedback).count()
    by_state = {}
    for state in PulseStateEnum:
        by_state[state.value] = db.query(PulseStateFeedback).filter(
            PulseStateFeedback.current_state == state).count()
    recent = db.query(PulseStateFeedback).order_by(PulseStateFeedback.created_at.desc()).limit(50).all()
    return {
        "total": total,
        "by_state": by_state,
        "recent": [{"id": f.id, "user_id": f.user_id, "current_state": f.current_state,
                    "user_reported_state": f.user_reported_state, "comment": f.comment,
                    "created_at": f.created_at} for f in recent],
    }

# ── Processing Register ───────────────────────────────────────────────────

@router.get("/processing-register")
def get_processing_register(db: Session = Depends(get_db),
                             current_user: User = Depends(guard_admin)):
    items = db.query(ProcessingActivityLog).order_by(ProcessingActivityLog.activity_name).all()
    return [{"id": i.id, "activity_name": i.activity_name, "purpose": i.purpose,
             "legal_basis": i.legal_basis, "data_categories": i.data_categories,
             "data_subjects": i.data_subjects, "recipients": i.recipients,
             "retention_period": i.retention_period,
             "cross_border_transfer": i.cross_border_transfer,
             "safeguards": i.safeguards, "updated_at": i.updated_at} for i in items]

@router.post("/processing-register")
def upsert_processing_activity(body: ProcessingActivityIn, db: Session = Depends(get_db),
                                current_user: User = Depends(guard_admin)):
    item = ProcessingActivityLog(**body.dict())
    db.add(item)
    db.commit()
    return {"ok": True, "id": item.id}

# ── Ethics Change Log ─────────────────────────────────────────────────────

@router.post("/ethics-change-log")
def log_ethics_change(body: EthicsChangeIn, db: Session = Depends(get_db),
                      current_user: User = Depends(guard_admin)):
    entry = EthicsChangeLog(
        change_type=body.change_type,
        description=body.description,
        notified_rec=body.notify_rec,
        created_by=current_user.id,
        notification_sent_at=datetime.utcnow() if body.notify_rec else None,
    )
    db.add(entry)
    db.commit()
    if body.notify_rec:
        try:
            from app.email_utils import send_email, _BASE
            html = _BASE.format(body=f"""
              <h2 style="color:#BFFF00;margin:0 0 8px;">Ethics Change Notification</h2>
              <p style="color:#aaa;">FluentFusion has logged an ethics change that requires REC notification.</p>
              <div style="background:#111;border-radius:10px;padding:16px;margin:16px 0;">
                <div style="color:#888;font-size:12px;margin-bottom:4px;">Change Type</div>
                <div style="color:#fff;font-weight:600;">{body.change_type}</div>
                <div style="color:#888;font-size:12px;margin-top:12px;margin-bottom:4px;">Description</div>
                <div style="color:#ddd;">{body.description}</div>
                <div style="color:#888;font-size:12px;margin-top:12px;margin-bottom:4px;">Logged by</div>
                <div style="color:#ddd;">{current_user.name} ({current_user.email})</div>
                <div style="color:#888;font-size:12px;margin-top:12px;margin-bottom:4px;">Timestamp</div>
                <div style="color:#ddd;">{datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</div>
              </div>
              <p style="color:#555;font-size:12px;">REC Approval Reference: J26BSE087</p>
            """)
            send_email(REC_EMAIL, f"[FluentFusion] Ethics Change: {body.change_type}", html)
        except Exception:
            pass
    return {"ok": True, "id": entry.id}

@router.get("/ethics-change-log")
def get_ethics_change_log(db: Session = Depends(get_db),
                          current_user: User = Depends(guard_admin)):
    entries = db.query(EthicsChangeLog).order_by(EthicsChangeLog.created_at.desc()).all()
    return [{"id": e.id, "change_type": e.change_type, "description": e.description,
             "notified_rec": e.notified_rec, "notification_sent_at": e.notification_sent_at,
             "created_at": e.created_at, "created_by": e.created_by} for e in entries]

# ── Documents ─────────────────────────────────────────────────────────────

@router.get("/documents/{doc_type}")
def get_document(doc_type: str):
    doc = DOCUMENTS.get(doc_type)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_type}' not found")
    return doc

# ── Overview stats (admin) ────────────────────────────────────────────────

@router.get("/overview")
def ethics_overview(db: Session = Depends(get_db), current_user: User = Depends(guard_admin)):
    return {
        "rec_approval": {"code": "J26BSE087", "status": "Active", "valid_to": "06 August 2026"},
        "total_consent_records": db.query(ConsentRecord).count(),
        "pending_dsrs": db.query(DataSubjectRequest).filter(
            DataSubjectRequest.status == DSRStatusEnum.pending).count(),
        "pending_pulse_feedback": db.query(PulseStateFeedback).count(),
        "ethics_change_log_count": db.query(EthicsChangeLog).count(),
        "processing_activities": db.query(ProcessingActivityLog).count(),
    }
