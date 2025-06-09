import { ref, watch } from 'vue'

export function useAccessibility() {
  const fontSize = ref(16)
  const isHighContrast = ref(false)
  const isReadingMode = ref(false)

  const increaseFontSize = () => {
    if (fontSize.value < 24) {
      fontSize.value += 2
    }
  }

  const decreaseFontSize = () => {
    if (fontSize.value > 12) {
      fontSize.value -= 2
    }
  }

  const toggleHighContrast = () => {
    isHighContrast.value = !isHighContrast.value
  }

  const toggleReadingMode = () => {
    isReadingMode.value = !isReadingMode.value
  }

  // Watch for changes and apply them
  watch(fontSize, (newSize) => {
    document.documentElement.style.fontSize = `${newSize}px`
  })

  watch(isHighContrast, (enabled) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  })

  watch(isReadingMode, (enabled) => {
    if (enabled) {
      document.documentElement.classList.add('reading-mode')
    } else {
      document.documentElement.classList.remove('reading-mode')
    }
  })

  return {
    fontSize,
    isHighContrast,
    isReadingMode,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleReadingMode
  }
} 