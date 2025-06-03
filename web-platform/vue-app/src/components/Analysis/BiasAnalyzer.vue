<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <!-- Text Input Section -->
      <div class="mb-6">
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter text to analyze
        </label>
        <textarea
          id="content"
          v-model="content"
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-trust-blue dark:focus:ring-trust-teal focus:border-trust-blue dark:focus:border-trust-teal dark:bg-gray-700 dark:text-white"
          placeholder="Paste your article or text here..."
          @input="handleInput"
        ></textarea>
      </div>

      <!-- Analysis Controls -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          class="btn-primary"
          :disabled="!content || isAnalyzing"
          @click="analyzeContent"
        >
          <span v-if="isAnalyzing" class="flex items-center">
            <LoadingSpinner class="w-4 h-4 mr-2" />
            Analyzing...
          </span>
          <span v-else>
            Analyze Text
          </span>
        </button>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="settings.realTime"
              class="rounded border-gray-300 text-trust-blue focus:ring-trust-blue dark:border-gray-600 dark:bg-gray-700"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Real-time analysis</span>
          </label>

          <button
            class="btn-secondary"
            @click="clearContent"
            :disabled="!content || isAnalyzing"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="analysisResult" class="space-y-6">
        <!-- Overall Score -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Overall Bias Score
          </h3>
          <div class="flex items-center">
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full"
                :class="biasScoreColor"
                :style="{ width: `${analysisResult.overallScore * 100}%` }"
              ></div>
            </div>
            <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ Math.round(analysisResult.overallScore * 100) }}%
            </span>
          </div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ getBiasLevelDescription(analysisResult.overallScore * 100) }}
          </p>
        </div>

        <!-- Detailed Analysis -->
        <div v-if="analysisResult.BiasInstances.length > 0" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Detected Bias Instances
          </h3>
          
          <div v-for="(instance, index) in analysisResult.BiasInstances" :key="index" 
               class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              {{ instance.type }} Bias
            </h4>
            <div class="space-y-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium text-gray-700 dark:text-gray-300">
                  "{{ instance.biasedText }}"
                </span>
                - {{ instance.explanation }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">Suggestion:</span> {{ instance.suggestion }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">Context:</span> "...{{ instance.context }}..."
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">Severity:</span> {{ instance.severity }}
              </p>
            </div>
          </div>
        </div>

        <!-- Analysis Summary -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Analysis Summary
          </h3>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <p>Word Count: {{ analysisResult.wordCount }}</p>
            <p>Analysis Date: {{ new Date(analysisResult.timestamp).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isAnalyzing" class="text-center py-12">
        <LoadingSpinner class="w-8 h-8 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Analyzing your content...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!content" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          Enter your text above to detect potential biases
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'

const content = ref('')
const isAnalyzing = ref(false)
const settings = ref({
  realTime: false
})

const analysis = useAnalysisStore()
const toast = useToast()

const analysisResult = ref(null)

const biasScoreColor = computed(() => {
  const score = analysisResult.value?.overallScore * 100 || 0
  if (score < 30) return 'bg-green-500'
  if (score < 60) return 'bg-yellow-500'
  return 'bg-red-500'
})

function getBiasLevelDescription(score) {
  if (score < 30) return 'Low bias - The content appears to be relatively neutral and objective.'
  if (score < 60) return 'Moderate bias - Some biased language or perspectives detected.'
  return 'High bias - Significant bias detected. Consider revising for more neutral language.'
}

async function analyzeContent() {
  if (!content.value) return

  isAnalyzing.value = true
  try {
    analysisResult.value = await analysis.analyzeBias({
      text: content.value,
      sensitivity: 0.5,
      categories: ['political', 'gender', 'racial', 'cultural'],
      customWords: {}
    })
    
    toast.show({
      type: 'success',
      message: 'Analysis complete!'
    })
  } catch (error) {
    toast.show({
      type: 'error',
      message: 'Failed to analyze content. Please try again.'
    })
    analysisResult.value = null
  } finally {
    isAnalyzing.value = false
  }
}

function clearContent() {
  content.value = ''
  analysisResult.value = null
}

let debounceTimeout
function handleInput() {
  if (!settings.value.realTime) return
  
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    if (content.value.length > 50) {
      analyzeContent()
    }
  }, 1000)
}
</script>
