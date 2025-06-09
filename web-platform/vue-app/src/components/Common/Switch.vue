<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      getActiveClasses(),
      {
        'cursor-not-allowed opacity-50': disabled
      }
    ]"
    @click="toggle"
  >
    <!-- Background -->
    <span
      class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
      :class="{
        'translate-x-5': modelValue,
        'translate-x-0': !modelValue
      }"
    >
      <!-- Icon -->
      <component
        v-if="icon"
        :is="icon"
        class="absolute inset-0 flex h-full w-full items-center justify-center"
        :class="getIconClasses()"
      />
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  icon: {
    type: Object,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const getActiveClasses = () => {
  const baseClasses = 'focus:ring-offset-2'
  const variantClasses = {
    primary: 'bg-primary-500 focus:ring-primary-500 dark:bg-primary-400 dark:focus:ring-primary-400',
    success: 'bg-success-500 focus:ring-success-500 dark:bg-success-400 dark:focus:ring-success-400',
    warning: 'bg-warning-500 focus:ring-warning-500 dark:bg-warning-400 dark:focus:ring-warning-400',
    error: 'bg-error-500 focus:ring-error-500 dark:bg-error-400 dark:focus:ring-error-400',
    info: 'bg-info-500 focus:ring-info-500 dark:bg-info-400 dark:focus:ring-info-400'
  }
  return [
    baseClasses,
    props.modelValue ? variantClasses[props.variant] : 'bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:focus:ring-gray-400'
  ]
}

const getIconClasses = () => {
  const variantClasses = {
    primary: 'text-primary-500 dark:text-primary-400',
    success: 'text-success-500 dark:text-success-400',
    warning: 'text-warning-500 dark:text-warning-400',
    error: 'text-error-500 dark:text-error-400',
    info: 'text-info-500 dark:text-info-400'
  }
  return props.modelValue ? variantClasses[props.variant] : 'text-gray-400 dark:text-gray-500'
}
</script> 