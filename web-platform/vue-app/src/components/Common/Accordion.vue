<template>
  <div
    :id="id"
    class="divide-y divide-gray-200 dark:divide-gray-700"
    :class="[className]"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="py-4 first:pt-0 last:pb-0"
    >
      <button
        type="button"
        class="flex w-full items-start justify-between text-left"
        :class="[
          item.disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800',
          getButtonClasses()
        ]"
        :disabled="item.disabled"
        @click="toggleItem(item.id)"
      >
        <!-- Header content -->
        <div class="flex items-center">
          <!-- Icon -->
          <component
            v-if="item.icon"
            :is="item.icon"
            class="mr-3 h-5 w-5 flex-shrink-0"
            :class="[
              isOpen(item.id)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            ]"
            aria-hidden="true"
          />

          <!-- Title -->
          <div>
            <h3
              class="font-medium"
              :class="[
                isOpen(item.id)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-900 dark:text-white',
                getTitleClasses()
              ]"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.description"
              class="mt-1"
              :class="[
                isOpen(item.id)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400',
                getDescriptionClasses()
              ]"
            >
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- Toggle icon -->
        <span class="ml-6 flex h-7 items-center">
          <svg
            class="h-6 w-6 transform"
            :class="[
              isOpen(item.id) ? 'rotate-180' : '',
              getIconClasses()
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>

      <!-- Content -->
      <div
        v-show="isOpen(item.id)"
        class="mt-2 pr-12"
        :class="[getContentClasses()]"
      >
        <slot
          :name="item.id"
          :item="item"
          :is-open="isOpen(item.id)"
        >
          <div
            v-if="item.content"
            class="prose prose-sm dark:prose-invert"
            v-html="item.content"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => {
        return (
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          (item.description === undefined || typeof item.description === 'string') &&
          (item.content === undefined || typeof item.content === 'string') &&
          (item.icon === undefined || typeof item.icon === 'string') &&
          (item.disabled === undefined || typeof item.disabled === 'boolean')
        )
      })
    }
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  className: {
    type: String,
    default: ''
  }
})

const openItems = ref(new Set())

const isOpen = (id) => openItems.value.has(id)

const toggleItem = (id) => {
  if (openItems.value.has(id)) {
    openItems.value.delete(id)
  } else {
    openItems.value.add(id)
  }
}

const getButtonClasses = () => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return sizes[props.size]
}

const getTitleClasses = () => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return sizes[props.size]
}

const getDescriptionClasses = () => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  return sizes[props.size]
}

const getIconClasses = () => {
  const sizes = {
    sm: 'text-gray-400 dark:text-gray-500',
    md: 'text-gray-400 dark:text-gray-500',
    lg: 'text-gray-400 dark:text-gray-500'
  }
  return sizes[props.size]
}

const getContentClasses = () => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return sizes[props.size]
}
</script> 