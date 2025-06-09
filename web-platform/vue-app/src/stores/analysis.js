import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const MAX_HISTORY = 50

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    settings: {
      sensitivity: 0.5,
      categories: ['political', 'gender', 'racial', 'cultural'],
      customKeywords: []
    },
    history: [],
    savedAnalyses: [],
    recentAnalyses: [],
    isAnalyzing: false,
    analysisProgress: 0
  }),

  getters: {
    savedAnalysesList: (state) => state.savedAnalyses,
    recentAnalysesList: (state) => state.recentAnalyses,
    biasStats: (state) => {
      if (state.history.length === 0) {
        return {
          total: 0,
          averageScore: 0,
          byCategory: {}
        }
      }

      const total = state.history.length
      const averageScore = state.history.reduce((sum, analysis) => sum + analysis.overallScore, 0) / total
      const byCategory = state.history.reduce((acc, analysis) => {
        analysis.biasInstances.forEach(instance => {
          acc[instance.type] = (acc[instance.type] || 0) + 1
        })
        return acc
      }, {})

      return {
        total,
        averageScore,
        byCategory
      }
    }
  },

  actions: {
    async analyzeBias(text) {
      try {
        const response = await axios.post('/api/analyze', { text: text.text })
        const result = {
          ...response.data,
          timestamp: new Date().toISOString(),
          wordCount: text.text.split(/\s+/).length
        }

        this.history.unshift(result)
        if (this.history.length > 50) {
          this.history.pop()
        }

        return result
      } catch (error) {
        console.error('Error analyzing bias:', error)
        throw error
      }
    },

    async getBiasExplanation(category, text) {
      try {
        const response = await axios.post('/api/explain', { category, text })
        return response.data
      } catch (error) {
        console.error('Error getting bias explanation:', error)
        throw error
      }
    },

    async getBiasSuggestions(category, text) {
      try {
        const response = await axios.post('/api/suggest', { category, text })
        return response.data
      } catch (error) {
        console.error('Error getting bias suggestions:', error)
        throw error
      }
    },

    updateSettings(newSettings) {
      this.settings = {
        ...this.settings,
        ...newSettings
      }
    },

    clearHistory() {
      this.history = []
    },

    saveAnalysis(analysis) {
      this.savedAnalyses.push({
        ...analysis,
        savedAt: new Date().toISOString()
      })
    },

    deleteAnalysis(index) {
      this.savedAnalyses.splice(index, 1)
    }
  }
})
