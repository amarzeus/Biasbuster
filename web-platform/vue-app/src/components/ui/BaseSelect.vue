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

    <!-- Select Wrapper -->
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

      <!-- Select -->
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none sm:text-sm appearance-none',
          {
            'pl-10': leftIcon,
            'pr-10': true,
            'pl-3': !leftIcon,
            'cursor-not-allowed opacity-50': disabled,
            'border-error-500': error,
            'border-gray-300 dark:border-gray-600': !error,
          },
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          selected
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Right Icon (Chevron) -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
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
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  id?: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  required?: boolean
  leftIcon?: any
  options: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script> 