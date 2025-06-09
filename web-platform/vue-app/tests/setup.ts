import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
})
window.IntersectionObserver = mockIntersectionObserver

// Mock ResizeObserver
const mockResizeObserver = vi.fn()
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
})
window.ResizeObserver = mockResizeObserver

// Global test configuration
config.global.mocks = {
  $t: (key: string) => key,
  $route: {
    path: '/',
    query: {}
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn()
  }
}

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
}) 