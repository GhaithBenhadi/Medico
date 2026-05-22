import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('medico_user')
    const token = localStorage.getItem('medico_token')
    if (saved && token) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem('medico_token', token)
    localStorage.setItem('medico_user',  JSON.stringify(user))
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('medico_token')
    localStorage.removeItem('medico_user')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { user: fresh } = await authApi.me()
      localStorage.setItem('medico_user', JSON.stringify(fresh))
      setUser(fresh)
    } catch {}
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
