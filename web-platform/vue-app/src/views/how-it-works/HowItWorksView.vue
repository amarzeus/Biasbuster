<template>
  <div class="how-it-works-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>How Biasbuster Works</h1>
        <p class="subtitle">Discover how our AI-powered platform helps you identify and understand bias in digital content.</p>
      </div>
    </section>

    <!-- Step-by-Step Guide -->
    <section class="steps-section">
      <div class="container">
        <h2>Simple Steps to Get Started</h2>
        <div class="steps-timeline">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Install the Extension</h3>
              <p>Add Biasbuster to your Chrome browser with one click.</p>
              <div class="step-image">
                <img src="@/assets/images/screenshots/install-extension.svg" alt="Install Extension" />
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Browse as Usual</h3>
              <p>Visit any website and let Biasbuster analyze the content in real-time.</p>
              <div class="step-image">
                <img src="@/assets/images/screenshots/browse-content.svg" alt="Browse Content" />
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>View Analysis</h3>
              <p>See highlighted bias instances with detailed explanations.</p>
              <div class="step-image">
                <img src="@/assets/images/screenshots/view-analysis.svg" alt="View Analysis" />
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Learn & Improve</h3>
              <p>Access educational resources and track your progress.</p>
              <div class="step-image">
                <img src="@/assets/images/screenshots/learn-improve.svg" alt="Learn and Improve" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Demo -->
    <section class="demo-section">
      <div class="container">
        <h2>Try It Yourself</h2>
        <div class="demo-container">
          <div class="demo-tabs">
            <Button
              v-for="tab in demoTabs"
              :key="tab.id"
              :variant="activeTab === tab.id ? 'primary' : 'outline'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </Button>
          </div>
          <div class="demo-content">
            <div v-if="activeTab === 'news'" class="demo-panel">
              <h3>News Article Analysis</h3>
              <div class="demo-text">
                <p>Try analyzing this sample news article for bias:</p>
                <TextArea
                  v-model="demoText"
                  :rows="6"
                  placeholder="Paste or type content to analyze..."
                />
                <Button
                  variant="primary"
                  @click="analyzeText"
                  :loading="analyzing"
                >
                  Analyze Text
                </Button>
              </div>
            </div>
            <div v-if="activeTab === 'social'" class="demo-panel">
              <h3>Social Media Analysis</h3>
              <div class="demo-text">
                <p>Test bias detection on social media content:</p>
                <TextArea
                  v-model="socialText"
                  :rows="6"
                  placeholder="Paste social media content..."
                />
                <Button
                  variant="primary"
                  @click="analyzeSocial"
                  :loading="analyzing"
                >
                  Analyze Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- User Flow Diagram -->
    <section class="flow-section">
      <div class="container">
        <h2>User Flow</h2>
        <div class="flow-diagram">
          <div class="mermaid">
            graph TD
              A[User Visits Website] --> B{Extension Active?}
              B -->|Yes| C[Content Analysis]
              B -->|No| D[Browse Normally]
              C --> E[Detect Bias]
              E --> F{Found Bias?}
              F -->|Yes| G[Show Highlights]
              F -->|No| H[Continue Browsing]
              G --> I[View Explanation]
              I --> J[Get Suggestions]
              J --> K[Learn More]
          </div>
        </div>
      </div>
    </section>

    <!-- Features Overview -->
    <section class="features-section">
      <div class="container">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="icon-ai"></i>
            <h3>AI-Powered Analysis</h3>
            <p>Advanced algorithms detect various types of bias in real-time.</p>
          </div>
          <div class="feature-card">
            <i class="icon-explain"></i>
            <h3>Clear Explanations</h3>
            <p>Understand why content is biased with detailed explanations.</p>
          </div>
          <div class="feature-card">
            <i class="icon-learn"></i>
            <h3>Educational Resources</h3>
            <p>Access comprehensive learning materials and guides.</p>
          </div>
          <div class="feature-card">
            <i class="icon-customize"></i>
            <h3>Customization</h3>
            <p>Adjust detection settings to match your preferences.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Start Detecting Bias?</h2>
        <p>Join thousands of users who trust Biasbuster for unbiased content analysis.</p>
        <div class="cta-buttons">
          <Button variant="primary" size="lg" @click="downloadExtension">
            Get Chrome Extension
          </Button>
          <Button variant="outline" size="lg" @click="learnMore">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'
import TextArea from '@/components/Common/TextArea.vue'

const router = useRouter()
const activeTab = ref('news')
const demoText = ref('')
const socialText = ref('')
const analyzing = ref(false)

const demoTabs = [
  { id: 'news', label: 'News Article' },
  { id: 'social', label: 'Social Media' }
]

const analyzeText = async () => {
  if (!demoText.value.trim()) return
  
  analyzing.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Handle analysis result
  } catch (error) {
    console.error('Analysis failed:', error)
  } finally {
    analyzing.value = false
  }
}

const analyzeSocial = async () => {
  if (!socialText.value.trim()) return
  
  analyzing.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Handle analysis result
  } catch (error) {
    console.error('Analysis failed:', error)
  } finally {
    analyzing.value = false
  }
}

const downloadExtension = () => {
  window.open('https://chrome.google.com/webstore/detail/biasbuster', '_blank')
}

const learnMore = () => {
  router.push('/features')
}

useHead({
  title: 'How It Works - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn how Biasbuster works with our step-by-step guide, interactive demo, and user flow diagrams.'
    }
  ]
})
</script>

<style scoped>
.how-it-works-view {
  @apply min-h-screen bg-white dark:bg-gray-900;
}

.hero {
  @apply py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.hero h1 {
  @apply text-4xl md:text-5xl font-bold mb-4;
}

.subtitle {
  @apply text-xl md:text-2xl opacity-90;
}

.steps-section {
  @apply py-20;
}

.steps-timeline {
  @apply mt-12 space-y-12;
}

.step-item {
  @apply flex items-start gap-8;
}

.step-number {
  @apply w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0;
}

.step-content {
  @apply flex-1;
}

.step-content h3 {
  @apply text-2xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.step-image {
  width: 100%;
  max-width: 1920px;
  height: auto;
  margin-bottom: 1rem;
}

.demo-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800;
}

.demo-container {
  @apply mt-12 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6;
}

.demo-tabs {
  @apply flex gap-4 mb-6;
}

.demo-panel {
  @apply p-6;
}

.demo-panel h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.demo-text {
  @apply space-y-4;
}

.flow-section {
  @apply py-20;
}

.flow-diagram {
  @apply mt-12 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6;
}

.features-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800;
}

.features-grid {
  @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12;
}

.feature-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.feature-card i {
  @apply text-4xl text-blue-600 dark:text-blue-400 mb-4;
}

.feature-card h3 {
  @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
}

.cta-section {
  @apply py-20 text-center;
}

.cta-section h2 {
  @apply text-3xl font-bold mb-4 text-gray-900 dark:text-white;
}

.cta-section p {
  @apply text-xl mb-8 text-gray-600 dark:text-gray-300;
}

.cta-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

@media (max-width: 768px) {
  .step-item {
    @apply flex-col;
  }
  
  .step-number {
    @apply mb-4;
  }
}
</style> 