<template>
  <div class="relative inline-block">
    <div
      ref="triggerRef"
      @click="togglePopover"
      @keydown.enter="togglePopover"
      @keydown.space="togglePopover"
      :tabindex="0"
      role="button"
      :aria-expanded="isVisible"
      :aria-haspopup="true"
    >
      <slot name="trigger" />
    </div>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isVisible"
        ref="popoverRef"
        :class="[
          'absolute z-50 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
          'dark:bg-gray-800 dark:ring-white dark:ring-opacity-10',
          getPositionClasses()
        ]"
        role="dialog"
        :aria-labelledby="title ? `${id}-title` : undefined"
      >
        <div class="p-4">
          <div
            v-if="title"
            :id="`${id}-title`"
            class="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {{ title }}
          </div>
          <div
            v-if="description"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ description }}
          </div>
          <div class="mt-4">
            <slot />
          </div>
        </div>
        <div
          v-if="showClose"
          class="absolute top-0 right-0 p-2"
        >
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="closePopover"
          >
            <span class="sr-only">Close</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
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
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const isVisible = ref(false)
const triggerRef = ref(null)
const popoverRef = ref(null)

// Classes
const getPositionClasses = () => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  }
  return positionClasses[props.position]
}

// Event handlers
const togglePopover = () => {
  isVisible.value = !isVisible.value
}

const closePopover = () => {
  isVisible.value = false
}

// Click outside handler
const handleClickOutside = (event) => {
  if (
    isVisible.value &&
    popoverRef.value &&
    !popoverRef.value.contains(event.target) &&
    !triggerRef.value.contains(event.target)
  ) {
    closePopover()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 