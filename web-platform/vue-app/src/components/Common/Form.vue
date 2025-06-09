<template>
  <form
    class="space-y-6"
    @submit.prevent="handleSubmit"
  >
    <!-- Form Fields -->
    <div
      v-for="field in fields"
      :key="field.id"
      class="space-y-1"
    >
      <!-- Field label -->
      <label
        :for="field.id"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ field.label }}
        <span
          v-if="field.required"
          class="text-error-500"
        >
          *
        </span>
      </label>

      <!-- Field helper text -->
      <p
        v-if="field.helper"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        {{ field.helper }}
      </p>

      <!-- Field input -->
      <div class="relative">
        <!-- Text input -->
        <input
          v-if="['text', 'email', 'password', 'number', 'tel', 'url'].includes(field.type)"
          :id="field.id"
          :type="field.type"
          :name="field.name"
          :value="modelValue[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :pattern="field.pattern"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
          :class="{ 'pr-10': field.icon }"
          @input="handleInput($event, field.id)"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.id"
          :name="field.name"
          :value="modelValue[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :rows="field.rows"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
          @input="handleInput($event, field.id)"
        />

        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.id"
          :name="field.name"
          :value="modelValue[field.id]"
          :required="field.required"
          :disabled="field.disabled"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
          @change="handleInput($event, field.id)"
        >
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Checkbox -->
        <div
          v-else-if="field.type === 'checkbox'"
          class="flex items-center"
        >
          <input
            :id="field.id"
            :name="field.name"
            type="checkbox"
            :checked="modelValue[field.id]"
            :required="field.required"
            :disabled="field.disabled"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            @change="handleInput($event, field.id)"
          />
          <label
            :for="field.id"
            class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {{ field.label }}
          </label>
        </div>

        <!-- Radio -->
        <div
          v-else-if="field.type === 'radio'"
          class="space-y-2"
        >
          <div
            v-for="option in field.options"
            :key="option.value"
            class="flex items-center"
          >
            <input
              :id="`${field.id}-${option.value}`"
              :name="field.name"
              type="radio"
              :value="option.value"
              :checked="modelValue[field.id] === option.value"
              :required="field.required"
              :disabled="field.disabled"
              class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              @change="handleInput($event, field.id)"
            />
            <label
              :for="`${field.id}-${option.value}`"
              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Field icon -->
        <div
          v-if="field.icon"
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <component
            :is="field.icon"
            class="h-5 w-5 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>

      <!-- Field error -->
      <p
        v-if="errors[field.id]"
        class="mt-1 text-sm text-error-500"
      >
        {{ errors[field.id] }}
      </p>
    </div>

    <!-- Submit button -->
    <div>
      <button
        type="submit"
        class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        <slot name="submit">
          {{ submitText }}
        </slot>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(field => {
        return (
          typeof field.id === 'string' &&
          typeof field.name === 'string' &&
          typeof field.type === 'string' &&
          typeof field.label === 'string' &&
          (!field.helper || typeof field.helper === 'string') &&
          (!field.required || typeof field.required === 'boolean') &&
          (!field.disabled || typeof field.disabled === 'boolean') &&
          (!field.placeholder || typeof field.placeholder === 'string') &&
          (!field.icon || typeof field.icon === 'object') &&
          (!field.pattern || typeof field.pattern === 'string') &&
          (!field.min || typeof field.min === 'number') &&
          (!field.max || typeof field.max === 'number') &&
          (!field.step || typeof field.step === 'number') &&
          (!field.rows || typeof field.rows === 'number') &&
          (!field.options || Array.isArray(field.options))
        )
      })
    }
  },
  modelValue: {
    type: Object,
    required: true
  },
  submitText: {
    type: String,
    default: 'Submit'
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const errors = ref({})

// Methods
const handleInput = (event, fieldId) => {
  const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
  emit('update:modelValue', { ...props.modelValue, [fieldId]: value })
  validateField(fieldId, value)
}

const validateField = (fieldId, value) => {
  const field = props.fields.find(f => f.id === fieldId)
  if (!field) return

  if (field.required && !value) {
    errors.value[fieldId] = 'This field is required'
  } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
    errors.value[fieldId] = 'Invalid format'
  } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.value[fieldId] = 'Invalid email format'
  } else if (field.type === 'url' && !/^https?:\/\/.+/.test(value)) {
    errors.value[fieldId] = 'Invalid URL format'
  } else if (field.type === 'number') {
    if (field.min !== undefined && value < field.min) {
      errors.value[fieldId] = `Minimum value is ${field.min}`
    } else if (field.max !== undefined && value > field.max) {
      errors.value[fieldId] = `Maximum value is ${field.max}`
    } else {
      delete errors.value[fieldId]
    }
  } else {
    delete errors.value[fieldId]
  }
}

const handleSubmit = () => {
  // Validate all fields
  props.fields.forEach(field => {
    validateField(field.id, props.modelValue[field.id])
  })

  // If no errors, emit submit event
  if (Object.keys(errors.value).length === 0) {
    emit('submit', props.modelValue)
  }
}
</script> 