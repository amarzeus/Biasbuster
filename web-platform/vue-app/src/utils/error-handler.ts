import type { ApiError } from '@/types'
import { toast } from 'vue3-toastify'

export class ErrorHandler {
  static handle(error: unknown): void {
    if (this.isApiError(error)) {
      this.handleApiError(error)
    } else if (error instanceof Error) {
      this.handleGenericError(error)
    } else {
      this.handleUnknownError(error)
    }
  }

  private static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    )
  }

  private static handleApiError(error: ApiError): void {
    // Log error for monitoring
    console.error('API Error:', error)

    // Show user-friendly message
    toast.error(error.message)

    // Handle specific error codes
    switch (error.code) {
      case '401':
        // Handle unauthorized
        this.handleUnauthorized()
        break
      case '403':
        // Handle forbidden
        this.handleForbidden()
        break
      case '404':
        // Handle not found
        this.handleNotFound()
        break
      case '500':
        // Handle server error
        this.handleServerError()
        break
      default:
        // Handle other errors
        this.handleGenericError(new Error(error.message))
    }
  }

  private static handleGenericError(error: Error): void {
    console.error('Generic Error:', error)
    toast.error(error.message || 'An unexpected error occurred')
  }

  private static handleUnknownError(error: unknown): void {
    console.error('Unknown Error:', error)
    toast.error('An unexpected error occurred')
  }

  private static handleUnauthorized(): void {
    // Clear user session
    localStorage.removeItem('token')
    // Redirect to login
    window.location.href = '/login'
  }

  private static handleForbidden(): void {
    toast.error('You do not have permission to perform this action')
  }

  private static handleNotFound(): void {
    toast.error('The requested resource was not found')
  }

  private static handleServerError(): void {
    toast.error('A server error occurred. Please try again later')
  }
} 