<template>
  <div
    :id="id"
    class="relative inline-flex items-center justify-center overflow-hidden rounded-full"
    :class="[
      getSizeClasses(),
      status ? 'ring-2 ring-white dark:ring-gray-800' : '',
      className
    ]"
  >
    <!-- Image -->
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="handleImageError"
    />

    <!-- Fallback -->
    <div
      v-else
      class="flex h-full w-full items-center justify-center"
      :class="getFallbackClasses()"
    >
      <slot name="fallback">
        <span class="font-medium" :class="getTextClasses()">
          {{ getInitials() }}
        </span>
      </slot>
    </div>

    <!-- Status indicator -->
    <span
      v-if="status"
      class="absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800"
      :class="[
        getStatusSizeClasses(),
        getStatusColorClasses()
      ]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  status: {
    type: String,
    default: '',
    validator: (value) => ['online', 'offline', 'away', 'busy'].includes(value)
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['error'])

const getSizeClasses = () => {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14'
  }
  return sizes[props.size]
}

const getStatusSizeClasses = () => {
  const sizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5'
  }
  return sizes[props.size]
}

const getStatusColorClasses = () => {
  const colors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  }
  return colors[props.status]
}

const getFallbackClasses = () => {
  const colors = {
    xs: 'bg-gray-100 dark:bg-gray-700',
    sm: 'bg-gray-100 dark:bg-gray-700',
    md: 'bg-gray-100 dark:bg-gray-700',
    lg: 'bg-gray-100 dark:bg-gray-700',
    xl: 'bg-gray-100 dark:bg-gray-700'
  }
  return colors[props.size]
}

const getTextClasses = () => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return `${sizes[props.size]} text-gray-600 dark:text-gray-300`
}

const getInitials = () => {
  if (!props.name) return ''
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleImageError = (event) => {
  emit('error', event)
}
</script> 