import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from '../ThemeToggle.vue'
import { useTheme } from '../../../composables/useTheme'

// Mock the useTheme composable
vi.mock('../../../composables/useTheme', () => ({
  useTheme: vi.fn(() => ({
    isDark: false,
    toggleTheme: vi.fn(),
    theme: 'light'
  }))
}))

describe('ThemeToggle.vue', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays correct icon based on theme', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.find('[data-test="theme-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="theme-icon-light"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="theme-icon-dark"]').exists()).toBe(false)
  })

  it('calls toggleTheme when clicked', async () => {
    const mockToggleTheme = vi.fn()
    useTheme.mockImplementation(() => ({
      isDark: false,
      toggleTheme: mockToggleTheme,
      theme: 'light'
    }))

    const wrapper = mount(ThemeToggle)
    await wrapper.find('button').trigger('click')
    expect(mockToggleTheme).toHaveBeenCalled()
  })

  it('updates icon when theme changes', async () => {
    const wrapper = mount(ThemeToggle)
    
    // Initially light theme
    expect(wrapper.find('[data-test="theme-icon-light"]').exists()).toBe(true)
    
    // Change to dark theme
    useTheme.mockImplementation(() => ({
      isDark: true,
      toggleTheme: vi.fn(),
      theme: 'dark'
    }))
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="theme-icon-dark"]').exists()).toBe(true)
  })

  it('applies correct accessibility attributes', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    
    expect(button.attributes('aria-label')).toBe('Toggle dark mode')
    expect(button.attributes('type')).toBe('button')
  })

  it('applies correct classes based on theme', async () => {
    const wrapper = mount(ThemeToggle)
    
    // Light theme classes
    expect(wrapper.find('button').classes()).toContain('text-gray-500')
    
    // Change to dark theme
    useTheme.mockImplementation(() => ({
      isDark: true,
      toggleTheme: vi.fn(),
      theme: 'dark'
    }))
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').classes()).toContain('text-gray-400')
  })
})
