<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Documentation
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Complete guides and API references to help you integrate BiasBuster into your applications.
        </p>
      </div>

      <!-- Documentation Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Navigation
            </h3>
            <nav class="space-y-2">
              <a v-for="section in docSections" :key="section.id"
                 href="#" 
                 @click="activeSection = section.id"
                 :class="[
                   'block px-3 py-2 rounded-md text-sm transition-colors',
                   activeSection === section.id 
                     ? 'bg-trust-blue text-white' 
                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                 ]">
                {{ section.title }}
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div v-for="section in docSections" :key="section.id" 
                 v-show="activeSection === section.id">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {{ section.title }}
              </h2>
              <div class="prose dark:prose-invert max-w-none">
                <div v-html="section.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeSection = ref('getting-started')

const docSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
      <h3>Quick Start Guide</h3>
      <p>Get up and running with BiasBuster in minutes.</p>
      
      <h4>Installation</h4>
      <pre><code>npm install @biasbuster/sdk</code></pre>
      
      <h4>Basic Usage</h4>
      <pre><code>import { BiasBuster } from '@biasbuster/sdk'

const analyzer = new BiasBuster({
  apiKey: 'your-api-key'
})

const result = await analyzer.analyze('Your text here')
console.log(result)</code></pre>
    `
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: `
      <h3>REST API Endpoints</h3>
      
      <h4>POST /api/analysis/analyze</h4>
      <p>Analyze text for bias detection.</p>
      
      <h5>Request Body:</h5>
      <pre><code>{
  "text": "string",
  "sensitivity": 0.5,
  "categories": ["political", "gender", "racial"],
  "customWords": {}
}</code></pre>
      
      <h5>Response:</h5>
      <pre><code>{
  "overallScore": 0.3,
  "BiasInstances": [...],
  "suggestions": [...],
  "timestamp": "2024-01-01T00:00:00Z"
}</code></pre>
    `
  },
  {
    id: 'browser-extension',
    title: 'Browser Extension',
    content: `
      <h3>Browser Extension Guide</h3>
      <p>Install and configure the BiasBuster browser extension for real-time analysis.</p>
      
      <h4>Installation</h4>
      <ol>
        <li>Download from Chrome Web Store</li>
        <li>Click "Add to Chrome"</li>
        <li>Configure your preferences</li>
      </ol>
      
      <h4>Features</h4>
      <ul>
        <li>Real-time text analysis</li>
        <li>Contextual suggestions</li>
        <li>Privacy-focused local processing</li>
      </ul>
    `
  },
  {
    id: 'integration',
    title: 'Integration Guide',
    content: `
      <h3>Integration Examples</h3>
      
      <h4>React Integration</h4>
      <pre><code>import { useBiasBuster } from '@biasbuster/react'

function MyComponent() {
  const { analyze, isLoading, result } = useBiasBuster()
  
  const handleAnalyze = async (text) => {
    await analyze(text)
  }
  
  return (
    <div>
      {/* Your component */}
    </div>
  )
}</code></pre>
      
      <h4>Vue Integration</h4>
      <pre><code>import { useBiasBuster } from '@biasbuster/vue'

export default {
  setup() {
    const { analyze, isLoading, result } = useBiasBuster()
    
    return {
      analyze,
      isLoading,
      result
    }
  }
}</code></pre>
    `
  }
]
</script>
