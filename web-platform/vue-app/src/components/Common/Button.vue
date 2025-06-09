<template>
  <button
    :class="[
      'transition',
      'font-medium',
      'rounded-lg',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      sizeClasses[size],
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
  success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
  warning: 'bg-warning text-white hover:bg-warning-dark focus:ring-warning',
  error: 'bg-error text-white hover:bg-error-dark focus:ring-error',
  info: 'bg-info text-white hover:bg-info-dark focus:ring-info',
  ghost: 'bg-transparent text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary'
}
</script> 