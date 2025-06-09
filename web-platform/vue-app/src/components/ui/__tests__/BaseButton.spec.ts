import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders properly with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('bg-primary-500')
  })

  it('applies variant classes correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'secondary'
      }
    })
    expect(wrapper.classes()).toContain('bg-secondary-500')
  })

  it('applies size classes correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'lg'
      }
    })
    expect(wrapper.classes()).toContain('px-6')
    expect(wrapper.classes()).toContain('py-3')
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('is disabled when loading or disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies custom class', () => {
    const wrapper = mount(BaseButton, {
      props: {
        customClass: 'custom-class'
      }
    })
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders with accessibility attributes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        ariaLabel: 'Test button'
      }
    })
    expect(wrapper.attributes('aria-label')).toBe('Test button')
  })
}) 