<template>
  <TransitionRoot
    appear
    :show="isVisible"
    as="template"
    enter="transform ease-out duration-300 transition"
    enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to="translate-y-0 opacity-100 sm:translate-x-0"
    leave="transition ease-in duration-100"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <div class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircleIcon
                v-if="type === 'success'"
                class="h-6 w-6 text-green-400"
                aria-hidden="true"
              />
              <ExclamationTriangleIcon
                v-else-if="type === 'warning'"
                class="h-6 w-6 text-yellow-400"
                aria-hidden="true"
              />
              <XCircleIcon
                v-else-if="type === 'error'"
                class="h-6 w-6 text-red-400"
                aria-hidden="true"
              />
              <InformationCircleIcon
                v-else
                class="h-6 w-6 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ title }}
              </p>
              <p v-if="message" class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {{ message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="hide"
                class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'

const { toastState, hideToast } = useToast()

const isVisible = ref(false)
const title = ref('')
const message = ref('')
const type = ref('info')

watch(
  () => toastState.value,
  (newState) => {
    if (newState.show) {
      title.value = newState.title
      message.value = newState.message
      type.value = newState.type
      isVisible.value = true

      // Auto-hide after duration
      if (newState.duration > 0) {
        setTimeout(() => {
          hide()
        }, newState.duration)
      }
    } else {
      isVisible.value = false
    }
  },
  { immediate: true }
)

const hide = () => {
  isVisible.value = false
  setTimeout(() => {
    hideToast()
  }, 300) // Wait for transition to complete
}
</script>
