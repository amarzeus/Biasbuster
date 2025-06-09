import { render, fireEvent } from '@testing-library/vue'
import { useAccessibility } from '@/composables/useAccessibility'
import { nextTick } from 'vue'

describe('Accessibility Features', () => {
  beforeEach(() => {
    document.documentElement.style.fontSize = '16px'
    document.documentElement.classList.remove('high-contrast', 'reading-mode')
  })

  test('font size controls work correctly', async () => {
    const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility()
    
    expect(fontSize.value).toBe(16)
    
    increaseFontSize()
    await nextTick()
    expect(fontSize.value).toBe(18)
    expect(document.documentElement.style.fontSize).toBe('18px')
    
    decreaseFontSize()
    await nextTick()
    expect(fontSize.value).toBe(16)
    expect(document.documentElement.style.fontSize).toBe('16px')
  })

  test('high contrast mode toggles correctly', async () => {
    const { isHighContrast, toggleHighContrast } = useAccessibility()
    
    expect(isHighContrast.value).toBe(false)
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false)
    
    toggleHighContrast()
    await nextTick()
    expect(isHighContrast.value).toBe(true)
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
  })

  test('reading mode toggles correctly', async () => {
    const { isReadingMode, toggleReadingMode } = useAccessibility()
    
    expect(isReadingMode.value).toBe(false)
    expect(document.documentElement.classList.contains('reading-mode')).toBe(false)
    
    toggleReadingMode()
    await nextTick()
    expect(isReadingMode.value).toBe(true)
    expect(document.documentElement.classList.contains('reading-mode')).toBe(true)
  })

  test('font size has min/max limits', async () => {
    const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility()
    
    // Test minimum limit
    for (let i = 0; i < 10; i++) {
      decreaseFontSize()
    }
    await nextTick()
    expect(fontSize.value).toBe(12) // Should not go below 12px
    
    // Test maximum limit
    for (let i = 0; i < 10; i++) {
      increaseFontSize()
    }
    await nextTick()
    expect(fontSize.value).toBe(24) // Should not go above 24px
  })
}) 