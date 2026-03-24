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

  useEffect(() => { setReady(true) }, [])

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
