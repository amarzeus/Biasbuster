<template>
  <div v-if="isVisible" data-test="toast" :class="['fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-start gap-3', typeClasses]" role="alert">
    <div class="flex-shrink-0">
      <CheckCircleIcon v-if="type.value === 'success'" data-test="success-icon" class="h-6 w-6 text-white" />
      <ExclamationCircleIcon v-else-if="type.value === 'error'" data-test="error-icon" class="h-6 w-6 text-white" />
      <ExclamationTriangleIcon v-else-if="type.value === 'warning'" data-test="warning-icon" class="h-6 w-6 text-white" />
    </div>
    <div class="flex-1">
      <h3 class="text-sm font-medium text-white">{{ title }}</h3>
      <p class="mt-1 text-sm text-white">{{ message }}</p>
    </div>
    <button
      data-test="close-button"
      class="flex-shrink-0 text-white hover:text-gray-200 focus:outline-none"
      @click="hideToast"
      aria-label="Close notification"
    >
      <XMarkIcon class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from '../../composables/useToast'

const toast = useToast()

const isVisible = computed(() => {
  if (toast.toastState) return toast.toastState.value.show
  return toast.isVisible
})
const type = computed(() => {
  if (toast.toastState) return toast.toastState.value.type
  return toast.type
})
const message = computed(() => {
  if (toast.toastState) return toast.toastState.value.message
  return toast.message
})
const hideToast = toast.hideToast

const title = computed(() => {
  switch (type.value) {
    case 'success':
      return 'Success'
    case 'error':
      return 'Error'
    case 'warning':
      return 'Warning'
    default:
      return 'Notification'
  }
})

const typeClasses = computed(() => {
  switch (type.value) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}
</style>
