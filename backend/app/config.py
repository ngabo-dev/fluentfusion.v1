"""
Unified configuration for FluentFusion + PULSE.
All settings can be overridden via environment variables or .env file.
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import model_validator


class Settings(BaseSettings):
    # ── App
    APP_NAME: str = "FluentFusion AI"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # ── Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/fluentfusion")

    # ── Redis / Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # ── JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @model_validator(mode="after")
    def validate_jwt_key(self) -> "Settings":
        if self.ENVIRONMENT == "production" and (
            not self.JWT_SECRET_KEY or self.JWT_SECRET_KEY == "dev-secret-key-change-in-production"
        ):
            raise ValueError("JWT_SECRET_KEY must be set to a secure value in production")
        return self

    # ── CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "https://fluentfusion.app",
    ]
    
    # ── Security
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]

    # ── Email
    EMAIL_ENABLED: bool = False
    EMAIL_PROVIDER: str = "smtp"   # smtp | sendgrid | ses
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "noreply@fluentfusion.com")
    FROM_NAME: str = "FluentFusion AI"
    # SendGrid
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    SENDGRID_FROM_EMAIL: str = os.getenv("SENDGRID_FROM_EMAIL", "noreply@fluentfusion.com")

    # ── AWS S3
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "fluentfusion")
    S3_PUBLIC_URL: str = os.getenv("S3_PUBLIC_URL", "https://s3.amazonaws.com/fluentfusion")

    # ── Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    # ── OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # ── Admin
    ADMIN_EMAILS: List[str] = ["admin@fluentfusion.com"]

    # ── Rate Limiting
    RATE_LIMIT_ENABLED: bool = False
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60   # seconds
    
    # ── Frontend URL (for emails, etc.)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # ── PULSE ML — artifact paths
    # Defaults resolve relative to project root; override via env vars in production.
    _base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    PULSE_MODEL_PATH: str = os.getenv(
        "PULSE_MODEL_PATH",
        os.path.join(_base, "pulse_artifacts", "pulse_model.pkl")
    )
    PULSE_SCALER_PATH: str = os.getenv(
        "PULSE_SCALER_PATH",
        os.path.join(_base, "pulse_artifacts", "pulse_scaler.pkl")
    )
    PULSE_ENCODERS_PATH: str = os.getenv(
        "PULSE_ENCODERS_PATH",
        os.path.join(_base, "pulse_artifacts", "label_encoders.pkl")
    )
    PULSE_METADATA_PATH: str = os.getenv(
        "PULSE_METADATA_PATH",
        os.path.join(_base, "pulse_artifacts", "pulse_metadata.json")
    )
    PULSE_CONFIDENCE_THRESHOLD: float = 0.55
    PULSE_REEVAL_INTERVAL_HOURS: int = 24

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
