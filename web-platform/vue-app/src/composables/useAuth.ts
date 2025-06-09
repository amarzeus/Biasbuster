import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useApi } from './useApi'
import type { LoginCredentials, RegisterData } from '@/types'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()
  const { execute: executeApi, isLoading, error } = useApi()

  const isAuthenticated = computed(() => userStore.isAuthenticated)
  const user = computed(() => userStore.user)
  const preferences = computed(() => userStore.preferences)

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await executeApi(userStore.login(credentials))
      router.push('/dashboard')
      return response
    } catch (err) {
      throw err
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await executeApi(userStore.register(data))
      router.push('/dashboard')
      return response
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await executeApi(userStore.logout())
      router.push('/login')
    } catch (err) {
      throw err
    }
  }

  const updateProfile = async (data: Partial<typeof user.value>) => {
    try {
      const response = await executeApi(userStore.updateProfile(data))
      return response
    } catch (err) {
      throw err
    }
  }

  const updatePreferences = async (data: Partial<typeof preferences.value>) => {
    try {
      const response = await executeApi(userStore.updatePreferences(data))
      return response
    } catch (err) {
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await executeApi(userStore.resetPassword(email))
      return response
    } catch (err) {
      throw err
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const response = await executeApi(userStore.verifyEmail(token))
      return response
    } catch (err) {
      throw err
    }
  }

  return {
    isAuthenticated,
    user,
    preferences,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    resetPassword,
    verifyEmail
  }
} 