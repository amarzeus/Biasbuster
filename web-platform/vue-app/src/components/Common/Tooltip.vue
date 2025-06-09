<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="inline-block"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
    >
      <slot />
    </div>

    <!-- Tooltip -->
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
        ref="tooltipRef"
        :class="[
          'absolute z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-lg',
          'dark:bg-gray-700',
          getPositionClasses()
        ]"
        role="tooltip"
      >
        {{ text }}
        <!-- Arrow -->
        <div
          :class="[
            'absolute w-2 h-2 bg-gray-900 transform rotate-45',
            'dark:bg-gray-700',
            getArrowPositionClasses()
          ]"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light', 'primary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  delay: {
    type: Number,
    default: 0
  }
})

const isVisible = ref(false)
const triggerRef = ref(null)
const tooltipRef = ref(null)
let showTimeout = null
let hideTimeout = null

const showTooltip = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
  }
  showTimeout = setTimeout(() => {
    isVisible.value = true
    updatePosition()
  }, props.delay)
}

const hideTooltip = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

const updatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const arrowSize = 8 // 2 * 4 (w-2 h-2)

  let top = 0
  let left = 0

  switch (props.position) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - arrowSize
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + arrowSize
      break
    case 'bottom':
      top = triggerRect.bottom + arrowSize
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - arrowSize
      break
  }

  // Ensure tooltip stays within viewport
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (left < 0) {
    left = 0
  } else if (left + tooltipRect.width > viewportWidth) {
    left = viewportWidth - tooltipRect.width
  }

  if (top < 0) {
    top = 0
  } else if (top + tooltipRect.height > viewportHeight) {
    top = viewportHeight - tooltipRect.height
  }

  tooltipRef.value.style.top = `${top}px`
  tooltipRef.value.style.left = `${left}px`
}

const getPositionClasses = () => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  }
  return positionClasses[props.position]
}

const getArrowPositionClasses = () => {
  const arrowPositionClasses = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
    right: 'left-[-4px] top-1/2 -translate-y-1/2',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    left: 'right-[-4px] top-1/2 -translate-y-1/2'
  }
  return arrowPositionClasses[props.position]
}

const getVariantClasses = () => {
  const variantClasses = {
    dark: 'bg-gray-900 dark:bg-gray-700',
    light: 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    primary: 'bg-primary-500 dark:bg-primary-400',
    success: 'bg-success-500 dark:bg-success-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    error: 'bg-error-500 dark:bg-error-400',
    info: 'bg-info-500 dark:bg-info-400'
  }
  return variantClasses[props.variant]
}

// Click outside handler
const handleClickOutside = (event) => {
  if (
    isVisible.value &&
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target) &&
    !triggerRef.value.contains(event.target)
  ) {
    hideTooltip()
  }
}

onMounted(() => {
  window.addEventListener('scroll', updatePosition)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition)
  window.removeEventListener('resize', updatePosition)
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.tooltip {
  position: fixed;
  z-index: 50;
  pointer-events: none;
  max-width: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip-content {
  white-space: normal;
  word-wrap: break-word;
}

/* High Contrast Mode */
:global(.high-contrast) .tooltip {
  background-color: yellow;
  color: black;
  border: 2px solid black;
}

/* Accessibility Mode */
:global(.accessibility-mode) .tooltip {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  letter-spacing: 0.0125em;
}
</style> 