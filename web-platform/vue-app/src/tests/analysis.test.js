import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBySideAnalyzer from '@/components/Analysis/SideBySideAnalyzer.vue'
import { createTestingPinia } from '@pinia/testing'

describe('SideBySideAnalyzer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SideBySideAnalyzer, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
  })

  it('renders the component correctly', () => {
    expect(wrapper.find('.max-w-7xl').exists()).toBe(true)
  })

  it('handles content input and analysis', async () => {
    const testContent = 'The elderly man struggled with the new technology, while the young woman easily mastered it.'
    
    await wrapper.find('textarea').setValue(testContent)
    await wrapper.vm.analyzeContent()
    
    expect(wrapper.vm.analysisResult).toBeTruthy()
    expect(wrapper.vm.analysisResult.biasInstances.length).toBeGreaterThan(0)
  })

  it('handles custom keywords', async () => {
    const keyword = 'problematic'
    await wrapper.vm.addKeyword(keyword)
    expect(wrapper.vm.customKeywords).toContain(keyword)
  })

  it('exports analysis results', async () => {
    const testContent = 'Sample content for testing'
    await wrapper.find('textarea').setValue(testContent)
    await wrapper.vm.analyzeContent()
    
    const exportSpy = vi.spyOn(wrapper.vm, 'exportAnalysis')
    await wrapper.find('button[aria-label="Export analysis"]').trigger('click')
    expect(exportSpy).toHaveBeenCalled()
  })

  it('handles accessibility features', async () => {
    await wrapper.vm.toggleHighContrast()
    expect(wrapper.vm.highContrast).toBe(true)
    
    await wrapper.vm.toggleAccessibility()
    expect(wrapper.vm.accessibilityMode).toBe(true)
  })

  it('processes different analysis modes', async () => {
    const modes = ['standard', 'deep', 'educational']
    
    for (const mode of modes) {
      wrapper.vm.analysisMode = mode
      await wrapper.vm.analyzeContent()
      expect(wrapper.vm.analysisResult.mode).toBe(mode)
    }
  })
}) 