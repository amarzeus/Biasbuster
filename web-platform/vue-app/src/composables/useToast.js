import { ref, reactive } from 'vue'

const toastState = ref({
  show: false,
  title: '',
  message: '',
  type: 'info', // 'success', 'error', 'warning', 'info'
  duration: 5000
})

export function useToast() {
  const showToast = (title, type = 'info', message = '', duration = 5000) => {
    toastState.value = {
      show: true,
      title,
      message,
      type,
      duration
    }
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  const success = (title, message = '', duration = 5000) => {
    showToast(title, 'success', message, duration)
  }

  const error = (title, message = '', duration = 7000) => {
    showToast(title, 'error', message, duration)
  }

  const warning = (title, message = '', duration = 6000) => {
    showToast(title, 'warning', message, duration)
  }

  const info = (title, message = '', duration = 5000) => {
    showToast(title, 'info', message, duration)
  }

  return {
    toastState,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
}
