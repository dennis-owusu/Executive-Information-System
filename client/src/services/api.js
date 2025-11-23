import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  return data.user
}

export async function getMe() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('no')
  const { data } = await api.get('/auth/me')
  return data.user
}

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get('/products', { params })
    return data
  } catch {
    const { listProducts } = await import('./mockApi.js')
    return listProducts(params)
  }
}

export async function createProduct(formData) {
  const { data } = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function getSalesSummary(params = {}) {
  try {
    const { data } = await api.get('/analytics/sales/summary', { params })
    return data
  } catch {
    const { salesSummary } = await import('./mockApi.js')
    return salesSummary(params)
  }
}

export async function getOperationsSummary() {
  try {
    const { data } = await api.get('/analytics/operations/summary')
    return data
  } catch {
    const { operationsSummary } = await import('./mockApi.js')
    return operationsSummary()
  }
}
