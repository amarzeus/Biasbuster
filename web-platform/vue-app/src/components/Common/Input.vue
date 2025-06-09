<template>
  <div class="relative">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full',
        'rounded-lg',
        'border',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'transition',
        {
          'border-gray-300 dark:border-gray-600': !error,
          'border-error': error,
          'bg-gray-50 dark:bg-gray-700': disabled,
          'bg-white dark:bg-gray-800': !disabled,
          'text-gray-900 dark:text-white': !disabled,
          'text-gray-500 dark:text-gray-400': disabled,
          'focus:border-primary focus:ring-primary': !error,
          'focus:border-error focus:ring-error': error
        }
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    />
    
    <p v-if="error" class="mt-1 text-sm text-error">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
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
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur'])
</script> 