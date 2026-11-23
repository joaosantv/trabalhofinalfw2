import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api, { STORAGE_KEYS } from '../services/api'

const AuthContext = createContext(null)

function readUser() {
  const token = localStorage.getItem('token')
  if (!token) return null
  return { token, nome: localStorage.getItem('nome') || '', email: localStorage.getItem('email') || '' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const persist = useCallback((data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('nome', data.nome)
    localStorage.setItem('email', data.email)
    setUser({ token: data.token, nome: data.nome, email: data.email })
  }, [])

  const login = useCallback(
    async ({ email, senha }) => {
      const { data } = await api.post('/auth/login', { email, senha })
      persist(data)
    },
    [persist],
  )

  const register = useCallback(
    async ({ nome, email, senha }) => {
      const { data } = await api.post('/auth/register', { nome, email, senha })
      persist(data)
    },
    [persist],
  )

  const logout = useCallback(() => {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k))
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
