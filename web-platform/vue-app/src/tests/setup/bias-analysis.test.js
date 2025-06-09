import { render, fireEvent, waitFor } from '@testing-library/vue'
import { useBiasAnalysis } from '@/composables/useBiasAnalysis'
import { useApi } from '@/composables/useApi'

// Mock the API
jest.mock('@/composables/useApi', () => ({
  useApi: () => ({
    post: jest.fn()
  })
}))

describe('Bias Analysis Features', () => {
  let mockPost

  beforeEach(() => {
    mockPost = jest.fn()
    useApi().post = mockPost
  })

  test('analyzes text and returns results', async () => {
    const mockResponse = {
      data: {
        biases: [
          { type: 'framing', text: 'This is biased text', explanation: 'Framing bias detected' }
        ],
        score: 0.8
      }
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const { analyzeText, isAnalyzing, analysisResult, error } = useBiasAnalysis()
    
    expect(isAnalyzing.value).toBe(false)
    expect(analysisResult.value).toBe(null)
    expect(error.value).toBe(null)

    const result = await analyzeText('Test text')
    
    expect(isAnalyzing.value).toBe(false)
    expect(analysisResult.value).toEqual(mockResponse.data)
    expect(error.value).toBe(null)
    expect(result).toEqual(mockResponse.data)
    expect(mockPost).toHaveBeenCalledWith('/api/analyze', { text: 'Test text' })
  })

  test('handles analysis errors', async () => {
    const mockError = new Error('Analysis failed')
    mockPost.mockRejectedValueOnce(mockError)

    const { analyzeText, isAnalyzing, analysisResult, error } = useBiasAnalysis()
    
    await expect(analyzeText('Test text')).rejects.toThrow('Analysis failed')
    
    expect(isAnalyzing.value).toBe(false)
    expect(analysisResult.value).toBe(null)
    expect(error.value).toBe('Analysis failed')
  })

  test('provides bias explanations', () => {
    const { getBiasExplanation } = useBiasAnalysis()
    
    expect(getBiasExplanation('framing')).toBe('This content uses framing bias by presenting information in a way that influences interpretation.')
    expect(getBiasExplanation('omission')).toBe('This content omits important context or information that could change the meaning.')
    expect(getBiasExplanation('unknown')).toBe('This content shows potential bias.')
  })

  test('generates unbiased rewrites', async () => {
    const mockResponse = {
      data: {
        rewrittenText: 'This is an unbiased version of the text.'
      }
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const { getUnbiasedRewrite, error } = useBiasAnalysis()
    
    const result = await getUnbiasedRewrite('Biased text', 'framing')
    
    expect(result).toBe('This is an unbiased version of the text.')
    expect(error.value).toBe(null)
    expect(mockPost).toHaveBeenCalledWith('/api/rewrite', { 
      text: 'Biased text', 
      biasType: 'framing' 
    })
  })

  test('handles rewrite errors', async () => {
    const mockError = new Error('Rewrite failed')
    mockPost.mockRejectedValueOnce(mockError)

    const { getUnbiasedRewrite, error } = useBiasAnalysis()
    
    await expect(getUnbiasedRewrite('Test text', 'framing')).rejects.toThrow('Rewrite failed')
    expect(error.value).toBe('Rewrite failed')
  })
}) 