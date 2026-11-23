import axios from 'axios'

export const STORAGE_KEYS = ['token', 'nome', 'email']

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Coloca o token JWT no header Authorization de cada requisicao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se der 401 fora das telas de login/cadastro, limpa o storage e manda para /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    if (status === 401 && !url.startsWith('/auth/')) {
      STORAGE_KEYS.forEach((k) => localStorage.removeItem(k))
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
