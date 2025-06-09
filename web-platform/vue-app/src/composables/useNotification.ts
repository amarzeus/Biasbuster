import { ref } from 'vue'
import type { Notification, NotificationType } from '@/types'

interface NotificationOptions {
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  closable?: boolean
}

export function useNotification() {
  const notifications = ref<Notification[]>([])
  const defaultDuration = 5000

  const add = (
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ) => {
    const {
      duration = defaultDuration,
      position = 'top-right',
      closable = true
    } = options

    const id = Date.now()
    const notification: Notification = {
      id,
      message,
      type,
      position,
      closable,
      duration
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, options?: NotificationOptions) => {
    return add(message, 'success', options)
  }

  const error = (message: string, options?: NotificationOptions) => {
    return add(message, 'error', options)
  }

  const warning = (message: string, options?: NotificationOptions) => {
    return add(message, 'warning', options)
  }

  const info = (message: string, options?: NotificationOptions) => {
    return add(message, 'info', options)
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
} 