<template>
  <button
    type="button"
    @click="toggleTheme"
    class="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    :aria-label="isDark ? 'Toggle light mode' : 'Toggle dark mode'"
    data-test="theme-toggle"
  >
    <div data-test="theme-icon">
      <SunIcon
        v-if="!isDark"
        class="h-6 w-6"
        data-test="theme-icon-light"
      />
      <MoonIcon
        v-else
        class="h-6 w-6"
        data-test="theme-icon-dark"
      />
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-icon {
  transition: transform 0.2s ease-in-out;
}
</style>
