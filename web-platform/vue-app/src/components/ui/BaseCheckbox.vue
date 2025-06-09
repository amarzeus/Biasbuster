<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500',
          {
            'cursor-not-allowed opacity-50': disabled,
            'border-error-500': error,
          },
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>

    <div class="ml-3">
      <!-- Label -->
      <label
        v-if="label"
        :for="id"
        :class="[
          'text-sm font-medium',
          {
            'text-gray-700 dark:text-gray-200': !error,
            'text-error-500': error,
            'cursor-not-allowed opacity-50': disabled,
          },
        ]"
      >
        {{ label }}
        <span
          v-if="required"
          class="text-error-500 ml-1"
        >*</span>
      </label>

      <!-- Helper Text -->
      <p
        v-if="helperText"
        :class="[
          'text-sm',
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
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  id?: string
  label?: string
  helperText?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script> 