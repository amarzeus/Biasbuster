<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Demo Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Biasbuster Demo
        </h1>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Feature Showcase -->
      <div class="space-y-8">
        <!-- Real-time Analysis Demo -->
        <section class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Real-time Bias Detection
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <p class="text-gray-600 dark:text-gray-300">
                Experience our powerful real-time bias detection in action. Type or paste content to see instant analysis.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="category in demoCategories"
                  :key="category.name"
                  @click="loadCategoryExample(category)"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {{ category.name }}
                </button>
              </div>
              <textarea
                v-model="demoContent"
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-trust-blue dark:focus:ring-trust-teal focus:border-trust-blue dark:focus:border-trust-teal dark:bg-gray-700 dark:text-white"
                placeholder="Try our demo content or paste your own..."
              ></textarea>
              <div class="flex space-x-4">
                <button
                  @click="loadDemoContent"
                  class="btn-secondary"
                >
                  Load Demo Content
                </button>
                <button
                  @click="clearContent"
                  class="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Analysis Results
              </h3>
              <div v-if="analysisResult" class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-neutral-700 dark:text-gray-300">
                    Overall Bias Score
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ Math.round(analysisResult.overallScore * 100) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="biasScoreColor"
                    :style="{ width: `${analysisResult.overallScore * 100}%` }"
                  ></div>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="instance in analysisResult.biasInstances"
                    :key="instance.biasedText"
                    class="p-3 bg-white dark:bg-gray-800 rounded"
                  >
                    <div class="flex justify-between items-start">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ instance.type }}
                      </span>
                      <span
                        class="px-2 py-1 text-xs rounded-full"
                        :class="severityClass(instance.severity)"
                      >
                        {{ instance.severity }}
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ instance.explanation }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">
                  Enter content to see analysis results
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Key Features -->
        <section class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <div class="text-trust-blue dark:text-trust-teal mb-4">
                <component :is="feature.icon" class="w-8 h-8" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- Use Cases -->
        <section class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Use Cases
          </h2>
          <div class="space-y-6">
            <div
              v-for="useCase in useCases"
              :key="useCase.title"
              class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ useCase.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ useCase.description }}
              </p>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Benefits:
                </h4>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                  <li v-for="benefit in useCase.benefits" :key="benefit">
                    {{ benefit }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Call to Action -->
        <section class="bg-trust-blue dark:bg-trust-teal rounded-lg p-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-white mb-4">
              Ready to Make Your Content More Inclusive?
            </h2>
            <p class="text-white opacity-90 mb-6">
              Start using Biasbuster today to create fair and balanced content.
            </p>
            <div class="flex justify-center space-x-4">
              <router-link
                to="/analysis"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-trust-blue dark:text-trust-teal bg-white hover:bg-gray-50"
              >
                Try Now
              </router-link>
              <router-link
                to="/education"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-trust-teal dark:bg-trust-blue hover:bg-opacity-90"
              >
                Learn More
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'

const analysisStore = useAnalysisStore()
const demoContent = ref('')
const analysisResult = ref(null)

const features = [
  {
    title: 'Real-time Analysis',
    description: 'Get instant feedback on potential bias as you write.',
    icon: 'LightningBoltIcon'
  },
  {
    title: 'Multiple Bias Types',
    description: 'Detect various forms of bias including gender, racial, age, and more.',
    icon: 'ScaleIcon'
  },
  {
    title: 'Educational Resources',
    description: 'Learn about different types of bias and how to avoid them.',
    icon: 'AcademicCapIcon'
  }
]

const useCases = [
  {
    title: 'Content Creation',
    description: 'Perfect for writers, journalists, and content creators who want to ensure their work is inclusive and unbiased.',
    benefits: [
      'Real-time bias detection',
      'Multiple bias type coverage',
      'Educational resources'
    ]
  },
  {
    title: 'Academic Writing',
    description: 'Ideal for researchers and students who need to maintain objectivity in their academic work.',
    benefits: [
      'Academic writing guidelines',
      'Citation bias detection',
      'Research methodology review'
    ]
  },
  {
    title: 'Business Communication',
    description: 'Essential for businesses that want to maintain inclusive and professional communication.',
    benefits: [
      'Professional tone analysis',
      'Inclusive language suggestions',
      'Brand voice consistency'
    ]
  }
]

const demoTexts = [
  'The elderly man struggled with the new technology, while the young woman easily mastered it.',
  'The company hired a diverse group of employees, including women and minorities.',
  'The doctor and his nurse worked together to treat the patient.',
  'The Asian student excelled in mathematics, while the American student struggled.',
  'The disabled employee needed special accommodations to work effectively.',
  'The single mother juggled her career and family responsibilities.',
  'The foreign worker brought unique perspectives to the team.',
  'The overweight person struggled to keep up with the fitness program.',
  'The religious minority faced discrimination in the workplace.',
  'The LGBTQ+ community celebrated their annual pride parade.'
]

const demoCategories = [
  {
    name: 'Age Bias',
    examples: [
      'The elderly man struggled with the new technology, while the young woman easily mastered it.',
      'The senior citizen needed help understanding the smartphone.',
      'The young intern showed remarkable tech-savvy skills.'
    ]
  },
  {
    name: 'Gender Bias',
    examples: [
      'The doctor and his nurse worked together to treat the patient.',
      'The female CEO balanced her work and family life.',
      'The male nurse provided excellent care to the patients.'
    ]
  },
  {
    name: 'Racial Bias',
    examples: [
      'The Asian student excelled in mathematics, while the American student struggled.',
      'The African American athlete showed natural talent in sports.',
      'The Hispanic worker brought cultural diversity to the team.'
    ]
  },
  {
    name: 'Socioeconomic Bias',
    examples: [
      'The single mother juggled her career and family responsibilities.',
      'The working-class family struggled to make ends meet.',
      'The wealthy entrepreneur donated to charity.'
    ]
  }
]

function loadDemoContent() {
  const randomIndex = Math.floor(Math.random() * demoTexts.length)
  demoContent.value = demoTexts[randomIndex]
  analyzeContent()
}

function clearContent() {
  demoContent.value = ''
  analysisResult.value = null
}

async function analyzeContent() {
  if (demoContent.value.length > 0) {
    try {
      analysisResult.value = await analysisStore.analyzeContent({
        content: demoContent.value,
        mode: 'standard',
        customKeywords: []
      })
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }
}

function loadCategoryExample(category) {
  const randomIndex = Math.floor(Math.random() * category.examples.length)
  demoContent.value = category.examples[randomIndex]
  analyzeContent()
}

const biasScoreColor = computed(() => {
  if (!analysisResult.value) return ''
  const score = analysisResult.value.overallScore * 100
  if (score >= 70) return 'bg-red-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
})

function severityClass(severity) {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Watch for content changes
watch(demoContent, () => {
  if (demoContent.value.length > 50) {
    analyzeContent()
  }
})
</script>

<style scoped>
.btn-secondary {
  @apply px-4 py-2 bg-gray-100 dark:bg-gray-700 text-neutral-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal;
}
</style>
