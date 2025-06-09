<template>
  <div class="space-y-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error-500"
      >
        *
      </span>
    </label>

    <!-- Helper text -->
    <p
      v-if="helper"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helper }}
    </p>

    <!-- Drop zone -->
    <div
      :class="[
        'mt-1 flex justify-center rounded-lg border border-dashed px-6 py-10',
        'border-gray-300 dark:border-gray-600',
        'hover:border-gray-400 dark:hover:border-gray-500',
        'focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
        'dark:focus-within:border-primary-400 dark:focus-within:ring-primary-400',
        { 'cursor-not-allowed opacity-50': disabled }
      ]"
      :class="{ 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900': isDragging }"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="text-center">
        <component
          v-if="icon"
          :is="icon"
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
        />
        <svg
          v-else
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
          <label
            :for="id"
            class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            :class="{ 'cursor-not-allowed': disabled }"
          >
            <span>Upload a file</span>
            <input
              :id="id"
              type="file"
              class="sr-only"
              :accept="accept"
              :multiple="multiple"
              :required="required"
              :disabled="disabled"
              @change="handleFileChange"
            />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ accept ? `Accepted formats: ${accept}` : 'Any file type' }}
          {{ maxSize ? `(Max size: ${formatFileSize(maxSize)})` : '' }}
        </p>
      </div>
    </div>

    <!-- Selected files -->
    <ul
      v-if="modelValue?.length"
      class="mt-4 divide-y divide-gray-200 dark:divide-gray-700"
    >
      <li
        v-for="(file, index) in modelValue"
        :key="index"
        class="flex items-center justify-between py-3"
      >
        <div class="flex items-center">
          <svg
            class="h-5 w-5 text-gray-400 dark:text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ file.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(file.size) }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="ml-4 text-sm font-medium text-error-600 hover:text-error-500 dark:text-error-400 dark:hover:text-error-300"
          @click="removeFile(index)"
        >
          Remove
        </button>
      </li>
    </ul>

    <!-- Error message -->
    <p
      v-if="error"
      class="mt-1 text-sm text-error-500"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: null
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
  },
  icon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isDragging = ref(false)

// Methods
const handleDragEnter = () => {
  if (!props.disabled) {
    isDragging.value = true
  }
}

const handleDragOver = () => {
  if (!props.disabled) {
    isDragging.value = true
  }
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  isDragging.value = false
  if (props.disabled) return

  const files = Array.from(event.dataTransfer.files)
  handleFiles(files)
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  handleFiles(files)
}

const handleFiles = (files) => {
  if (!files.length) return

  // Validate file types
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const invalidFiles = files.filter(file => {
      return !acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.startsWith(type)
      })
    })

    if (invalidFiles.length) {
      emit('error', 'Invalid file type')
      return
    }
  }

  // Validate file sizes
  if (props.maxSize) {
    const oversizedFiles = files.filter(file => file.size > props.maxSize)
    if (oversizedFiles.length) {
      emit('error', 'File size exceeds limit')
      return
    }
  }

  // Update model value
  const newFiles = props.multiple ? [...props.modelValue, ...files] : files
  emit('update:modelValue', newFiles)
}

const removeFile = (index) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script> 