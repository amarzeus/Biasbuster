import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BiasAnalyzer from '../BiasAnalyzer.vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from 'composables/useToast'

vi.mock('composables/useToast', () => ({
  useToast: () => ({
    show: vi.fn()
  })
}))

describe('BiasAnalyzer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(BiasAnalyzer)
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with empty content', () => {
    const wrapper = mount(BiasAnalyzer)
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.element.value).toBe('')
  })

  it('updates content on input', async () => {
    const wrapper = mount(BiasAnalyzer)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test content for analysis')
    expect(textarea.element.value).toBe('Test content for analysis')
  })

  it('shows loading state during analysis', async () => {
    const wrapper = mount(BiasAnalyzer)
    const store = useAnalysisStore()
    
    // Mock the analysis function to delay
    vi.spyOn(store, 'analyzeBias').mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 100))
    })

    // Trigger analysis
    await wrapper.find('textarea').setValue('Test content')
    await wrapper.find('.btn-primary').trigger('click')

    // Check loading state
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('displays analysis results when available', async () => {
    const wrapper = mount(BiasAnalyzer)
    const store = useAnalysisStore()
    
    const mockResult = {
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
      wordCount: 10
    }

    // Mock the analysis function
    vi.spyOn(store, 'analyzeBias').mockResolvedValue(mockResult)

    // Trigger analysis
    await wrapper.find('textarea').setValue('Test content')
    await wrapper.find('.btn-primary').trigger('click')
    await wrapper.vm.$nextTick()

    // Check results display
    expect(wrapper.text()).toContain('Overall Bias Score')
    expect(wrapper.text()).toContain('Gender bias detected')
    expect(wrapper.text()).toContain('Consider using gender-neutral language')
  })

  it('handles analysis errors', async () => {
    const wrapper = mount(BiasAnalyzer)
    const store = useAnalysisStore()
    const toast = useToast()
    
    // Mock the analysis function to throw error
    vi.spyOn(store, 'analyzeBias').mockRejectedValue(new Error('Analysis failed'))

    // Trigger analysis
    await wrapper.find('textarea').setValue('Test content')
    await wrapper.find('.btn-primary').trigger('click')
    await wrapper.vm.$nextTick()

    // Check error handling
    expect(toast.show).toHaveBeenCalledWith({
      type: 'error',
      message: 'Failed to analyze content. Please try again.'
    })
  })

  it('clears content when clear button is clicked', async () => {
    const wrapper = mount(BiasAnalyzer)
    
    // Set content
    await wrapper.find('textarea').setValue('Test content')
    expect(wrapper.find('textarea').element.value).toBe('Test content')

    // Clear content
    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('handles real-time analysis setting', async () => {
    const wrapper = mount(BiasAnalyzer)
    const store = useAnalysisStore()
    
    // Mock the analysis function
    vi.spyOn(store, 'analyzeBias').mockResolvedValue({
      overallScore: 0.5,
      biasInstances: [],
      timestamp: new Date().toISOString(),
      wordCount: 10
    })

    // Enable real-time analysis
    await wrapper.find('input[type="checkbox"]').setValue(true)
    
    // Type content
    await wrapper.find('textarea').setValue('Test content for real-time analysis')
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    // Verify analysis was triggered
    expect(store.analyzeBias).toHaveBeenCalled()
  })
})
