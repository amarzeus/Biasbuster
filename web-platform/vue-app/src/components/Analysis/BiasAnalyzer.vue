<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Bias Analysis</h2>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="realtimeAnalysis"
              class="form-checkbox h-4 w-4 text-blue-600"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">Real-time Analysis</span>
          </label>
          <button
            @click="clearContent"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 btn-secondary"
            data-test="clear-button"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="relative">
        <textarea
          v-model="content"
          @input="handleContentInput"
          placeholder="Enter text to analyze for bias..."
          class="w-full h-48 p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="isAnalyzing"
          data-test="content-input"
        ></textarea>
        <div v-if="isAnalyzing" class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg" data-test="loading-state">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white loading-spinner"></div>
        </div>
      </div>

      <button
        @click="analyzeContent"
        :disabled="!content || isAnalyzing"
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
        data-test="analyze-button"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Content' }}
      </button>
    </div>

    <div v-if="analysisResult" class="space-y-6" data-test="analysis-results">
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Overall Bias Score</h3>
        <div class="mt-4 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Bias Level:</span>
            <span :class="[
              'px-2 py-1 text-sm font-medium rounded',
              getBiasLevelClass(analysisResult.overallScore)
            ]">
              {{ getBiasLevel(analysisResult.overallScore) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Bias Score:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ (analysisResult.overallScore * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Word Count:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ analysisResult.wordCount }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="analysisResult.biasInstances.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Bias Instances</h3>
        <div class="space-y-4">
          <div
            v-for="(instance, index) in analysisResult.biasInstances"
            :key="index"
            class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ instance.type }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Severity: {{ instance.severity }}
              </span>
            </div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ instance.biasedText }}
            </p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ instance.explanation }}
            </p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ instance.suggestion }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="analysisResult.suggestions && analysisResult.suggestions.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Suggestions</h3>
        <div class="space-y-4">
          <div
            v-for="(suggestion, index) in analysisResult.suggestions"
            :key="index"
            class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ suggestion }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import { debounce } from 'lodash-es'
import { useToast } from '@/composables/useToast'

const store = useAnalysisStore()
const content = ref('')
const isAnalyzing = ref(false)
const realtimeAnalysis = ref(false)
const analysisResult = ref(null)
const toast = useToast()

const handleContentInput = debounce(() => {
  if (realtimeAnalysis.value && content.value) {
    analyzeContent()
  }
}, 500)

const analyzeContent = async () => {
  if (!content.value) return

  isAnalyzing.value = true
  try {
    const result = await store.analyzeBias({ text: content.value })
    analysisResult.value = result
  } catch (error) {
    console.error('Error analyzing content:', error)
    toast.show({
      type: 'error',
      message: 'Failed to analyze content. Please try again.'
    })
  } finally {
    isAnalyzing.value = false
  }
}

const clearContent = () => {
  content.value = ''
  analysisResult.value = null
}

const getBiasLevel = (score) => {
  if (score >= 0.7) return 'High'
  if (score >= 0.4) return 'Medium'
  return 'Low'
}

const getBiasLevelClass = (score) => {
  if (score >= 0.7) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (score >= 0.4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

watch(realtimeAnalysis, (newValue) => {
  if (newValue && content.value) {
    analyzeContent()
  }
})
</script>

<style scoped>
.bias-analyzer {
  @apply max-w-3xl mx-auto;
}
</style>
