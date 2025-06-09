import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('applies size classes based on props', () => {
    // Test small size
    const smallWrapper = mount(LoadingSpinner, {
      props: {
        size: 'small'
      }
    })
    expect(smallWrapper.classes()).toContain('h-4')
    expect(smallWrapper.classes()).toContain('w-4')

    // Test medium size (default)
    const mediumWrapper = mount(LoadingSpinner)
    expect(mediumWrapper.classes()).toContain('h-8')
    expect(mediumWrapper.classes()).toContain('w-8')

    // Test large size
    const largeWrapper = mount(LoadingSpinner, {
      props: {
        size: 'large'
      }
    })
    expect(largeWrapper.classes()).toContain('h-12')
    expect(largeWrapper.classes()).toContain('w-12')
  })

  it('applies color classes based on props', () => {
    // Test primary color (default)
    const primaryWrapper = mount(LoadingSpinner)
    expect(primaryWrapper.classes()).toContain('text-trust-blue')

    // Test white color
    const whiteWrapper = mount(LoadingSpinner, {
      props: {
        color: 'white'
      }
    })
    expect(whiteWrapper.classes()).toContain('text-white')

    // Test gray color
    const grayWrapper = mount(LoadingSpinner, {
      props: {
        color: 'gray'
      }
    })
    expect(grayWrapper.classes()).toContain('text-gray-500')
  })

  it('applies animation classes', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.classes()).toContain('animate-spin')
  })

  it('renders SVG element correctly', () => {
    const wrapper = mount(LoadingSpinner)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('fill')).toBe('none')
  })

  it('has correct SVG path elements', () => {
    const wrapper = mount(LoadingSpinner)
    const paths = wrapper.findAll('path')
    expect(paths.length).toBe(2) // Should have two paths for the spinner animation
  })
})
