<template>
  <div
    :class="[
      'animate-pulse rounded',
      getVariantClasses(),
      getSizeClasses()
    ]"
    :style="getStyle()"
  />
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'circle', 'rect'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  }
})

// Classes
const getVariantClasses = () => {
  const variantClasses = {
    text: 'bg-gray-200 dark:bg-gray-700',
    circle: 'bg-gray-200 dark:bg-gray-700 rounded-full',
    rect: 'bg-gray-200 dark:bg-gray-700'
  }
  return variantClasses[props.variant]
}

const getSizeClasses = () => {
  if (props.variant === 'text') {
    const sizeClasses = {
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6'
    }
    return sizeClasses[props.size]
  }
  if (props.variant === 'circle') {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16'
    }
    return sizeClasses[props.size]
  }
  return ''
}

// Style
const getStyle = () => {
  const style = {}
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return style
}
</script>

<style>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 