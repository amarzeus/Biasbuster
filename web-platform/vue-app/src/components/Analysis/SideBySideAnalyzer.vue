<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Enhanced Header Controls -->
    <div class="mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <label class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Highlight Color</label>
            <input 
              type="color" 
              v-model="highlightColor"
              class="w-8 h-8 rounded cursor-pointer"
              title="Choose highlight color"
              aria-label="Choose highlight color"
            >
          </div>
          <div class="flex items-center">
            <label class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
            <select 
              v-model="fontSize"
              class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              aria-label="Select font size"
            >
              <option value="sm">Small</option>
              <option value="base">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <!-- New: Analysis Mode Selector -->
          <div class="flex items-center">
            <label class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Mode</label>
            <select 
              v-model="analysisMode"
              class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              aria-label="Select analysis mode"
            >
              <option value="standard">Standard</option>
              <option value="deep">Deep Analysis</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- New: Export Button -->
          <button 
            @click="exportAnalysis"
            class="btn-secondary"
            :disabled="!analysisResult"
            aria-label="Export analysis"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
          <!-- New: Save Analysis Button -->
          <button 
            @click="saveAnalysis"
            class="btn-secondary"
            :disabled="!analysisResult"
            aria-label="Save analysis"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
          <button 
            @click="toggleHighContrast"
            class="btn-secondary"
            :class="{ 'bg-gray-200 dark:bg-gray-700': highContrast }"
            aria-label="Toggle high contrast mode"
          >
            <span class="sr-only">Toggle high contrast</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
          <button 
            @click="toggleAccessibility"
            class="btn-secondary"
            :class="{ 'bg-gray-200 dark:bg-gray-700': accessibilityMode }"
            aria-label="Toggle accessibility mode"
          >
            <span class="sr-only">Toggle accessibility mode</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Content Input -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Original Content
          </h2>
          <div class="flex space-x-2">
            <button
              @click="clearContent"
              class="btn-secondary"
            >
              Clear
            </button>
            <button
              @click="loadDemoContent"
              class="btn-secondary"
            >
              Load Demo
            </button>
          </div>
        </div>
        <textarea
          v-model="content"
          rows="12"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-trust-blue dark:focus:ring-trust-teal focus:border-trust-blue dark:focus:border-trust-teal dark:bg-gray-700 dark:text-white"
          placeholder="Paste your content here..."
        ></textarea>
      </div>

      <!-- Right Column: Analysis Results -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Analysis Results
          </h2>
          <div class="flex space-x-2">
            <button
              v-if="analysisResult"
              @click="exportAnalysis"
              class="btn-secondary"
            >
              Export
            </button>
            <button
              v-if="analysisResult"
              @click="saveAnalysis"
              class="btn-secondary"
            >
              Save
            </button>
          </div>
        </div>
        <div v-if="isAnalyzing" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-blue dark:border-trust-teal mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Analyzing content...
          </p>
        </div>
        <div v-else-if="analysisResult">
          <AnalysisResults :analysis="analysisResult" />
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            Enter content to see analysis results
          </p>
        </div>
      </div>
    </div>

    <!-- Custom Keywords Section -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Custom Keywords
        </h2>
        <div class="flex space-x-2">
          <button
            @click="showKeywordModal = true"
            class="btn-secondary"
          >
            Add Keyword
          </button>
          <button
            @click="exportKeywords"
            class="btn-secondary"
          >
            Export
          </button>
          <button
            @click="importKeywords"
            class="btn-secondary"
          >
            Import
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="keyword in customKeywords"
          :key="keyword"
          class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
        >
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ keyword }}</span>
          <button
            @click="removeKeyword(keyword)"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Keyword Modal -->
    <Modal
      v-if="showKeywordModal"
      @close="showKeywordModal = false"
      title="Add Custom Keyword"
    >
      <div class="space-y-4">
        <div>
          <label
            for="keyword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            v-model="newKeyword"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-trust-blue dark:focus:ring-trust-teal focus:border-trust-blue dark:focus:border-trust-teal dark:bg-gray-700 dark:text-white"
            placeholder="Enter a keyword to detect"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="showKeywordModal = false"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="addKeyword"
            class="btn-primary"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>

    <!-- Enhanced Tooltip -->
    <Tooltip
      v-if="activeTooltip"
      :id="activeTooltip.id"
      :content="activeTooltip.content"
      :position="activeTooltip.position"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import Tooltip from '@/components/Common/Tooltip.vue'
