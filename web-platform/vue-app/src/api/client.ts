import axios from 'axios'
import type { ApiResponse, ApiError } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const apiError: ApiError = {
      code: error.response?.status?.toString() || 'UNKNOWN',
      message: error.response?.data?.message || 'An error occurred',
      details: error.response?.data?.details
    }
    return Promise.reject(apiError)
  }
)

export const get = async <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
  return api.get(url, { params })
}

export const post = async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
  return api.post(url, data)
}

export const put = async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
  return api.put(url, data)
}

export const del = async <T>(url: string): Promise<ApiResponse<T>> => {
  return api.delete(url)
}

export default api 