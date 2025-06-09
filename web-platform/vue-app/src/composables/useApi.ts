import { ref } from 'vue'
import type { ApiResponse, ApiError } from '@/types'
import { ErrorHandler } from '@/utils/error-handler'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  showError?: boolean
}

export function useApi<T>() {
  const data = ref<T | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)
  const isSuccess = ref(false)

  const execute = async (
    promise: Promise<ApiResponse<T>>,
    options: UseApiOptions<T> = {}
  ) => {
    const { onSuccess, onError, showError = true } = options

    isLoading.value = true
    isError.value = false
    isSuccess.value = false
    error.value = null

    try {
      const response = await promise
      data.value = response.data
      isSuccess.value = true
      onSuccess?.(response.data)
      return response.data
    } catch (err) {
      error.value = err as ApiError
      isError.value = true
      onError?.(err as ApiError)
      if (showError) {
        ErrorHandler.handle(err)
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    isLoading.value = false
    isError.value = false
    isSuccess.value = false
  }

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    reset
  }
} 