import AnalysisResults from './AnalysisResults.vue'
import Modal from '@/components/Common/Modal.vue'

// Enhanced State
const content = ref('')
const isAnalyzing = ref(false)
const highlightColor = ref(localStorage.getItem('highlightColor') || '#ff0000')
const fontSize = ref(localStorage.getItem('fontSize') || 'base')
const highContrast = ref(localStorage.getItem('highContrast') === 'true')
const accessibilityMode = ref(localStorage.getItem('accessibilityMode') === 'true')
const analysisMode = ref(localStorage.getItem('analysisMode') || 'standard')
const biasFilter = ref('all')
const severityFilter = ref('all')
const analysisProgress = ref(0)
const analysisProgressMessage = ref('Initializing analysis...')
const showKeywordModal = ref(false)
const newKeyword = ref('')
const analysisResult = ref(null)
const customKeywords = ref([])
const activeTooltip = ref(null)

// New: Bias Types Configuration
const biasTypes = [
  { name: 'Political', color: '#ff0000' },
  { name: 'Gender', color: '#ff6b6b' },
  { name: 'Racial', color: '#4ecdc4' },
  { name: 'Age', color: '#45b7d1' },
  { name: 'Socioeconomic', color: '#96ceb4' },
  { name: 'Cultural', color: '#ffeead' },
  { name: 'Religious', color: '#ff9999' },
  { name: 'Geographic', color: '#99b898' }
]

// New: Educational Insights
const educationalInsights = ref([])

// Store and composables
const analysis = useAnalysisStore()
const toast = useToast()

// Persist settings
watch(highlightColor, (newColor) => {
  localStorage.setItem('highlightColor', newColor)
})

watch(fontSize, (newSize) => {
  localStorage.setItem('fontSize', newSize)
})

watch(highContrast, (newValue) => {
  localStorage.setItem('highContrast', newValue)
  document.documentElement.classList.toggle('high-contrast', newValue)
})

watch(accessibilityMode, (newValue) => {
  localStorage.setItem('accessibilityMode', newValue)
  document.documentElement.classList.toggle('accessibility-mode', newValue)
})

watch(analysisMode, (newMode) => {
  localStorage.setItem('analysisMode', newMode)
  if (analysisResult.value) {
    analyzeContent()
  }
})

// Computed Properties
const fontSizeClass = computed(() => ({
  'text-sm': fontSize.value === 'sm',
  'text-base': fontSize.value === 'base',
  'text-lg': fontSize.value === 'lg'
}))

const biasScoreColor = computed(() => {
  const score = analysisResult.value?.overallScore * 100
  if (score >= 70) return 'bg-red-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
})

const filteredBiasInstances = computed(() => {
  if (!analysisResult.value) return []
  
  return analysisResult.value.biasInstances.filter(instance => {
    const typeMatch = biasFilter.value === 'all' || instance.type === biasFilter.value
    const severityMatch = severityFilter.value === 'all' || instance.severity === severityFilter.value
    return typeMatch && severityMatch
  })
})

const highlightedContent = computed(() => {
  if (!analysisResult.value) return ''
  
  let text = content.value
  analysisResult.value.biasInstances.forEach(instance => {
    const regex = new RegExp(instance.biasedText, 'gi')
    text = text.replace(regex, match => {
      const tooltipId = `tooltip-${instance.type}-${match.toLowerCase().replace(/\s+/g, '-')}`
      return `<span 
        class="highlight" 
        style="background-color: ${highlightColor.value}"
        data-tooltip-id="${tooltipId}"
        @mouseenter="showTooltip('${tooltipId}', '${instance.explanation}')"
        @mouseleave="hideTooltip"
      >${match}</span>`
    })
  })
  
  return text
})

// Methods
let debounceTimeout
const handleInput = async () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    if (content.value.length > 50) {
      await analyzeContent()
    }
  }, 1000)
}

const analyzeContent = async () => {
  isAnalyzing.value = true
  analysisProgress.value = 0
  
  try {
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      if (analysisProgress.value < 90) {
        analysisProgress.value += 10
        updateProgressMessage()
      }
    }, 500)

    const result = await analysis.analyzeContent({
      content: content.value,
      mode: analysisMode.value,
      customKeywords: customKeywords.value
    })

    clearInterval(progressInterval)
    analysisProgress.value = 100
    analysisResult.value = result

    // Generate educational insights if in educational mode
    if (analysisMode.value === 'educational') {
      educationalInsights.value = await generateEducationalInsights(result)
    }
  } catch (error) {
    toast.error('Analysis failed. Please try again.')
  } finally {
    isAnalyzing.value = false
  }
}

