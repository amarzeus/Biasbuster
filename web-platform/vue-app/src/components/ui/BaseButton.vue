<!--
  BaseButton.vue
  A reusable button component with various styles, sizes, and states.
  Supports loading state, icons, and accessibility features.
-->
<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      // Size classes
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },
      // Variant classes
      {
        // Primary variant
        'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500': variant === 'primary',
        // Secondary variant
        'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500': variant === 'secondary',
        // Accent variant
        'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500': variant === 'accent',
        // Outline variant
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500': variant === 'outline',
        // Ghost variant
        'text-primary-500 hover:bg-primary-50 focus:ring-primary-500': variant === 'ghost',
        // Danger variant
        'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500': variant === 'danger',
        // Success variant
        'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500': variant === 'success',
        // Warning variant
        'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500': variant === 'warning',
        // Info variant
        'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500': variant === 'info',
      },
      // Rounded corners
      {
        'rounded-sm': rounded === 'sm',
        'rounded': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-full': rounded === 'full',
      },
      // Full width
      { 'w-full': fullWidth },
      // Custom classes
      customClass,
    ]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    :aria-disabled="disabled || loading"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      :class="{ 'text-white': variant !== 'outline' && variant !== 'ghost' }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Left icon -->
    <component
      v-if="leftIcon"
      :is="leftIcon"
      class="mr-2"
      :class="{ 'h-4 w-4': size === 'sm', 'h-5 w-5': size === 'md', 'h-6 w-6': size === 'lg' }"
      aria-hidden="true"
    />

    <!-- Button content -->
    <slot></slot>

    <!-- Right icon -->
    <component
      v-if="rightIcon"
      :is="rightIcon"
      class="ml-2"
      :class="{ 'h-4 w-4': size === 'sm', 'h-5 w-5': size === 'md', 'h-6 w-6': size === 'lg' }"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

/**
 * Button variant options
 */
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info'

/**
 * Button size options
 */
type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button rounded corner options
 */
type ButtonRounded = 'sm' | 'md' | 'lg' | 'full'

/**
 * Button component props
 */
interface Props {
  /** Button style variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Button corner radius */
  rounded?: ButtonRounded
  /** Whether button should take full width */
  fullWidth?: boolean
  /** Whether button is disabled */
  disabled?: boolean
  /** Whether button is in loading state */
  loading?: boolean
  /** Left icon component */
  leftIcon?: Component
  /** Right icon component */
  rightIcon?: Component
  /** Additional CSS classes */
  customClass?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: 'md',
  fullWidth: false,
  disabled: false,
  loading: false,
  leftIcon: undefined,
  rightIcon: undefined,
  customClass: '',
  ariaLabel: ''
})

/**
 * Emitted events
 */
defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 