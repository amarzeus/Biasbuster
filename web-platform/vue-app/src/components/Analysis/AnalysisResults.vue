<template>
  <div class="analysis-results">
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <div v-else-if="results" class="space-y-6">
      <!-- Summary Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Total Biases Detected</p>
            <p class="text-2xl font-bold text-primary-600">{{ results.totalBiases }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Bias Categories</p>
            <p class="text-2xl font-bold text-primary-600">{{ results.categories.length }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Confidence Score</p>
            <p class="text-2xl font-bold text-primary-600">{{ results.confidenceScore }}%</p>
          </div>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
        <div class="space-y-4">
          <div v-for="(category, index) in results.categories" :key="index" class="border-b border-gray-200 pb-4 last:border-0">
            <h4 class="font-medium text-gray-900 mb-2">{{ category.name }}</h4>
            <p class="text-sm text-gray-600 mb-2">{{ category.description }}</p>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-500">Severity:</span>
              <span :class="getSeverityClass(category.severity)">{{ category.severity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <ul class="space-y-3">
          <li v-for="(rec, index) in results.recommendations" :key="index" class="flex items-start">
            <span class="flex-shrink-0 h-5 w-5 text-primary-600">•</span>
            <span class="ml-2 text-gray-600">{{ rec }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  results: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const getSeverityClass = (severity) => {
  const classes = {
    'High': 'text-red-600 font-medium',
    'Medium': 'text-yellow-600 font-medium',
    'Low': 'text-green-600 font-medium'
  }
  return classes[severity] || 'text-gray-600 font-medium'
}
</script>

<style scoped>
.analysis-results {
  @apply max-w-4xl mx-auto;
}
</style> 