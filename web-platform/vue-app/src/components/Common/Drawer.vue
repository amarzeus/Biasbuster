<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-hidden"
        @click="closeOnBackdrop && close()"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- Drawer -->
        <div
          class="absolute inset-y-0 flex max-w-full"
          :class="[
            position === 'left' ? 'left-0' : 'right-0',
            position === 'left' ? 'justify-start' : 'justify-end'
          ]"
        >
          <Transition
            :enter-active-class="position === 'left' ? 'transition duration-300 ease-out transform' : 'transition duration-300 ease-out transform'"
            :enter-from-class="position === 'left' ? '-translate-x-full' : 'translate-x-full'"
            :enter-to-class="position === 'left' ? 'translate-x-0' : 'translate-x-0'"
            :leave-active-class="position === 'left' ? 'transition duration-200 ease-in transform' : 'transition duration-200 ease-in transform'"
            :leave-from-class="position === 'left' ? 'translate-x-0' : 'translate-x-0'"
            :leave-to-class="position === 'left' ? '-translate-x-full' : 'translate-x-full'"
          >
            <div
              v-if="modelValue"
              class="relative w-full"
              :class="[
                size === 'sm' ? 'max-w-sm' : size === 'md' ? 'max-w-md' : 'max-w-lg',
                'h-full'
              ]"
              @click.stop
            >
              <!-- Drawer content -->
              <div
                class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-800"
                :class="[
                  position === 'left' ? 'rounded-r-lg' : 'rounded-l-lg'
                ]"
              >
                <!-- Header -->
                <div
                  v-if="$slots.header || title"
                  class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700"
                >
                  <div class="flex items-center">
                    <slot name="header">
                      <h3
                        v-if="title"
                        class="text-lg font-medium text-gray-900 dark:text-white"
                      >
                        {{ title }}
                      </h3>
                    </slot>
                  </div>
                  <button
                    v-if="showClose"
                    type="button"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-500 dark:hover:text-gray-400"
                    @click="close()"
                  >
                    <span class="sr-only">Close</span>
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Body -->
                <div class="flex-1 overflow-y-auto p-4">
                  <slot />
                </div>

                <!-- Footer -->
                <div
                  v-if="$slots.footer"
                  class="border-t border-gray-200 px-4 py-3 dark:border-gray-700"
                >
                  <slot name="footer" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const handleEsc = (event) => {
  if (props.closeOnEsc && event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  if (props.closeOnEsc) {
    document.addEventListener('keydown', handleEsc)
  }
})

onUnmounted(() => {
  if (props.closeOnEsc) {
    document.removeEventListener('keydown', handleEsc)
  }
})
</script> 