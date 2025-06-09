<template>
  <div>
    <!-- Tab list -->
    <div
      class="border-b border-gray-200 dark:border-gray-700"
      role="tablist"
    >
      <div class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :id="`${id}-tab-${tab.id}`"
          :class="[
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            isActive(tab.id)
              ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
          ]"
          :aria-selected="isActive(tab.id)"
          :aria-controls="`${id}-panel-${tab.id}`"
          role="tab"
          @click="selectTab(tab.id)"
          @keydown.enter="selectTab(tab.id)"
          @keydown.space="selectTab(tab.id)"
        >
          <div class="flex items-center">
            <component
              v-if="tab.icon"
              :is="tab.icon"
              class="mr-2 h-5 w-5"
              :class="isActive(tab.id) ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'"
            />
            {{ tab.label }}
            <span
              v-if="tab.badge"
              :class="[
                'ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium',
                isActive(tab.id)
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              {{ tab.badge }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Tab panels -->
    <div class="mt-4">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :id="`${id}-panel-${tab.id}`"
        :class="{ hidden: !isActive(tab.id) }"
        role="tabpanel"
        :aria-labelledby="`${id}-tab-${tab.id}`"
      >
        <slot
          :name="tab.id"
          :tab="tab"
        />
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
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => {
        return (
          typeof tab.id === 'string' &&
          typeof tab.label === 'string' &&
          (!tab.icon || typeof tab.icon === 'object') &&
          (!tab.badge || typeof tab.badge === 'string' || typeof tab.badge === 'number')
        )
      })
    }
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Methods
const isActive = (tabId) => {
  return props.modelValue === tabId
}

const selectTab = (tabId) => {
  emit('update:modelValue', tabId)
}
</script> 