const updateProgressMessage = () => {
  const messages = [
    'Initializing analysis...',
    'Scanning for potential biases...',
    'Analyzing language patterns...',
    'Checking for contextual bias...',
    'Generating suggestions...',
    'Finalizing results...'
  ]
  const index = Math.floor(analysisProgress.value / 20)
  analysisProgressMessage.value = messages[index] || messages[messages.length - 1]
}

const generateEducationalInsights = async (analysisResult) => {
  // Generate educational insights based on detected biases
  return analysisResult.biasInstances.map(instance => ({
    id: Math.random().toString(36).substr(2, 9),
    title: `Understanding ${instance.type} Bias`,
    description: `This type of bias often manifests through ${instance.explanation.toLowerCase()}. Learn how to identify and address it.`,
    resource: `/education/${instance.type.toLowerCase()}-bias`
  }))
}

const exportAnalysis = () => {
  const exportData = {
    content: content.value,
    analysis: analysisResult.value,
    timestamp: new Date().toISOString(),
    settings: {
      highlightColor: highlightColor.value,
      fontSize: fontSize.value,
      analysisMode: analysisMode.value
    }
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bias-analysis-${new Date().toISOString()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const saveAnalysis = async () => {
  try {
    await useAnalysisStore().saveAnalysis({
      content: content.value,
      analysis: analysisResult.value,
      settings: {
        highlightColor: highlightColor.value,
        fontSize: fontSize.value,
        analysisMode: analysisMode.value
      }
    })
    toast.success('Analysis saved successfully')
  } catch (error) {
    toast.error('Failed to save analysis')
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    content.value = text
    await analyzeContent()
  } catch (error) {
    toast.error('Failed to paste from clipboard')
  }
}

const uploadFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.txt,.md,.doc,.docx'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const text = await file.text()
        content.value = text
        await analyzeContent()
      } catch (error) {
        toast.error('Failed to read file')
      }
    }
  }
  
  input.click()
}

const importKeywords = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.txt'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const text = await file.text()
        const keywords = JSON.parse(text)
        customKeywords.value = [...new Set([...customKeywords.value, ...keywords])]
        toast.success('Keywords imported successfully')
      } catch (error) {
        toast.error('Failed to import keywords')
      }
    }
  }
  
  input.click()
}

const exportKeywords = () => {
  const blob = new Blob([JSON.stringify(customKeywords.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bias-keywords.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const applySuggestion = (instance) => {
  const suggestion = instance.aiSuggestion
  content.value = content.value.replace(instance.biasedText, suggestion)
  analyzeContent()
}

const severityClass = (severity) => {
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

function getBiasLevelDescription(score) {
  if (score < 30) return 'Low bias - The content appears to be relatively neutral and objective.'
  if (score < 60) return 'Moderate bias - Some biased language or perspectives detected.'
  return 'High bias - Significant bias detected. Consider revising for more neutral language.'
}

function clearContent() {
  content.value = ''
  analysisResult.value = null
}

function addKeyword() {
  const keyword = newKeyword.value.trim()
  if (keyword && !customKeywords.value.includes(keyword)) {
    customKeywords.value.push(keyword)
    newKeyword.value = ''
    if (content.value) {
      analyzeContent()
    }
  }
}

function removeKeyword(keyword) {
  customKeywords.value = customKeywords.value.filter(k => k !== keyword)
  if (content.value) {
    analyzeContent()
  }
}

function toggleHighContrast() {
  highContrast.value = !highContrast.value
}

function toggleAccessibility() {
  accessibilityMode.value = !accessibilityMode.value
}

function showTooltip(id, content) {
  activeTooltip.value = { id, content }
}

function hideTooltip() {
  activeTooltip.value = null
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-trust-blue dark:bg-trust-teal text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal;
}

.prose :deep(span[data-bias]) {
  @apply cursor-help;
  background-color: v-bind('highlightColor');
  opacity: 0.2;
}

.prose :deep(span[data-bias]:hover) {
  opacity: 0.4;
}

/* High Contrast Mode */
:global(.high-contrast) {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
  color: rgb(255 255 255 / var(--tw-bg-opacity));
}

:global(.high-contrast) .highlight {
  background-color: yellow !important;
  color: black !important;
}

/* Accessibility Mode */
:global(.accessibility-mode) {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  letter-spacing: 0.0125em;
}

:global(.accessibility-mode) .highlight {
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: currentColor;
}
</style> 