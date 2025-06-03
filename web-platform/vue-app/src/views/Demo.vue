<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Try BiasBuster
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience our bias detection technology in action. Paste your text below to analyze it for potential biases.
        </p>
      </div>

      <!-- Demo Section -->
      <div class="max-w-4xl mx-auto">
        <BiasAnalyzer />
      </div>

      <!-- Additional Information -->
      <div class="mt-16 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          How It Works
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-trust-blue dark:bg-trust-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">1</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Input Text
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Paste your content into the text area above
              </p>
            </div>
          </div>
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-trust-blue dark:bg-trust-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">2</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Analyze
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Our AI analyzes the text for various types of bias
              </p>
            </div>
          </div>
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-trust-blue dark:bg-trust-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">3</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Review Results
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Get detailed feedback and suggestions for improvement
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Want to use BiasBuster in your own projects?
        </p>
        <div class="space-x-4">
          <router-link to="/docs" 
                       class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-trust-blue hover:bg-trust-blue-dark transition-colors">
            View Documentation
          </router-link>
          <router-link to="/pricing" 
                       class="inline-flex items-center px-6 py-3 border-2 border-trust-blue text-base font-medium rounded-md text-trust-blue hover:bg-trust-blue hover:text-white transition-colors">
            See Pricing
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BiasAnalyzer from '@/components/Analysis/BiasAnalyzer.vue'
</script>
