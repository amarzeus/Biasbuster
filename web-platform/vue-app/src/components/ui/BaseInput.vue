<template>
  <div class="relative">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      :class="[
        'block text-sm font-medium mb-1',
        {
          'text-gray-700 dark:text-gray-200': !error,
          'text-error-500': error,
        },
      ]"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error-500 ml-1"
      >*</span>
    </label>

    <!-- Input Wrapper -->
    <div
      :class="[
        'relative rounded-md shadow-sm',
        {
          'focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500': !error,
          'focus-within:ring-2 focus-within:ring-error-500 focus-within:border-error-500': error,
        },
      ]"
    >
      <!-- Left Icon -->
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          :is="leftIcon"
          class="h-5 w-5"
          :class="{
            'text-gray-400': !error,
            'text-error-500': error,
          }"
        />
      </div>

      <!-- Input -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="[
          'block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none sm:text-sm',
          {
            'pl-10': leftIcon,
            'pr-10': rightIcon || clearable,
            'pl-3': !leftIcon,
            'pr-3': !rightIcon && !clearable,
            'cursor-not-allowed opacity-50': disabled,
            'border-error-500': error,
            'border-gray-300 dark:border-gray-600': !error,
          },
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Right Icon -->
      <div
        v-if="rightIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component
          :is="rightIcon"
          class="h-5 w-5"
          :class="{
            'text-gray-400': !error,
            'text-error-500': error,
          }"
        />
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="handleClear"
      >
        <svg
          class="h-5 w-5 text-gray-400 hover:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText"
      :class="[
        'mt-1 text-sm',
        {
          'text-gray-500 dark:text-gray-400': !error,
          'text-error-500': error,
        },
      ]"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p
      v-if="error"
      class="mt-1 text-sm text-error-500"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string | number
  id?: string
  type?: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  leftIcon?: any
  rightIcon?: any
  min?: number | string
  max?: number | string
  step?: number | string
  pattern?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
  (e: 'clear'): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script> 