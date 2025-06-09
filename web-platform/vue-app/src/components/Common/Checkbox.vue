<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
          'text-primary-600 dark:text-primary-500',
          'focus:ring-primary-500 dark:focus:ring-primary-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-300 dark:border-red-600' : ''
        ]"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
    <div class="ml-3 text-sm">
      <label
        :for="id"
        :class="[
          'font-medium',
          disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300',
          error ? 'text-red-600 dark:text-red-500' : ''
        ]"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 dark:text-red-400">*</span>
      </label>
      <p v-if="helper" class="text-gray-500 dark:text-gray-400">{{ helper }}</p>
      <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  helper: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script> 