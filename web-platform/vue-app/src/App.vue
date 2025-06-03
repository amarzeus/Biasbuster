<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-trust-blue dark:text-trust-teal">
                BiasBuster
              </router-link>
            </div>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                active-class="border-b-2 border-trust-blue dark:border-trust-teal"
              >
                Home
              </router-link>
              <router-link
                to="/features"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                active-class="border-b-2 border-trust-blue dark:border-trust-teal"
              >
                Features
              </router-link>
              <router-link
                to="/demo"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                active-class="border-b-2 border-trust-blue dark:border-trust-teal"
              >
                Demo
              </router-link>
              <router-link
                to="/docs"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                active-class="border-b-2 border-trust-blue dark:border-trust-teal"
              >
                Docs
              </router-link>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view v-slot="{ Component }">
        <transition
          name="page"
          mode="out-in"
          appear
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/Common/ThemeToggle.vue'
import ToastNotification from '@/components/Common/ToastNotification.vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
