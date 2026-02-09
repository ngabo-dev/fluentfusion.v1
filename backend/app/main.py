"""
FluentFusion API - Main Application Entry Point

An AI-Driven Language Learning Platform for Rwanda's Tourism Sector

This FastAPI application provides:
- User authentication (JWT)
- Lesson management
- Progress tracking
- Personalized recommendations
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routes import auth, lessons, progress

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

# Create FastAPI application
app = FastAPI(
    title="FluentFusion API",
    description="""
    FluentFusion - AI-Driven Language Learning Platform for Rwanda's Tourism Sector
    
    ## Features
    
    - **User Authentication**: Register, login, and profile management
    - **Lessons**: Browse and access Kinyarwanda/English lessons
    - **Progress Tracking**: Track lesson completion and scores
    - **Recommendations**: Personalized lesson recommendations
    
    ## User Types
    
    - **Tourists**: Learn Kinyarwanda for their Rwanda visit
    - **Tourism Workers**: Learn English/French to serve international visitors
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(lessons.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint - API welcome message"""
    return {
        "name": "FluentFusion API",
        "version": "1.0.0",
        "description": "AI-Driven Language Learning Platform for Rwanda's Tourism Sector",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
