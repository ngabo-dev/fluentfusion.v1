import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi, setupInactivityListeners } from '../api/client'

interface User { id: number; name: string; email: string; role: string; avatar_initials?: string; xp?: number; [key: string]: any }
interface AuthCtx {
  token: string | null
  user: User | null
  ready: boolean
  login: (email: string, pw: string, remember?: boolean) => Promise<any>
  loginWithToken: (token: string, user: { id: number; name: string; role: string }) => void
  register: (name: string, email: string, pw: string, role?: string) => Promise<any>
  logout: () => void
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('ff_access_token') || sessionStorage.getItem('ff_access_token')
  )
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('ff_user') || sessionStorage.getItem('ff_user')
      return JSON.parse(s || 'null')
    } catch { return null }
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('ff_access_token') || sessionStorage.getItem('ff_access_token')
    if (!storedToken) { setReady(true); return }

    // Validate token against backend on every app load
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')
    fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(r => {
        if (!r.ok) throw new Error('invalid')
        return r.json()
      })
      .then(data => {
        const updated = { id: data.id, name: data.name, email: data.email, role: data.role, avatar_initials: data.avatar_initials }
        const storage = sessionStorage.getItem('ff_access_token') ? sessionStorage : localStorage
        storage.setItem('ff_user', JSON.stringify(updated))
        setUser(updated)
        // Start inactivity timer now that we know the session is valid
        setupInactivityListeners()
      })
      .catch(() => {
        // Token invalid — clear everything and force login
        authApi.logout()
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  // Periodic JWT expiry check — every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const t = localStorage.getItem('ff_access_token') || sessionStorage.getItem('ff_access_token')
      if (!t) return
      const expiry = localStorage.getItem('ff_token_expiry') || sessionStorage.getItem('ff_token_expiry')
      if (expiry && Date.now() >= parseInt(expiry, 10)) {
        authApi.logout()
        setToken(null)
        setUser(null)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?reason=expired'
        }
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  async function login(email: string, password: string, remember = true) {
    const res = await authApi.login({ email, password, remember })
    setToken(res.access_token)
    setUser(res.user)
    return res
  }

  function loginWithToken(accessToken: string, userData: { id: number; name: string; role: string }) {
    const u = { id: userData.id, name: userData.name, email: '', role: userData.role, avatar_initials: (userData.name.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)) }
    localStorage.setItem('ff_access_token', accessToken)
    localStorage.setItem('ff_user', JSON.stringify(u))
    setToken(accessToken)
    setUser(u)
    setupInactivityListeners()
  }

  async function register(name: string, email: string, password: string, role = 'student') {
    const res = await authApi.register({ email, password, full_name: name, role })
    return res
  }

  function logout() {
    authApi.logout()
    setToken(null)
    setUser(null)
  }

  return <Ctx.Provider value={{ token, user, ready, login, loginWithToken, register, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
