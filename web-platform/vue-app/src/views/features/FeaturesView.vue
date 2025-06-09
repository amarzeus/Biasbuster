<template>
  <div class="features-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Powerful Features for Bias Detection</h1>
        <p class="subtitle">Discover how Biasbuster helps you identify and understand bias in digital content.</p>
      </div>
    </section>

    <!-- Chrome Extension -->
    <section class="feature-section">
      <div class="container">
        <div class="feature-content">
          <div class="feature-text">
            <h2>Chrome Extension</h2>
            <p>Real-time bias detection as you browse the web. Our Chrome extension provides instant analysis and suggestions for more balanced content.</p>
            <ul class="feature-list">
              <li>
                <i class="icon-check"></i>
                <span>Side-by-side content analysis</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Customizable bias detection</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Instant unbiased rewrites</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Seamless website integration</span>
              </li>
            </ul>
            <Button variant="primary" @click="downloadExtension">
              Get Chrome Extension
            </Button>
          </div>
          <div class="feature-image">
            <img src="@/assets/images/screenshots/extension-demo.svg" alt="Chrome Extension Demo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Web App -->
    <section class="feature-section bg-gray-50 dark:bg-gray-800">
      <div class="container">
        <div class="feature-content reverse">
          <div class="feature-text">
            <h2>Web Platform</h2>
            <p>Access powerful bias detection tools and educational resources through our intuitive web platform.</p>
            <ul class="feature-list">
              <li>
                <i class="icon-check"></i>
                <span>Advanced content analysis</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Educational resources</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Progress tracking</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Community features</span>
              </li>
            </ul>
            <Button variant="primary" @click="tryWebApp">
              Try Web App
            </Button>
          </div>
          <div class="feature-image">
            <img src="@/assets/images/screenshots/web-app-demo.svg" alt="Web App Demo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Analytics Dashboard -->
    <section class="feature-section">
      <div class="container">
        <div class="feature-content">
          <div class="feature-text">
            <h2>Analytics Dashboard</h2>
            <p>Track your bias detection journey with detailed analytics and insights.</p>
            <ul class="feature-list">
              <li>
                <i class="icon-check"></i>
                <span>Usage statistics</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Bias type distribution</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Progress tracking</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Custom reports</span>
              </li>
            </ul>
            <Button variant="primary" @click="viewDashboard">
              View Dashboard
            </Button>
          </div>
          <div class="feature-image">
            <img src="@/assets/images/screenshots/dashboard-demo.svg" alt="Analytics Dashboard Demo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Education Hub -->
    <section class="feature-section bg-gray-50 dark:bg-gray-800">
      <div class="container">
        <div class="feature-content reverse">
          <div class="feature-text">
            <h2>Education Hub</h2>
            <p>Learn about different types of bias and how to spot them with our interactive educational resources.</p>
            <ul class="feature-list">
              <li>
                <i class="icon-check"></i>
                <span>Interactive lessons</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Practice exercises</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Progress tracking</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Certification program</span>
              </li>
            </ul>
            <Button variant="primary" @click="exploreEducation">
              Explore Education Hub
            </Button>
          </div>
          <div class="feature-image">
            <img src="@/assets/images/screenshots/education-demo.svg" alt="Education Hub Demo" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>Ready to Start Detecting Bias?</h2>
        <p>Join thousands of users who trust Biasbuster for unbiased content analysis.</p>
        <div class="cta-buttons">
          <Button variant="primary" size="lg" @click="getStarted">
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" @click="contactSales">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'

const router = useRouter()

const downloadExtension = () => {
  window.open('https://chrome.google.com/webstore/detail/biasbuster', '_blank')
}

const tryWebApp = () => {
  router.push('/demo')
}

const viewDashboard = () => {
  router.push('/dashboard')
}

const exploreEducation = () => {
  router.push('/education')
}

const getStarted = () => {
  router.push('/signup')
}

const contactSales = () => {
  router.push('/contact')
}

useHead({
  title: 'Features - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Discover Biasbuster\'s powerful features for bias detection, including the Chrome extension, web platform, analytics dashboard, and education hub.'
    }
  ]
})
</script>

<style scoped>
.features-view {
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

.feature-section {
  @apply py-20;
}

.feature-content {
  @apply flex flex-col md:flex-row items-center gap-12;
}

.feature-content.reverse {
  @apply md:flex-row-reverse;
}

.feature-text {
  @apply flex-1;
}

.feature-text h2 {
  @apply text-3xl font-bold mb-6 text-gray-900 dark:text-white;
}

.feature-text p {
  @apply text-lg mb-8 text-gray-600 dark:text-gray-300;
}

.feature-list {
  @apply space-y-4 mb-8;
}

.feature-list li {
  @apply flex items-center gap-3 text-gray-700 dark:text-gray-200;
}

.feature-list i {
  @apply text-green-500;
}

.feature-image {
  @apply flex-1;
}

.feature-image img {
  @apply rounded-lg shadow-xl;
}

.cta {
  @apply py-20 text-center;
}

.cta h2 {
  @apply text-3xl font-bold mb-4 text-gray-900 dark:text-white;
}

.cta p {
  @apply text-xl mb-8 text-gray-600 dark:text-gray-300;
}

.cta-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

@media (max-width: 768px) {
  .feature-content {
    @apply text-center;
  }
  
  .feature-list {
    @apply inline-block text-left;
  }
}

.feature-image {
  width: 100%;
  max-width: 1920px;
  height: auto;
  margin-bottom: 1rem;
}
</style> 