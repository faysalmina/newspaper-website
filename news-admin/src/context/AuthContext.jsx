import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/me')
      .then(res => {
        setUser(res.data)
        sessionStorage.setItem('auth_user', JSON.stringify(res.data))
      })
      .catch(() => {
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    sessionStorage.setItem('auth_token', res.data.token)
    sessionStorage.setItem('auth_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // ignore — যেভাবেই হোক লোকাল স্টেট ক্লিয়ার করব
    }
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
    setUser(null)
  }

  const isSuperAdmin = user?.role === 'super_admin'

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isSuperAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext(AuthContext)
}
