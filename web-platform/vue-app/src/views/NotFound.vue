<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div class="text-9xl font-bold text-trust-blue dark:text-trust-teal mb-8">
        404
      </div>

      <!-- Message -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>

      <!-- Navigation Links -->
      <div class="space-y-4">
        <router-link to="/" 
                     class="block w-full btn-primary text-center py-3">
          Return Home
        </router-link>
        <router-link to="/demo" 
                     class="block w-full btn-secondary text-center py-3">
          Try Demo
        </router-link>
      </div>

      <!-- Helpful Links -->
      <div class="mt-8 space-y-2">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          You might want to check out:
        </h2>
        <router-link to="/features" 
                     class="block text-trust-blue hover:text-trust-blue-dark">
          Features Overview
        </router-link>
        <router-link to="/docs" 
                     class="block text-trust-blue hover:text-trust-blue-dark">
          Documentation
        </router-link>
        <router-link to="/ai-literacy" 
                     class="block text-trust-blue hover:text-trust-blue-dark">
          AI Literacy Hub
        </router-link>
      </div>
    </div>
  </div>
</template>
