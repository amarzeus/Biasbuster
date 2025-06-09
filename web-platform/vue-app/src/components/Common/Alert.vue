<template>
  <div
    :id="id"
    class="rounded-lg p-4"
    :class="[
      getVariantClasses(),
      dismissible ? 'pr-12' : '',
      className
    ]"
    role="alert"
  >
    <div class="flex">
      <!-- Icon -->
      <div v-if="icon || showIcon" class="flex-shrink-0">
        <slot name="icon">
          <component
            :is="getIconComponent()"
            class="h-5 w-5"
            :class="getIconClasses()"
            aria-hidden="true"
          />
        </slot>
      </div>

      <!-- Content -->
      <div class="ml-3 flex-1">
        <slot name="title">
          <h3
            v-if="title"
            class="text-sm font-medium"
            :class="getTitleClasses()"
          >
            {{ title }}
          </h3>
        </slot>
        <div
          v-if="$slots.default"
          class="mt-2 text-sm"
          :class="getContentClasses()"
        >
          <slot />
        </div>
      </div>

      <!-- Dismiss button -->
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="getDismissButtonClasses()"
            @click="$emit('dismiss')"
          >
            <span class="sr-only">Dismiss</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['dismiss'])

const getVariantClasses = () => {
  const variants = {
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200'
  }
  return variants[props.variant]
}

const getIconClasses = () => {
  const variants = {
    info: 'text-blue-400 dark:text-blue-300',
    success: 'text-green-400 dark:text-green-300',
    warning: 'text-yellow-400 dark:text-yellow-300',
    error: 'text-red-400 dark:text-red-300'
  }
  return variants[props.variant]
}

const getTitleClasses = () => {
  const variants = {
    info: 'text-blue-800 dark:text-blue-200',
    success: 'text-green-800 dark:text-green-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    error: 'text-red-800 dark:text-red-200'
  }
  return variants[props.variant]
}

const getContentClasses = () => {
  const variants = {
    info: 'text-blue-700 dark:text-blue-300',
    success: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    error: 'text-red-700 dark:text-red-300'
  }
  return variants[props.variant]
}

const getDismissButtonClasses = () => {
  const variants = {
    info: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70',
    success: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/70',
    warning: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400 dark:hover:bg-yellow-900/70',
    error: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/70'
  }
  return variants[props.variant]
}

const getIconComponent = () => {
  if (props.icon) return props.icon

  const icons = {
    info: 'InformationCircleIcon',
    success: 'CheckCircleIcon',
    warning: 'ExclamationTriangleIcon',
    error: 'XCircleIcon'
  }
  return icons[props.variant]
}
</script> 