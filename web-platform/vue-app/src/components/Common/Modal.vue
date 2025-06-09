<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? `${id}-title` : undefined"
      :aria-describedby="description ? `${id}-description` : undefined"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity dark:bg-black/75"
        @click="closeOnBackdrop && close()"
      />

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <!-- Modal Panel -->
        <div
          class="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-800"
          :class="[
            {
              'sm:max-w-sm': size === 'sm',
              'sm:max-w-lg': size === 'md',
              'sm:max-w-2xl': size === 'lg',
              'sm:max-w-4xl': size === 'xl'
            }
          ]"
        >
          <!-- Header -->
          <div
            v-if="$slots.header || title"
            class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6"
          >
            <slot name="header">
              <div class="flex items-center justify-between">
                <h3
                  :id="`${id}-title`"
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {{ title }}
                </h3>

                <!-- Close Button -->
                <button
                  v-if="showClose"
                  type="button"
                  class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800"
                  @click="close()"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
            </slot>
          </div>

          <!-- Body -->
          <div
            v-if="$slots.default"
            class="px-4 py-5 sm:p-6"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script> 