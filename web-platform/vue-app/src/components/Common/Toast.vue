<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="modelValue"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
      :class="getToastClasses()"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="p-4">
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <component
              :is="getIcon()"
              class="h-6 w-6"
              :class="getIconClasses()"
            />
          </div>

          <!-- Content -->
          <div class="ml-3 w-0 flex-1">
            <p
              class="text-sm font-medium"
              :class="getTitleClasses()"
            >
              {{ title }}
            </p>
            <p
              v-if="message"
              class="mt-1 text-sm"
              :class="getMessageClasses()"
            >
              {{ message }}
            </p>
          </div>

          <!-- Close Button -->
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="getCloseButtonClasses()"
              @click="close"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        v-if="duration"
        class="h-1 w-full"
        :class="getProgressBarClasses()"
      >
        <div
          class="h-full transition-all duration-100 ease-linear"
          :class="getProgressBarFillClasses()"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['update:modelValue'])

// Progress
const progress = ref(100)
let progressInterval = null

// Get Icon
const getIcon = () => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
}

// Get Classes
const getToastClasses = () => {
  const variantClasses = {
    success: 'bg-white dark:bg-gray-800',
    error: 'bg-white dark:bg-gray-800',
    warning: 'bg-white dark:bg-gray-800',
    info: 'bg-white dark:bg-gray-800'
  }
  return variantClasses[props.type]
}

const getIconClasses = () => {
  const variantClasses = {
    success: 'text-success-400 dark:text-success-500',
    error: 'text-error-400 dark:text-error-500',
    warning: 'text-warning-400 dark:text-warning-500',
    info: 'text-info-400 dark:text-info-500'
  }
  return variantClasses[props.type]
}

const getTitleClasses = () => {
  const variantClasses = {
    success: 'text-gray-900 dark:text-white',
    error: 'text-gray-900 dark:text-white',
    warning: 'text-gray-900 dark:text-white',
    info: 'text-gray-900 dark:text-white'
  }
  return variantClasses[props.type]
}

const getMessageClasses = () => {
  const variantClasses = {
    success: 'text-gray-500 dark:text-gray-400',
    error: 'text-gray-500 dark:text-gray-400',
    warning: 'text-gray-500 dark:text-gray-400',
    info: 'text-gray-500 dark:text-gray-400'
  }
  return variantClasses[props.type]
}

const getCloseButtonClasses = () => {
  const variantClasses = {
    success: 'text-gray-400 hover:text-gray-500 focus:ring-success-500 dark:text-gray-500 dark:hover:text-gray-400 dark:focus:ring-success-400',
    error: 'text-gray-400 hover:text-gray-500 focus:ring-error-500 dark:text-gray-500 dark:hover:text-gray-400 dark:focus:ring-error-400',
    warning: 'text-gray-400 hover:text-gray-500 focus:ring-warning-500 dark:text-gray-500 dark:hover:text-gray-400 dark:focus:ring-warning-400',
    info: 'text-gray-400 hover:text-gray-500 focus:ring-info-500 dark:text-gray-500 dark:hover:text-gray-400 dark:focus:ring-info-400'
  }
  return variantClasses[props.type]
}

const getProgressBarClasses = () => {
  const variantClasses = {
    success: 'bg-gray-200 dark:bg-gray-700',
    error: 'bg-gray-200 dark:bg-gray-700',
    warning: 'bg-gray-200 dark:bg-gray-700',
    info: 'bg-gray-200 dark:bg-gray-700'
  }
  return variantClasses[props.type]
}

const getProgressBarFillClasses = () => {
  const variantClasses = {
    success: 'bg-success-500 dark:bg-success-400',
    error: 'bg-error-500 dark:bg-error-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    info: 'bg-info-500 dark:bg-info-400'
  }
  return variantClasses[props.type]
}

// Close Toast
const close = () => {
  emit('update:modelValue', false)
}

// Start Progress
const startProgress = () => {
  if (props.duration) {
    const step = 100 / (props.duration / 100)
    progressInterval = setInterval(() => {
      progress.value = Math.max(0, progress.value - step)
      if (progress.value <= 0) {
        close()
      }
    }, 100)
  }
}

// Lifecycle
onMounted(() => {
  if (props.modelValue && props.duration) {
    startProgress()
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script> 