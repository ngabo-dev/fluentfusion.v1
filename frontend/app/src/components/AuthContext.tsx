import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/client'

interface User { id: number; name: string; email: string; role: string; avatar_initials?: string; xp?: number; [key: string]: any }
interface AuthCtx {
  token: string | null
  user: User | null
  ready: boolean
  login: (email: string, pw: string, remember?: boolean) => Promise<any>
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
        // Token is valid — update user from server
        const updated = { id: data.id, name: data.name, email: data.email, role: data.role, avatar_initials: data.avatar_initials }
        const storage = sessionStorage.getItem('ff_access_token') ? sessionStorage : localStorage
        storage.setItem('ff_user', JSON.stringify(updated))
        setUser(updated)
      })
      .catch(() => {
        // Token invalid or backend unreachable — clear and force login
        authApi.logout()
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  async function login(email: string, password: string, remember = true) {
    const res = await authApi.login({ email, password, remember })
    setToken(res.access_token)
    setUser(res.user)
    return res
  }

  async function register(name: string, email: string, password: string, role = 'student') {
    const res = await authApi.register({ email, password, full_name: name, role })
    // Do NOT set token/user here — user must verify email first
    return res
  }

  function logout() {
    authApi.logout()
    setToken(null)
    setUser(null)
  }

  return <Ctx.Provider value={{ token, user, ready, login, register, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
