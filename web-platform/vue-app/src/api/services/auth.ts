import { get, post } from '../client'
import type { User } from '@/types'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData extends LoginCredentials {
  name: string
}

interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await post<AuthResponse>('/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await post<AuthResponse>('/auth/register', data)
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  async logout(): Promise<void> {
    await post('/auth/logout')
    localStorage.removeItem('token')
  },

  async getCurrentUser(): Promise<User> {
    const response = await get<User>('/auth/me')
    return response.data
  },

  async forgotPassword(email: string): Promise<void> {
    await post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await post('/auth/reset-password', { token, password })
  }
} 