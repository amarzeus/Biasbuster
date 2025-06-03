<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Powerful Features for Bias Detection
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover the comprehensive tools and capabilities that make BiasBuster the leading platform for identifying and addressing bias in content.
        </p>
      </div>

      <!-- Feature Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="feature in features" :key="feature.id" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-trust-blue dark:bg-trust-teal rounded-lg">
              <div class="h-6 w-6 text-white">{{ feature.icon }}</div>
            </div>
            <h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ feature.description }}
          </p>
          <ul class="space-y-2">
            <li v-for="benefit in feature.benefits" :key="benefit"
                class="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span class="h-4 w-4 text-green-500 mr-2 flex-shrink-0">✓</span>
              {{ benefit }}
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center bg-gradient-to-r from-trust-blue to-trust-teal rounded-lg p-8">
        <h2 class="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-blue-100 mb-6">
          Try our bias detection tools today and create more inclusive content.
        </p>
        <div class="space-x-4">
          <router-link to="/demo" 
                       class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-trust-blue bg-white hover:bg-gray-50 transition-colors">
            Try Demo
          </router-link>
          <router-link to="/docs" 
                       class="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-trust-blue transition-colors">
            View Documentation
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    id: 1,
    title: 'Real-time Analysis',
    description: 'Get instant feedback on bias in your content as you write.',
    icon: '📊',
    benefits: [
      'Immediate bias detection',
      'Live suggestions',
      'Contextual recommendations'
    ]
  },
  {
    id: 2,
    title: 'Multiple Bias Categories',
    description: 'Detect various types of bias including gender, racial, political, and cultural.',
    icon: '👥',
    benefits: [
      'Comprehensive coverage',
      'Customizable categories',
      'Cultural sensitivity'
    ]
  },
  {
    id: 3,
    title: 'Smart Suggestions',
    description: 'Receive intelligent recommendations for more inclusive language.',
    icon: '💡',
    benefits: [
      'Context-aware suggestions',
      'Alternative phrasing',
      'Educational explanations'
    ]
  },
  {
    id: 4,
    title: 'Privacy Protection',
    description: 'Your content remains private with local processing options.',
    icon: '🔒',
    benefits: [
      'Local analysis mode',
      'Data encryption',
      'GDPR compliant'
    ]
  },
  {
    id: 5,
    title: 'Custom Configuration',
    description: 'Tailor the analysis to your specific needs and industry.',
    icon: '⚙️',
    benefits: [
      'Industry-specific rules',
      'Custom bias words',
      'Sensitivity adjustment'
    ]
  },
  {
    id: 6,
    title: 'Analytics Dashboard',
    description: 'Track your progress and bias reduction over time.',
    icon: '📈',
    benefits: [
      'Progress tracking',
      'Detailed reports',
      'Trend analysis'
    ]
  }
]
</script>
