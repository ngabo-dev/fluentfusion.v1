from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.courses import router as courses_router
from routers.main_routers import (
    dashboard_router, enrollment_router, pulse_router,
    quiz_router, message_router, notification_router,
    payout_router, audit_router, settings_router, sessions_router
)

app = FastAPI(title="FluentFusion API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_tables()

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(courses_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(enrollment_router, prefix="/api")
app.include_router(pulse_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(message_router, prefix="/api")
app.include_router(notification_router, prefix="/api")
app.include_router(payout_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(settings_router, prefix="/api")
app.include_router(sessions_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "FluentFusion API"}
