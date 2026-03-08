"""
Rate Limiting Middleware
Provides request rate limiting based on IP address.
"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
import logging

from ..utils.redis_client import redis_client
from ..config import settings

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using Redis.
    Limits requests per IP address within a time window.
    """
    
    # Endpoints that should not be rate limited
    EXCLUDED_PATHS = [
        "/",
        "/health",
        "/docs",
        "/redoc",
        "/openapi.json",
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting if disabled or for excluded paths
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
        
        # Check if path is excluded
        if any(request.url.path.startswith(path) for path in self.EXCLUDED_PATHS):
            return await call_next(request)
        
        # Get client IP
        client_ip = self._get_client_ip(request)
        
        # Check rate limit - skip if Redis unavailable
        try:
            is_allowed, remaining = await redis_client.check_rate_limit(
                key=f"ip:{client_ip}",
                limit=settings.RATE_LIMIT_REQUESTS,
                window=settings.RATE_LIMIT_PERIOD
            )
        except Exception as e:
            logger.warning(f"Rate limiting unavailable (Redis error): {e}")
            # Allow request if Redis is unavailable
            return await call_next(request)
        
        if not is_allowed:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Too Many Requests",
                    "message": f"Rate limit exceeded. Please try again later.",
                    "retry_after": settings.RATE_LIMIT_PERIOD
                }
            )
        
        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_REQUESTS)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(settings.RATE_LIMIT_PERIOD)
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request, considering proxies."""
        # Check for forwarded header (when behind proxy)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        # Check for real IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fall back to direct client IP
        if request.client:
            return request.client.host
        
        return "unknown"
