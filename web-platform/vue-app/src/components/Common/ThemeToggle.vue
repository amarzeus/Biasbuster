<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-trust-blue dark:focus:ring-trust-teal transition-colors duration-200"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <transition
      name="theme-icon"
      mode="out-in"
    >
      <SunIcon
        v-if="isDark"
        key="sun"
        class="h-5 w-5"
        aria-hidden="true"
      />
      <MoonIcon
        v-else
        key="moon"
        class="h-5 w-5"
        aria-hidden="true"
      />
    </transition>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.2s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
