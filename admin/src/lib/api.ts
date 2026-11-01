// Ecozza Green Admin API URL Resolver
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE ? `${API_BASE}${cleanPath}` : cleanPath
}
