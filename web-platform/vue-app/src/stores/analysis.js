import { defineStore } from 'pinia'
import axios from 'axios'

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    isAnalyzing: false,
    analysisHistory: [],
    socket: null,
    customBiasWords: new Map(),
    biasCategories: new Set(['political', 'gender', 'racial', 'cultural', 'socioeconomic', 'religious']),
  }),

  actions: {
    async analyzeBias({ text, sensitivity, categories, customWords }) {
      this.isAnalyzing = true
      
      try {
        // First try WebSocket if available
        if (this.socket?.readyState === WebSocket.OPEN) {
          return await this.analyzeViaWebSocket(text, sensitivity, categories, customWords)
        }
        
        // Fallback to REST API
        return await this.analyzeViaREST(text, sensitivity, categories, customWords)
      } catch (error) {
        // If both WebSocket and REST fail, use local analysis
        return await this.performLocalAnalysis(text, sensitivity, categories, customWords)
      } finally {
        this.isAnalyzing = false
      }
    },

    async analyzeViaWebSocket(text, sensitivity, categories, customWords) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket analysis timeout'))
        }, 5000)

        this.socket.send(JSON.stringify({
          text,
          sensitivity,
          categories,
          customWords
        }))

        this.socket.onmessage = (event) => {
          clearTimeout(timeout)
          const result = JSON.parse(event.data)
          this.addToHistory(result)
          resolve(result)
        }

        this.socket.onerror = (error) => {
          clearTimeout(timeout)
          reject(error)
        }
      })
    },

    async analyzeViaREST(text, sensitivity, categories, customWords) {
      const response = await axios.post('/api/analysis/analyze', {
        text,
        sensitivity,
        categories,
        customWords
      })
      
      const result = response.data
      this.addToHistory(result)
      return result
    },

    async performLocalAnalysis(text, sensitivity = 0.5, categories = [], customWords = {}) {
      const biasInstances = []
      let totalScore = 0
      
      // Calculate word count
      const wordCount = text.trim().split(/\s+/).length
      
      // Process each enabled category
      for (const category of categories) {
        const words = customWords[category]?.split('\n').filter(Boolean) || this.getDefaultBiasWords(category)
        
        const categoryInstances = this.findBiasInCategory(text, category, words)
        biasInstances.push(...categoryInstances)
        
        if (categoryInstances.length > 0) {
          totalScore += Math.min(categoryInstances.length * 0.2, 1.0)
        }
      }
      
      const result = {
        text,
        overallScore: Math.min(totalScore / categories.length, 1.0),
        BiasInstances: biasInstances,
        suggestions: this.generateSuggestions(biasInstances),
        wordCount,
        timestamp: new Date().toISOString()
      }
      
      this.addToHistory(result)
      return result
    },

    findBiasInCategory(text, category, words) {
      const instances = []
      
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        let match
        
        while ((match = regex.exec(text)) !== null) {
          const start = Math.max(0, match.index - 50)
          const end = Math.min(text.length, match.index + word.length + 50)
          
          instances.push({
            type: category,
            biasedText: word,
            context: text.substring(start, end),
            explanation: this.getExplanation(word, category),
            suggestion: this.getSuggestion(word, category),
            severity: this.calculateSeverity(word, category)
          })
        }
      }
      
      return instances
    },

    getDefaultBiasWords(category) {
      const defaults = {
        political: [
          'radical', 'extremist', 'leftist', 'rightist', 'communist', 'socialist', 'fascist'
        ],
        gender: [
          'mankind', 'chairman', 'policeman', 'stewardess', 'housewife', 'mailman', 'businessman'
        ],
        racial: [
          'colored', 'oriental', 'ethnic', 'urban', 'ghetto', 'exotic', 'tribal'
        ],
        cultural: [
          'primitive', 'uncivilized', 'backward', 'third-world', 'developing', 'underdeveloped'
        ],
        socioeconomic: [
          'welfare queen', 'trailer trash', 'ghetto', 'poor', 'disadvantaged', 'low-class'
        ],
        religious: [
          'cultist', 'fanatic', 'zealot', 'fundamentalist', 'radical', 'extremist'
        ]
      }
      
      return defaults[category] || []
    },

    getExplanation(word, category) {
      return `The word "${word}" may carry ${category} bias and could be perceived as non-neutral.`
    },

    getSuggestion(word, category) {
      const suggestions = {
        political: {
          'radical': 'person with strong views',
          'extremist': 'person with extreme views',
          'leftist': 'person with progressive views',
          'rightist': 'person with conservative views'
        },
        gender: {
          'chairman': 'chairperson',
          'policeman': 'police officer',
          'stewardess': 'flight attendant',
          'businessman': 'businessperson',
          'mankind': 'humanity'
        },
        racial: {
          'colored': 'person of color',
          'oriental': 'Asian',
          'ethnic': 'from diverse backgrounds',
          'urban': 'city-dwelling'
        },
        cultural: {
          'primitive': 'traditional',
          'uncivilized': 'different cultural practices',
          'backward': 'developing',
          'third-world': 'developing nation'
        },
        socioeconomic: {
          'welfare queen': 'welfare recipient',
          'trailer trash': 'person living in a mobile home',
          'poor': 'economically disadvantaged',
          'low-class': 'economically challenged'
        },
        religious: {
          'cultist': 'religious practitioner',
          'fanatic': 'devoted believer',
          'zealot': 'passionate adherent',
          'fundamentalist': 'traditionalist'
        }
      }

      return suggestions[category]?.[word.toLowerCase()] || 
             `Consider using more neutral language instead of "${word}"`
    },

    calculateSeverity(word, category) {
      const highSeverityWords = {
        political: ['extremist', 'fascist'],
        racial: ['colored', 'oriental'],
        cultural: ['primitive', 'uncivilized'],
        religious: ['cultist', 'fanatic'],
        socioeconomic: ['trailer trash', 'welfare queen'],
        gender: []
      }

      const mediumSeverityWords = {
        political: ['radical', 'leftist', 'rightist'],
        racial: ['ethnic', 'urban'],
        cultural: ['backward', 'third-world'],
        religious: ['zealot', 'fundamentalist'],
        socioeconomic: ['ghetto', 'poor'],
        gender: ['chairman', 'policeman']
      }

      if (highSeverityWords[category]?.includes(word.toLowerCase())) return 'High'
      if (mediumSeverityWords[category]?.includes(word.toLowerCase())) return 'Medium'
      return 'Low'
    },

    generateSuggestions(biasInstances) {
      return biasInstances.map(instance => ({
        original: instance.biasedText,
        suggestion: instance.suggestion,
        context: instance.context
      }))
    },

    addToHistory(result) {
      this.analysisHistory.unshift({
        ...result,
        id: Date.now()
      })
      
      // Keep only last 50 analyses
      if (this.analysisHistory.length > 50) {
        this.analysisHistory.pop()
      }
      
      // Save to localStorage
      localStorage.setItem('analysis-history', JSON.stringify(this.analysisHistory))
    },

    initializeWebSocket() {
      try {
        this.socket = new WebSocket(`ws://${window.location.host}/analysis`)
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established')
        }

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.socket = null
        }

        this.socket.onclose = () => {
          console.log('WebSocket connection closed')
          this.socket = null
          // Attempt to reconnect after 5 seconds
          setTimeout(() => this.initializeWebSocket(), 5000)
        }
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        this.socket = null
      }
    }
  }
})
