"""
Redis utilities for session management and caching.
"""
import redis.asyncio as aioredis
import json
import logging
from typing import Optional, Any
from datetime import datetime, timedelta

from ..config import settings

logger = logging.getLogger(__name__)


class RedisClient:
    """Async Redis client wrapper for session management and caching."""
    
    def __init__(self):
        self._client: Optional[aioredis.Redis] = None
        self._available: bool = True
    
    async def is_available(self) -> bool:
        """Check if Redis is available."""
        try:
            client = await self.get_client()
            if client is None:
                return False
            await client.ping()
            return True
        except Exception as e:
            logger.warning(f"Redis not available: {e}. Auth will work without session storage.")
            self._available = False
            return False
    
    @property
    async def redis(self) -> Optional[aioredis.Redis]:
        """Get Redis client for direct operations."""
        return await self.get_client()
    
    async def get_client(self) -> Optional[aioredis.Redis]:
        """Get or create Redis client connection. Returns None if unavailable."""
        if self._client is None:
            try:
                self._client = aioredis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
                # Test the connection
                await self._client.ping()
                logger.info("Redis connection established")
            except Exception as e:
                logger.warning(f"Redis not available: {e}. Application will continue without Redis.")
                self._client = None
                self._available = False
                return None
        return self._client
    
    async def close(self):
        """Close Redis connection."""
        if self._client:
            await self._client.close()
            self._client = None
    
    # ── Session Management ─────────────────────────────────────────────────
    
    async def create_session(self, session_id: str, user_id: str, session_data: dict, expires_in: int = 86400) -> Optional[str]:
        """
        Create a new session for a user.
        
        Args:
            session_id: Unique session identifier (e.g., JTI)
            user_id: The user's ID as string
            session_data: Session data to store
            expires_in: Session expiry in seconds (default: 24 hours)
        
        Returns:
            Session ID or None if Redis unavailable
        """
        client = await self.get_client()
        if client is None:
            logger.warning("Redis unavailable - session not created")
            return None
        
        session_key = f"session:{user_id}:{session_id}"
        
        # Store session data
        session_data["created_at"] = datetime.utcnow().isoformat()
        session_data["session_id"] = session_id
        session_data["user_id"] = user_id
        
        await client.setex(
            session_key,
            expires_in,
            json.dumps(session_data)
        )
        
        # Track all user sessions
        await client.sadd(f"user_sessions:{user_id}", session_key)
        
        logger.info(f"Created session for user {user_id}")
        return session_id
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """
        Get session data by session ID (searches all user sessions).
        
        Args:
            session_id: The session ID (JTI)
        
        Returns:
            Session data if exists, None otherwise
        """
        client = await self.get_client()
        if client is None:
            return None
        
        # Scan for session key
        async for key in client.scan_iter(f"session:*:{session_id}"):
            data = await client.get(key)
            if data:
                return json.loads(data)
        return None
    
    async def get_session_by_key(self, user_id: str, session_id: str) -> Optional[dict]:
        """
        Get session data for a specific user and session.
        
        Args:
            user_id: The user's ID as string
            session_id: The session ID
        
        Returns:
            Session data if exists, None otherwise
        """
        client = await self.get_client()
        if client is None:
            return None
        
        session_key = f"session:{user_id}:{session_id}"
        data = await client.get(session_key)
        
        if data:
            return json.loads(data)
        return None
    
    async def refresh_session(self, user_id: str, session_id: str, expires_in: int = 86400) -> bool:
        """
        Refresh session expiry.
        
        Args:
            user_id: The user's ID as string
            session_id: The session ID
            expires_in: New expiry in seconds
        
        Returns:
            True if refreshed, False otherwise
        """
        client = await self.get_client()
        if client is None:
            return False
        
        session_key = f"session:{user_id}:{session_id}"
        return await client.expire(session_key, expires_in)
    
    async def delete_session(self, session_id: str) -> bool:
        """
        Delete a session by session ID.
        
        Args:
            session_id: The session ID to delete
        
        Returns:
            True if deleted, False otherwise
        """
        client = await self.get_client()
        if client is None:
            return False
        
        # Find and delete the session
        async for key in client.scan_iter(f"session:*:{session_id}"):
            # Extract user_id from key
            parts = key.split(":")
            if len(parts) >= 3:
                user_id = parts[1]
                result = await client.delete(key)
                await client.srem(f"user_sessions:{user_id}", key)
                logger.info(f"Deleted session {session_id[:20]}... for user {user_id}")
                return result > 0
        return False
    
    async def delete_user_sessions(self, user_id: str) -> int:
        """
        Delete all sessions for a user (logout from all devices).
        
        Args:
            user_id: The user's ID as string
        
        Returns:
            Number of sessions deleted
        """
        client = await self.get_client()
        if client is None:
            return 0
        
        # Get all session keys for user
        session_keys = await client.smembers(f"user_sessions:{user_id}")
        
        if session_keys:
            # Delete all sessions
            await client.delete(*session_keys)
            # Remove the sessions set
            await client.delete(f"user_sessions:{user_id}")
        
        logger.info(f"Deleted all sessions for user {user_id}")
        return len(session_keys) if session_keys else 0
    
    async def get_user_sessions(self, user_id: str) -> list:
        """
        Get all active sessions for a user.
        
        Args:
            user_id: The user's ID as string
        
        Returns:
            List of session data
        """
        client = await self.get_client()
        if client is None:
            return []
        
        session_keys = await client.smembers(f"user_sessions:{user_id}")
        
        sessions = []
        for key in session_keys:
            data = await client.get(key)
            if data:
                sessions.append(json.loads(data))
        
        return sessions
    
    # ── Token Blacklisting ────────────────────────────────────────────────
    
    async def blacklist_token(self, jti: str, expires_in: int) -> bool:
        """
        Add a token to the blacklist.
        
        Args:
            jti: JWT ID (unique identifier)
            expires_in: Token expiry in seconds
        
        Returns:
            True if blacklisted successfully
        """
        client = await self.get_client()
        if client is None:
            logger.warning("Redis unavailable - token not blacklisted")
            return False
        
        blacklist_key = f"blacklist:{jti}"
        await client.setex(blacklist_key, expires_in, "1")
        
        logger.info(f"Blacklisted token {jti[:20]}...")
        return True
    
    async def is_token_blacklisted(self, jti: str) -> bool:
        """
        Check if a token is blacklisted.
        
        Args:
            jti: JWT ID
        
        Returns:
            True if blacklisted, False otherwise
        """
        client = await self.get_client()
        if client is None:
            # If Redis unavailable, assume not blacklisted
            return False
        
        blacklist_key = f"blacklist:{jti}"
        result = await client.exists(blacklist_key)
        
        return result > 0
    
    # ── Rate Limiting ────────────────────────────────────────────────────
    
    async def check_rate_limit(self, key: str, limit: int, window: int) -> tuple[bool, int]:
        """
        Check if rate limit is exceeded.
        
        Args:
            key: Rate limit key (e.g., "ip:192.168.1.1")
            limit: Maximum requests allowed
            window: Time window in seconds
        
        Returns:
            Tuple of (is_allowed, remaining_requests)
        """
        client = await self.get_client()
        if client is None:
            # If Redis unavailable, allow all requests
            return True, limit
        
        rate_key = f"rate_limit:{key}"
        
        # Get current count
        current = await client.get(rate_key)
        
        if current is None:
            # First request
            await client.setex(rate_key, window, 1)
            return True, limit - 1
        
        current_count = int(current)
        
        if current_count >= limit:
            # Rate limit exceeded
            return False, 0
        
        # Increment counter
        await client.incr(rate_key)
        return True, limit - current_count - 1
    
    async def get_rate_limit_remaining(self, key: str) -> int:
        """
        Get remaining requests for a key.
        
        Args:
            key: Rate limit key
        
        Returns:
            Remaining requests (0 if expired)
        """
        client = await self.get_client()
        if client is None:
            return 0
        
        rate_key = f"rate_limit:{key}"
        current = await client.get(rate_key)
        
        return int(current) if current else 0
    
    # ── Generic Caching ────────────────────────────────────────────────────
    
    async def cache_set(self, key: str, value: Any, expires_in: int = 3600) -> bool:
        """
        Set a cache value.
        
        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            expires_in: Expiry in seconds (default: 1 hour)
        
        Returns:
            True if cached successfully
        """
        client = await self.get_client()
        if client is None:
            return False
        
        await client.setex(
            f"cache:{key}",
            expires_in,
            json.dumps(value)
        )
        return True
    
    async def cache_get(self, key: str) -> Optional[Any]:
        """
        Get a cached value.
        
        Args:
            key: Cache key
        
        Returns:
            Cached value if exists, None otherwise
        """
        client = await self.get_client()
        if client is None:
            return None
        
        data = await client.get(f"cache:{key}")
        
        if data:
            return json.loads(data)
        return None
    
    async def cache_delete(self, key: str) -> bool:
        """
        Delete a cache value.
        
        Args:
            key: Cache key
        
        Returns:
            True if deleted
        """
        client = await self.get_client()
        if client is None:
            return False
        
        result = await client.delete(f"cache:{key}")
        return result > 0
    
    async def cache_clear_pattern(self, pattern: str) -> int:
        """
        Clear all cache keys matching a pattern.
        
        Args:
            pattern: Key pattern (e.g., "user:*")
        
        Returns:
            Number of keys deleted
        """
        client = await self.get_client()
        if client is None:
            return 0
        
        # Find matching keys
        keys = []
        async for key in client.scan_iter(f"cache:{pattern}"):
            keys.append(key)
        
        if keys:
            return await client.delete(*keys)
        return 0


# Singleton instance
redis_client = RedisClient()
