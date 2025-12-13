import axios from 'axios'

const DEFAULT_API_URL = 'https://executive-information-system.onrender.com'
const apiBase = (() => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:4000'
  }
  return DEFAULT_API_URL
})()

const api = axios.create({
  baseURL: apiBase
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(email, password, role = 'user') {
  const { data } = await api.post('/auth/login', { email, password, role })
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data.user
}

export async function register(userData) {
  const { data } = await api.post('/auth/register', userData)
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
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
    // Fallback if backend /products fails (for dev resilience)
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

// Order & User API
export async function createOrder(orderData) {
  const { data } = await api.post('/api/orders', orderData)
  return data
}

export async function getMyOrders() {
  const { data } = await api.get('/api/orders/my-orders')
  return data
}

export async function getCustomers() {
  const { data } = await api.get('/api/users')
  return data
}

// Analytics (Keep mock fallback for now if no backend impl)
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

export async function getDashboardStats() {
  const { data } = await api.get('/dashboard/stats')
  return data
}

export async function getDashboardChartData() {
  const { data } = await api.get('/dashboard/chart-data')
  return data
}
