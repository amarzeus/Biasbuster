import { defineStore } from 'pinia'

interface BiasInstance {
  type: string
  biasedText: string
  explanation: string
  suggestion: string
  context: string
  severity: 'low' | 'medium' | 'high'
}

interface AnalysisResult {
  overallScore: number
  biasInstances: BiasInstance[]
  timestamp: string
  wordCount: number
}

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    isAnalyzing: false,
    lastResult: null as AnalysisResult | null,
    error: null as string | null
  }),

  actions: {
    async analyzeBias(content: string): Promise<AnalysisResult> {
      this.isAnalyzing = true
      this.error = null

      try {
        // TODO: Implement actual API call to backend
        // For now, return mock data
        const result: AnalysisResult = {
          overallScore: 0.75,
          biasInstances: [
            {
              type: 'gender',
              biasedText: 'he',
              explanation: 'Gender bias detected',
              suggestion: 'Consider using gender-neutral language',
              context: 'Test context',
              severity: 'high'
            }
          ],
          timestamp: new Date().toISOString(),
          wordCount: content.split(/\s+/).length
        }

        this.lastResult = result
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred'
        throw error
      } finally {
        this.isAnalyzing = false
      }
    },

    clearResults() {
      this.lastResult = null
      this.error = null
    }
  }
}) 