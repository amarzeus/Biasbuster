export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type Theme = 'light' | 'dark'

export type Language = 'en' | 'es' | 'fr' | 'de'

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  icon?: string
}

export interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface FormField {
  id: string
  name: string
  type: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  validation?: Record<string, unknown>
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
} 