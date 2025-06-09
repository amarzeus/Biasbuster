import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastNotification from '../ToastNotification.vue'
import { useToast } from '../../../composables/useToast'

// Mock the useToast composable
vi.mock('../../../composables/useToast', () => ({
  useToast: vi.fn(() => ({
    isVisible: true,
    message: 'Test message',
    type: 'success',
    hideToast: vi.fn()
  }))
}))

describe('ToastNotification.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders properly when visible', () => {
    const wrapper = mount(ToastNotification)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.isVisible()).toBe(true)
  })

  it('displays the correct message', () => {
    const wrapper = mount(ToastNotification)
    expect(wrapper.text()).toContain('Test message')
  })

  it('applies correct classes based on type', async () => {
    // Test success type
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Success message',
      type: 'success',
      hideToast: vi.fn()
    }))
    const successWrapper = mount(ToastNotification)
    expect(successWrapper.find('[data-test="toast"]').classes()).toContain('bg-green-500')

    // Test error type
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Error message',
      type: 'error',
      hideToast: vi.fn()
    }))
    const errorWrapper = mount(ToastNotification)
    expect(errorWrapper.find('[data-test="toast"]').classes()).toContain('bg-red-500')

    // Test warning type
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Warning message',
      type: 'warning',
      hideToast: vi.fn()
    }))
    const warningWrapper = mount(ToastNotification)
    expect(warningWrapper.find('[data-test="toast"]').classes()).toContain('bg-yellow-500')
  })

  it('calls hideToast when close button is clicked', async () => {
    const mockHideToast = vi.fn()
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Test message',
      type: 'success',
      hideToast: mockHideToast
    }))

    const wrapper = mount(ToastNotification)
    await wrapper.find('[data-test="close-button"]').trigger('click')
    expect(mockHideToast).toHaveBeenCalled()
  })

  it('is not rendered when not visible', () => {
    useToast.mockImplementation(() => ({
      isVisible: false,
      message: 'Test message',
      type: 'success',
      hideToast: vi.fn()
    }))

    const wrapper = mount(ToastNotification)
    expect(wrapper.find('[data-test="toast"]').exists()).toBe(false)
  })

  it('renders correct icon based on type', async () => {
    // Test success icon
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Success message',
      type: 'success',
      hideToast: vi.fn()
    }))
    const successWrapper = mount(ToastNotification)
    expect(successWrapper.find('[data-test="success-icon"]').exists()).toBe(true)

    // Test error icon
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Error message',
      type: 'error',
      hideToast: vi.fn()
    }))
    const errorWrapper = mount(ToastNotification)
    expect(errorWrapper.find('[data-test="error-icon"]').exists()).toBe(true)

    // Test warning icon
    useToast.mockImplementation(() => ({
      isVisible: true,
      message: 'Warning message',
      type: 'warning',
      hideToast: vi.fn()
    }))
    const warningWrapper = mount(ToastNotification)
    expect(warningWrapper.find('[data-test="warning-icon"]').exists()).toBe(true)
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(ToastNotification)
    expect(wrapper.find('[data-test="toast"]').attributes('role')).toBe('alert')
    expect(wrapper.find('[data-test="close-button"]').attributes('aria-label')).toBe('Close notification')
  })
})
