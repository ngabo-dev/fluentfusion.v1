"""
Redis Session Store for FluentFusion
Handles session management, token blacklisting, and caching with Redis
Falls back to in-memory storage if Redis is not available.
"""
import os
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# Try to import Redis, fall back to None if not available
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis = None

# Redis connection settings
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))


class InMemorySessionStore:
    """In-memory fallback when Redis is not available"""
    
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.blacklist: Dict[str, float] = {}
        self.online: Dict[str, float] = {}
        self.activity: Dict[str, str] = {}
        self.cache: Dict[str, tuple[str, float]] = {}
    
    def _key(self, key: str) -> str:
        return f"fluentfusion:{key}"
    
    def create_session(self, session_id: str, data: Dict[str, Any], expire_seconds: int = 86400) -> bool:
        self.sessions[session_id] = {"data": data, "expire": datetime.utcnow().timestamp() + expire_seconds}
        return True
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        if session_id in self.sessions:
            session = self.sessions[session_id]
            if session["expire"] > datetime.utcnow().timestamp():
                return session["data"]
            else:
                del self.sessions[session_id]
        return None
    
    def update_session(self, session_id: str, data: Dict[str, Any]) -> bool:
        if session_id in self.sessions:
            self.sessions[session_id]["data"].update(data)
            return True
        return False
    
    def delete_session(self, session_id: str) -> bool:
        self.sessions.pop(session_id, None)
        return True
    
    def refresh_session(self, session_id: str, expire_seconds: int = 86400) -> bool:
        if session_id in self.sessions:
            self.sessions[session_id]["expire"] = datetime.utcnow().timestamp() + expire_seconds
            return True
        return False
    
    def blacklist_token(self, jti: str, expire_seconds: int = 86400) -> bool:
        self.blacklist[jti] = datetime.utcnow().timestamp() + expire_seconds
        return True
    
    def is_token_blacklisted(self, jti: str) -> bool:
        if jti in self.blacklist:
            if self.blacklist[jti] > datetime.utcnow().timestamp():
                return True
            else:
                del self.blacklist[jti]
        return False
    
    def set_user_online(self, user_id: str) -> bool:
        self.online[user_id] = datetime.utcnow().timestamp() + 300
        return True
    
    def set_user_offline(self, user_id: str) -> bool:
        self.online.pop(user_id, None)
        return True
    
    def is_user_online(self, user_id: str) -> bool:
        if user_id in self.online:
            if self.online[user_id] > datetime.utcnow().timestamp():
                return True
            else:
                del self.online[user_id]
        return False
    
    def get_last_activity(self, user_id: str) -> Optional[str]:
        return self.activity.get(user_id)
    
    def update_last_activity(self, user_id: str) -> bool:
        self.activity[user_id] = datetime.utcnow().isoformat()
        return True
    
    def cache_set(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        self.cache[key] = (json.dumps(value), datetime.utcnow().timestamp() + expire_seconds)
        return True
    
    def cache_get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            data, expire = self.cache[key]
            if expire > datetime.utcnow().timestamp():
                return json.loads(data)
            else:
                del self.cache[key]
        return None
    
    def cache_delete(self, key: str) -> bool:
        self.cache.pop(key, None)
        return True
    
    def cache_invalidate_pattern(self, pattern: str) -> int:
        count = 0
        keys_to_delete = []
        for key in self.cache.keys():
            if pattern.replace("*", "") in key:
                keys_to_delete.append(key)
        for key in keys_to_delete:
            del self.cache[key]
            count += 1
        return count
    
    def check_rate_limit(self, identifier: str, limit: int = 10, window_seconds: int = 60) -> tuple:
        return True, limit, window_seconds
    
    def ping(self) -> bool:
        return True


class RedisSessionStore:
    """Redis-based session store for managing user sessions and caching"""
    
    def __init__(self):
        self.client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True
        )
        self.prefix = "fluentfusion:"
    
    def _key(self, key: str) -> str:
        return f"{self.prefix}{key}"
    
    def create_session(self, session_id: str, data: Dict[str, Any], expire_seconds: int = 86400) -> bool:
        try:
            key = self._key(f"session:{session_id}")
            self.client.setex(key, expire_seconds, json.dumps(data))
            return True
        except Exception:
            return False
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        try:
            key = self._key(f"session:{session_id}")
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception:
            return None
    
    def update_session(self, session_id: str, data: Dict[str, Any]) -> bool:
        try:
            key = self._key(f"session:{session_id}")
            if self.client.exists(key):
                existing = self.get_session(session_id)
                if existing:
                    existing.update(data)
                    self.client.setex(key, 86400, json.dumps(existing))
                    return True
            return False
        except Exception:
            return False
    
    def delete_session(self, session_id: str) -> bool:
        try:
            key = self._key(f"session:{session_id}")
            self.client.delete(key)
            return True
        except Exception:
            return False
    
    def refresh_session(self, session_id: str, expire_seconds: int = 86400) -> bool:
        try:
            key = self._key(f"session:{session_id}")
            if self.client.exists(key):
                self.client.expire(key, expire_seconds)
                return True
            return False
        except Exception:
            return False
    
    def blacklist_token(self, jti: str, expire_seconds: int = 86400) -> bool:
        try:
            key = self._key(f"blacklist:{jti}")
            self.client.setex(key, expire_seconds, "1")
            return True
        except Exception:
            return False
    
    def is_token_blacklisted(self, jti: str) -> bool:
        try:
            key = self._key(f"blacklist:{jti}")
            return self.client.exists(key) > 0
        except Exception:
            return False
    
    def set_user_online(self, user_id: str) -> bool:
        try:
            key = self._key(f"online:{user_id}")
            self.client.setex(key, 300, "1")
            return True
        except Exception:
            return False
    
    def set_user_offline(self, user_id: str) -> bool:
        try:
            key = self._key(f"online:{user_id}")
            self.client.delete(key)
            return True
        except Exception:
            return False
    
    def is_user_online(self, user_id: str) -> bool:
        try:
            key = self._key(f"online:{user_id}")
            return self.client.exists(key) > 0
        except Exception:
            return False
    
    def get_last_activity(self, user_id: str) -> Optional[str]:
        try:
            key = self._key(f"activity:{user_id}")
            return self.client.get(key)
        except Exception:
            return None
    
    def update_last_activity(self, user_id: str) -> bool:
        try:
            key = self._key(f"activity:{user_id}")
            self.client.setex(key, 86400, datetime.utcnow().isoformat())
            return True
        except Exception:
            return False
    
    def cache_set(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        try:
            cache_key = self._key(f"cache:{key}")
            self.client.setex(cache_key, expire_seconds, json.dumps(value))
            return True
        except Exception:
            return False
    
    def cache_get(self, key: str) -> Optional[Any]:
        try:
            cache_key = self._key(f"cache:{key}")
            data = self.client.get(cache_key)
            if data:
                return json.loads(data)
            return None
        except Exception:
            return None
    
    def cache_delete(self, key: str) -> bool:
        try:
            cache_key = self._key(f"cache:{key}")
            self.client.delete(cache_key)
            return True
        except Exception:
            return False
    
    def cache_invalidate_pattern(self, pattern: str) -> int:
        try:
            pattern_key = self._key(f"cache:{pattern}")
            keys = self.client.keys(pattern_key)
            if keys:
                return self.client.delete(*keys)
            return 0
        except Exception:
            return 0
    
    def check_rate_limit(self, identifier: str, limit: int = 10, window_seconds: int = 60) -> tuple:
        try:
            key = self._key(f"ratelimit:{identifier}")
            current = self.client.get(key)
            
            if current is None:
                self.client.setex(key, window_seconds, "1")
                return True, limit - 1, window_seconds
            
            count = int(current)
            if count >= limit:
                ttl = self.client.ttl(key)
                return False, 0, ttl
            
            self.client.incr(key)
            return True, limit - count - 1, self.client.ttl(key)
        except Exception:
            return True, limit, 60
    
    def ping(self) -> bool:
        try:
            return self.client.ping()
        except Exception:
            return False


# Global instance - use Redis if available, otherwise in-memory fallback
if REDIS_AVAILABLE:
    try:
        session_store = RedisSessionStore()
        if session_store.ping():
            print("Redis connected successfully")
        else:
            print("Redis ping failed, falling back to in-memory storage")
            session_store = InMemorySessionStore()
    except Exception as e:
        print(f"Redis connection error: {e}, falling back to in-memory storage")
        session_store = InMemorySessionStore()
else:
    print("Redis not installed, using in-memory storage")
    session_store = InMemorySessionStore()
