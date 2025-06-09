import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export function useBiasAnalysis() {
  const { post } = useApi()
  const isAnalyzing = ref(false)
  const analysisResult = ref(null)
  const error = ref(null)

  const analyzeText = async (text) => {
    try {
      isAnalyzing.value = true
      error.value = null
      
      const response = await post('/api/analyze', { text })
      analysisResult.value = response.data
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to analyze text'
      throw err
    } finally {
      isAnalyzing.value = false
    }
  }

  const getBiasExplanation = (biasType) => {
    const explanations = {
      framing: 'This content uses framing bias by presenting information in a way that influences interpretation.',
      omission: 'This content omits important context or information that could change the meaning.',
      language: 'This content uses biased language that may influence perception.',
      source: 'This content relies on potentially biased sources.',
      statistical: 'This content presents statistics in a misleading way.'
    }
    return explanations[biasType] || 'This content shows potential bias.'
  }

  const getUnbiasedRewrite = async (text, biasType) => {
    try {
      const response = await post('/api/rewrite', { text, biasType })
      return response.data.rewrittenText
    } catch (err) {
      error.value = err.message || 'Failed to generate unbiased rewrite'
      throw err
    }
  }

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeText,
    getBiasExplanation,
    getUnbiasedRewrite
  }
} 