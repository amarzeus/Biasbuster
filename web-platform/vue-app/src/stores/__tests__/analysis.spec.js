import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAnalysisStore } from '../analysis'
import axios from 'axios'

describe('Analysis Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useAnalysisStore()
    expect(store.history).toEqual([])
    expect(store.settings).toEqual({
      sensitivity: 0.5,
      categories: ['political', 'gender', 'racial', 'cultural'],
      customKeywords: []
    })
  })

  it('analyzes bias and updates history', async () => {
    const store = useAnalysisStore()
    const mockResponse = {
      data: {
        overallScore: 0.75,
        biasInstances: [
          {
            type: 'gender',
            explanation: 'Gender bias detected',
            suggestion: 'Consider using gender-neutral language',
            context: 'Test context',
            severity: 'high'
          }
        ]
      }
    }

    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse)
    
    const result = await store.analyzeBias({ text: 'Test text' })
    
    expect(result.overallScore).toBe(0.75)
    expect(store.history[0].overallScore).toBe(0.75)
    expect(store.history[0].biasInstances).toHaveLength(1)
    expect(store.history[0].wordCount).toBe(2)
  })

  it('limits history to 50 items', async () => {
    const store = useAnalysisStore()
    const mockResponse = {
      data: {
        overallScore: 0.5,
        biasInstances: []
      }
    }

    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse)
    
    for (let i = 0; i < 60; i++) {
      await store.analyzeBias({ text: `Test ${i}` })
    }

    expect(store.history.length).toBe(50)
  })

  it('gets bias explanation', async () => {
    const store = useAnalysisStore()
    const mockExplanation = { explanation: 'Test explanation' }
    
    vi.spyOn(axios, 'post').mockResolvedValue({ data: mockExplanation })
    
    const result = await store.getBiasExplanation('gender', 'Test text')
    expect(result).toEqual(mockExplanation)
  })

  it('gets bias suggestions', async () => {
    const store = useAnalysisStore()
    const mockSuggestions = { suggestions: ['Test suggestion'] }
    
    vi.spyOn(axios, 'post').mockResolvedValue({ data: mockSuggestions })
    
    const result = await store.getBiasSuggestions('gender', 'Test text')
    expect(result).toEqual(mockSuggestions)
  })

  it('updates settings', () => {
    const store = useAnalysisStore()
    const newSettings = { sensitivity: 0.7 }
    
    store.updateSettings(newSettings)
    expect(store.settings.sensitivity).toBe(0.7)
    expect(store.settings.categories).toEqual(['political', 'gender', 'racial', 'cultural'])
  })

  it('clears history', () => {
    const store = useAnalysisStore()
    store.history = [{ test: 'data' }]
    
    store.clearHistory()
    expect(store.history).toEqual([])
  })

  it('calculates bias stats correctly', async () => {
    const store = useAnalysisStore()
    const mockResponse = {
      data: {
        overallScore: 0.75,
        biasInstances: [
          { type: 'gender' },
          { type: 'gender' },
          { type: 'racial' }
        ]
      }
    }

    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse)
    await store.analyzeBias({ text: 'Test text' })

    const stats = store.biasStats
    expect(stats.total).toBe(1)
    expect(stats.averageScore).toBe(0.75)
    expect(stats.byCategory.gender).toBe(2)
    expect(stats.byCategory.racial).toBe(1)
  })
})
