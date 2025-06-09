import { onMounted, onUnmounted } from 'vue'

type KeyCombo = string | string[]
type Modifier = 'ctrl' | 'alt' | 'shift' | 'meta'

interface ShortcutOptions {
  modifiers?: Modifier[]
  preventDefault?: boolean
  stopPropagation?: boolean
  enabled?: boolean
}

export function useKeyboardShortcut(
  key: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const {
    modifiers = [],
    preventDefault = true,
    stopPropagation = true,
    enabled = true
  } = options

  const keys = Array.isArray(key) ? key : [key]

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!enabled) return

    const keyPressed = event.key.toLowerCase()
    const isKeyMatch = keys.some(k => k.toLowerCase() === keyPressed)
    const hasModifiers = modifiers.every(mod => {
      switch (mod) {
        case 'ctrl':
          return event.ctrlKey
        case 'alt':
          return event.altKey
        case 'shift':
          return event.shiftKey
        case 'meta':
          return event.metaKey
        default:
          return false
      }
    })

    if (isKeyMatch && hasModifiers) {
      if (preventDefault) {
        event.preventDefault()
      }
      if (stopPropagation) {
        event.stopPropagation()
      }
      callback(event)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    enabled
  }
} 