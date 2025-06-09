import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export function useApi() {
  const get = async (url, params = {}) => {
    try {
      const response = await api.get(url, { params })
      return response
    } catch (error) {
      throw error
    }
  }

  const post = async (url, data = {}) => {
    try {
      const response = await api.post(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  const put = async (url, data = {}) => {
    try {
      const response = await api.put(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  const del = async (url) => {
    try {
      const response = await api.delete(url)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    get,
    post,
    put,
    del
  }
} 