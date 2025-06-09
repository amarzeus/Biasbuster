import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const userStore = useUserStore()
  const theme = ref<Theme>(userStore.preferences.theme || 'system')
  const isDark = ref(false)

  const updateTheme = (newTheme: Theme) => {
    theme.value = newTheme
    userStore.updatePreferences({ theme: newTheme })
  }

  const toggleTheme = () => {
    updateTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const applyTheme = (newTheme: Theme) => {
    const effectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme
    isDark.value = effectiveTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  })

  // Initialize theme
  applyTheme(theme.value)

  return {
    theme,
    isDark,
    updateTheme,
    toggleTheme
  }
} 