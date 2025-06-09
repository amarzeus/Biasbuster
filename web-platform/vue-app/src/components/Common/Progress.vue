<template>
  <div class="space-y-1">
    <!-- Label and value -->
    <div
      v-if="label || showValue"
      class="flex items-center justify-between"
    >
      <label
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
      </label>
      <span
        v-if="showValue"
        class="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ value }}%
      </span>
    </div>

    <!-- Progress bar -->
    <div
      :id="id"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
      :class="[
        'relative h-2 w-full overflow-hidden rounded-full',
        getVariantClasses()
      ]"
    >
      <!-- Background -->
      <div
        class="absolute inset-0"
        :class="getBackgroundClasses()"
      />

      <!-- Progress -->
      <div
        v-if="!indeterminate"
        class="absolute inset-0 transition-all duration-300 ease-out"
        :class="[
          getProgressClasses(),
          getSizeClasses()
        ]"
        :style="{ width: `${value}%` }"
      />

      <!-- Indeterminate animation -->
      <div
        v-else
        class="absolute inset-0"
        :class="getIndeterminateClasses()"
      />
    </div>

    <!-- Helper text -->
    <p
      v-if="helper"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helper }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  helper: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  striped: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: false
  }
})

// Classes
const getVariantClasses = () => {
  const variantClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900',
    success: 'bg-success-100 dark:bg-success-900',
    warning: 'bg-warning-100 dark:bg-warning-900',
    error: 'bg-error-100 dark:bg-error-900',
    info: 'bg-info-100 dark:bg-info-900'
  }
  return variantClasses[props.variant]
}

const getBackgroundClasses = () => {
  const backgroundClasses = {
    primary: 'bg-primary-200 dark:bg-primary-800',
    success: 'bg-success-200 dark:bg-success-800',
    warning: 'bg-warning-200 dark:bg-warning-800',
    error: 'bg-error-200 dark:bg-error-800',
    info: 'bg-info-200 dark:bg-info-800'
  }
  return backgroundClasses[props.variant]
}

const getProgressClasses = () => {
  const progressClasses = {
    primary: 'bg-primary-500 dark:bg-primary-400',
    success: 'bg-success-500 dark:bg-success-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    error: 'bg-error-500 dark:bg-error-400',
    info: 'bg-info-500 dark:bg-info-400'
  }
  return progressClasses[props.variant]
}

const getSizeClasses = () => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  return sizeClasses[props.size]
}

const getIndeterminateClasses = () => {
  const indeterminateClasses = {
    primary: 'bg-primary-500 dark:bg-primary-400',
    success: 'bg-success-500 dark:bg-success-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    error: 'bg-error-500 dark:bg-error-400',
    info: 'bg-info-500 dark:bg-info-400'
  }
  return [
    indeterminateClasses[props.variant],
    'animate-progress-indeterminate'
  ]
}
</script>

<style>
@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-progress-indeterminate {
  animation: progress-indeterminate 1.5s infinite;
}
</style> 