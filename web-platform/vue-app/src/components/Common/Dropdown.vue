<template>
  <div class="relative">
    <!-- Trigger -->
    <div
      ref="trigger"
      class="inline-block"
      @click="toggle"
    >
      <slot name="trigger" />
    </div>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="dropdown"
        class="absolute z-50 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white dark:ring-opacity-10"
        :class="[
          {
            'origin-top-right right-0': position === 'right',
            'origin-top-left left-0': position === 'left'
          }
        ]"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
      >
        <!-- Dropdown Items -->
        <template v-for="(item, index) in items" :key="index">
          <!-- Divider -->
          <div
            v-if="item.divider"
            class="my-1 border-t border-gray-200 dark:border-gray-700"
          />

          <!-- Dropdown Item -->
          <button
            v-else
            class="flex w-full items-center px-4 py-2 text-sm"
            :class="[
              {
                'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50': !item.disabled,
                'cursor-not-allowed text-gray-400 dark:text-gray-500': item.disabled
              }
            ]"
            :disabled="item.disabled"
            role="menuitem"
            tabindex="-1"
            @click="!item.disabled && selectItem(item)"
          >
            <!-- Icon -->
            <component
              v-if="item.icon"
              :is="item.icon"
              class="mr-3 h-5 w-5"
              :class="{
                'text-gray-400 dark:text-gray-500': !item.disabled,
                'text-gray-300 dark:text-gray-600': item.disabled
              }"
            />

            <!-- Label -->
            <span>{{ item.label }}</span>

            <!-- Shortcut -->
            <span
              v-if="item.shortcut"
              class="ml-auto text-xs text-gray-400 dark:text-gray-500"
            >
              {{ item.shortcut }}
            </span>
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => {
        return (
          (item.divider === true) ||
          (
            typeof item.label === 'string' &&
            (!item.disabled || typeof item.disabled === 'boolean') &&
            (!item.shortcut || typeof item.shortcut === 'string')
          )
        )
      })
    }
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  }
})

const emit = defineEmits(['select'])

// State
const isOpen = ref(false)
const trigger = ref(null)
const dropdown = ref(null)

// Toggle Dropdown
const toggle = () => {
  isOpen.value = !isOpen.value
}

// Select Item
const selectItem = (item) => {
  emit('select', item)
  isOpen.value = false
}

// Click Outside
const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    trigger.value &&
    dropdown.value &&
    !trigger.value.contains(event.target) &&
    !dropdown.value.contains(event.target)
  ) {
    isOpen.value = false
  }
}

// Keyboard Navigation
const handleKeyDown = (event) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      isOpen.value = false
      break
    case 'Tab':
      isOpen.value = false
      break
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script> 