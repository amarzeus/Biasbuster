<template>
  <div class="support-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Help Center</h1>
        <p class="subtitle">Find answers, get support, and learn how to use Biasbuster effectively</p>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help..."
            class="search-input"
            @input="handleSearch"
          />
          <button class="search-button">
            <i class="icon-search"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Quick Links -->
          <div class="quick-links">
            <h2>Quick Links</h2>
            <div class="links-grid">
              <a href="#getting-started" class="link-card">
                <i class="icon-rocket"></i>
                <span>Getting Started</span>
              </a>
              <a href="#faq" class="link-card">
                <i class="icon-question"></i>
                <span>FAQ</span>
              </a>
              <a href="#troubleshooting" class="link-card">
                <i class="icon-tools"></i>
                <span>Troubleshooting</span>
              </a>
              <a href="#contact" class="link-card">
                <i class="icon-mail"></i>
                <span>Contact Support</span>
              </a>
            </div>
          </div>

          <!-- Getting Started -->
          <section id="getting-started" class="help-section">
            <h2>Getting Started</h2>
            <div class="guide-grid">
              <div class="guide-card">
                <h3>Installation</h3>
                <ol>
                  <li>Visit the Chrome Web Store</li>
                  <li>Click "Add to Chrome"</li>
                  <li>Confirm the installation</li>
                  <li>Pin the extension to your toolbar</li>
                </ol>
              </div>
              <div class="guide-card">
                <h3>First-Time Setup</h3>
                <ol>
                  <li>Create an account or sign in</li>
                  <li>Configure your preferences</li>
                  <li>Choose your bias detection settings</li>
                  <li>Start browsing with Biasbuster</li>
                </ol>
              </div>
            </div>
          </section>

          <!-- FAQ Section -->
          <section id="faq" class="help-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-grid">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="faq-item"
                :class="{ 'is-open': faq.isOpen }"
                @click="toggleFaq(index)"
              >
                <div class="faq-question">
                  <h3>{{ faq.question }}</h3>
                  <i class="icon-chevron-down"></i>
                </div>
                <div class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Troubleshooting -->
          <section id="troubleshooting" class="help-section">
            <h2>Troubleshooting</h2>
            <div class="troubleshooting-grid">
              <div class="trouble-card">
                <h3>Extension Not Working</h3>
                <ul>
                  <li>Check if the extension is enabled</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Reinstall the extension</li>
                  <li>Update your browser</li>
                </ul>
              </div>
              <div class="trouble-card">
                <h3>Analysis Issues</h3>
                <ul>
                  <li>Verify internet connection</li>
                  <li>Check account status</li>
                  <li>Clear extension data</li>
                  <li>Contact support if persistent</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Contact Support -->
          <section id="contact" class="help-section">
            <h2>Contact Support</h2>
            <div class="contact-grid">
              <div class="contact-card">
                <h3>Email Support</h3>
                <p>Get help via email</p>
                <a href="mailto:support@biasbuster.com" class="contact-link">
                  support@biasbuster.com
                </a>
              </div>
              <div class="contact-card">
                <h3>Live Chat</h3>
                <p>Chat with our support team</p>
                <button class="chat-button" @click="startChat">
                  Start Chat
                </button>
              </div>
              <div class="contact-card">
                <h3>Community Forum</h3>
                <p>Join our community</p>
                <a href="/community" class="forum-link">
                  Visit Forum
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

const searchQuery = ref('')

const faqs = ref([
  {
    question: 'How does Biasbuster detect bias?',
    answer: 'Biasbuster uses advanced AI models to analyze text content for various types of bias, including language bias, framing bias, and selection bias. The system provides explanations and suggestions for more balanced content.',
    isOpen: false
  },
  {
    question: 'Is my data private?',
    answer: 'Yes, we take privacy seriously. Your data is encrypted, and we only use it to improve our service. You can read more in our Privacy Policy.',
    isOpen: false
  },
  {
    question: 'Can I customize the bias detection?',
    answer: 'Yes, you can adjust sensitivity levels, choose which types of bias to detect, and set custom keywords in the extension settings.',
    isOpen: false
  },
  {
    question: 'How accurate is the bias detection?',
    answer: 'Our AI models are regularly trained and audited for accuracy. We maintain a 95% accuracy rate in bias detection, but we encourage users to use their judgment.',
    isOpen: false
  }
])

const handleSearch = () => {
  // TODO: Implement search functionality
  console.log('Searching for:', searchQuery.value)
}

const toggleFaq = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

const startChat = () => {
  // TODO: Implement chat functionality
  console.log('Starting chat...')
}

useHead({
  title: 'Help Center - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Get help and support for using Biasbuster. Find answers to common questions, troubleshooting guides, and contact options.'
    }
  ]
})
</script>

<style scoped>
.support-view {
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

.search-section {
  @apply py-8 bg-gray-50 dark:bg-gray-800;
}

.search-container {
  @apply max-w-2xl mx-auto flex gap-4;
}

.search-input {
  @apply flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

.search-button {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
}

.content-section {
  @apply py-20;
}

.content-grid {
  @apply space-y-16;
}

.quick-links {
  @apply mb-12;
}

.quick-links h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.links-grid {
  @apply grid md:grid-cols-4 gap-6;
}

.link-card {
  @apply flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow;
}

.link-card i {
  @apply text-3xl text-blue-600 dark:text-blue-400 mb-4;
}

.link-card span {
  @apply text-gray-900 dark:text-white font-medium;
}

.help-section {
  @apply mb-16;
}

.help-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.guide-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.guide-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.guide-card h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.guide-card ol {
  @apply list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300;
}

.faq-grid {
  @apply space-y-4;
}

.faq-item {
  @apply bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden;
}

.faq-question {
  @apply p-6 flex justify-between items-center cursor-pointer;
}

.faq-question h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.faq-answer {
  @apply px-6 pb-6 text-gray-600 dark:text-gray-300;
}

.troubleshooting-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.trouble-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.trouble-card h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.trouble-card ul {
  @apply list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300;
}

.contact-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.contact-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.contact-card h3 {
  @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
}

.contact-card p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.contact-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.chat-button {
  @apply px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
}

.forum-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

@media (max-width: 768px) {
  .links-grid {
    @apply grid-cols-2;
  }
  
  .guide-grid,
  .troubleshooting-grid,
  .contact-grid {
    @apply grid-cols-1;
  }
}
</style> 