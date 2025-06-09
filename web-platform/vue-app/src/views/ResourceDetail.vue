<template>
  <div class="resource-detail">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Resource Details</h1>
        <div v-if="resource" class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ resource.title }}</h2>
            <p class="mt-2 text-gray-600">{{ resource.description }}</p>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Related Resources</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a v-for="link in resource.links" 
                 :key="link.url" 
                 :href="link.url"
                 class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <span class="text-blue-600 hover:text-blue-800">{{ link.text }}</span>
              </a>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Resource not found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const resource = ref(null)

// Mock data - replace with actual API call
const mockResources = {
  'inclusive-language': {
    title: 'Inclusive Language Guide',
    description: 'A comprehensive guide to using inclusive language in professional and personal communication.',
    links: [
      { text: 'Download PDF Guide', url: '#' },
      { text: 'Interactive Examples', url: '#' },
      { text: 'Best Practices', url: '#' }
    ]
  },
  'bias-detection': {
    title: 'Bias Detection Workshop',
    description: 'Learn how to identify and address bias in communication through interactive workshops.',
    links: [
      { text: 'Workshop Materials', url: '#' },
      { text: 'Case Studies', url: '#' },
      { text: 'Practice Exercises', url: '#' }
    ]
  }
}

onMounted(() => {
  // In a real application, this would be an API call
  const resourceId = route.params.id
  resource.value = mockResources[resourceId] || null
})
</script>

<style scoped>
.resource-detail {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style> 