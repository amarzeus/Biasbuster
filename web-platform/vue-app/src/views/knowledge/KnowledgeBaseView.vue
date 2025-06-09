<template>
  <div class="knowledge-base-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Knowledge Base</h1>
        <p class="subtitle">Comprehensive documentation and support resources</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Search Section -->
          <section class="search-section">
            <div class="search-container">
              <div class="search-box">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search the knowledge base..."
                  @keyup.enter="handleSearch"
                />
                <button @click="handleSearch" class="search-button">
                  <i class="icon-search"></i>
                  Search
                </button>
              </div>
              <div class="search-filters">
                <button
                  v-for="filter in searchFilters"
                  :key="filter.id"
                  :class="['filter-button', { active: activeFilter === filter.id }]"
                  @click="setActiveFilter(filter.id)"
                >
                  {{ filter.name }}
                </button>
              </div>
            </div>
          </section>

          <!-- Quick Links -->
          <section class="quick-links-section">
            <h2>Quick Links</h2>
            <div class="quick-links-grid">
              <a
                v-for="link in quickLinks"
                :key="link.id"
                :href="link.url"
                class="quick-link-card"
              >
                <i :class="link.icon"></i>
                <h3>{{ link.title }}</h3>
                <p>{{ link.description }}</p>
              </a>
            </div>
          </section>

          <!-- Documentation Categories -->
          <section class="categories-section">
            <h2>Documentation Categories</h2>
            <div class="categories-grid">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-card"
              >
                <h3>{{ category.title }}</h3>
                <p>{{ category.description }}</p>
                <ul class="category-links">
                  <li v-for="doc in category.docs" :key="doc.id">
                    <a :href="doc.url">{{ doc.title }}</a>
                  </li>
                </ul>
                <a :href="category.url" class="view-all-link">View All</a>
              </div>
            </div>
          </section>

          <!-- API Documentation -->
          <section class="api-section">
            <h2>API Documentation</h2>
            <div class="api-content">
              <div class="api-card">
                <h3>REST API</h3>
                <div class="api-endpoints">
                  <div class="endpoint">
                    <div class="endpoint-header">
                      <span class="method">POST</span>
                      <span class="path">/api/v1/analyze</span>
                    </div>
                    <p class="endpoint-description">
                      Analyze text for bias and return detailed results
                    </p>
                    <a href="/api-docs/analyze" class="endpoint-link">View Documentation</a>
                  </div>
                  <div class="endpoint">
                    <div class="endpoint-header">
                      <span class="method">GET</span>
                      <span class="path">/api/v1/status</span>
                    </div>
                    <p class="endpoint-description">
                      Check API status and rate limits
                    </p>
                    <a href="/api-docs/status" class="endpoint-link">View Documentation</a>
                  </div>
                </div>
                <a href="/api-docs" class="api-docs-link">View Full API Documentation</a>
              </div>
            </div>
          </section>

          <!-- Recent Updates -->
          <section class="updates-section">
            <h2>Recent Updates</h2>
            <div class="updates-list">
              <div
                v-for="update in recentUpdates"
                :key="update.id"
                class="update-card"
              >
                <div class="update-date">{{ update.date }}</div>
                <h3>{{ update.title }}</h3>
                <p>{{ update.description }}</p>
                <a :href="update.url" class="update-link">Read More</a>
              </div>
            </div>
          </section>

          <!-- Support Resources -->
          <section class="support-section">
            <h2>Support Resources</h2>
            <div class="support-grid">
              <div class="support-card">
                <h3>Getting Started</h3>
                <ul class="support-links">
                  <li>
                    <a href="/docs/getting-started/installation">Installation Guide</a>
                  </li>
                  <li>
                    <a href="/docs/getting-started/quickstart">Quick Start Guide</a>
                  </li>
                  <li>
                    <a href="/docs/getting-started/tutorials">Video Tutorials</a>
                  </li>
                </ul>
              </div>
              <div class="support-card">
                <h3>Troubleshooting</h3>
                <ul class="support-links">
                  <li>
                    <a href="/docs/troubleshooting/common-issues">Common Issues</a>
                  </li>
                  <li>
                    <a href="/docs/troubleshooting/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/docs/troubleshooting/error-codes">Error Codes</a>
                  </li>
                </ul>
              </div>
              <div class="support-card">
                <h3>Community</h3>
                <ul class="support-links">
                  <li>
                    <a href="/community/forum">Community Forum</a>
                  </li>
                  <li>
                    <a href="/community/slack">Slack Channel</a>
                  </li>
                  <li>
                    <a href="/community/github">GitHub Discussions</a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Contact Support -->
          <section class="contact-section">
            <h2>Need Help?</h2>
            <div class="contact-card">
              <div class="contact-info">
                <h3>Contact Support</h3>
                <p>Can't find what you're looking for? Our support team is here to help.</p>
                <div class="contact-details">
                  <p><strong>Email:</strong> support@biasbuster.com</p>
                  <p><strong>Hours:</strong> 24/7</p>
                </div>
              </div>
              <div class="contact-actions">
                <a href="mailto:support@biasbuster.com" class="contact-button">
                  <i class="icon-mail"></i>
                  Contact Support
                </a>
                <a href="/docs/kb.pdf" download class="download-all-button">
                  <i class="icon-download"></i>
                  Download Knowledge Base
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
const activeFilter = ref('all')

const searchFilters = [
  { id: 'all', name: 'All' },
  { id: 'docs', name: 'Documentation' },
  { id: 'api', name: 'API' },
  { id: 'guides', name: 'Guides' }
]

const quickLinks = [
  {
    id: 1,
    title: 'Getting Started',
    description: 'Quick start guide and installation instructions',
    icon: 'icon-rocket',
    url: '/docs/getting-started'
  },
  {
    id: 2,
    title: 'API Reference',
    description: 'Complete API documentation and examples',
    icon: 'icon-code',
    url: '/api-docs'
  },
  {
    id: 3,
    title: 'Tutorials',
    description: 'Step-by-step guides and video tutorials',
    icon: 'icon-book',
    url: '/docs/tutorials'
  },
  {
    id: 4,
    title: 'FAQ',
    description: 'Frequently asked questions and answers',
    icon: 'icon-help',
    url: '/docs/faq'
  }
]

const categories = [
  {
    id: 1,
    title: 'User Guide',
    description: 'Comprehensive guides for using Biasbuster',
    docs: [
      { id: 1, title: 'Installation Guide', url: '/docs/user-guide/installation' },
      { id: 2, title: 'Basic Usage', url: '/docs/user-guide/basic-usage' },
      { id: 3, title: 'Advanced Features', url: '/docs/user-guide/advanced-features' }
    ],
    url: '/docs/user-guide'
  },
  {
    id: 2,
    title: 'Developer Guide',
    description: 'Technical documentation for developers',
    docs: [
      { id: 1, title: 'API Overview', url: '/docs/developer-guide/api' },
      { id: 2, title: 'Integration Guide', url: '/docs/developer-guide/integration' },
      { id: 3, title: 'Best Practices', url: '/docs/developer-guide/best-practices' }
    ],
    url: '/docs/developer-guide'
  }
]

const recentUpdates = [
  {
    id: 1,
    date: 'March 15, 2024',
    title: 'New API Endpoints',
    description: 'Added new endpoints for advanced bias analysis and reporting',
    url: '/docs/updates/api-v2'
  },
  {
    id: 2,
    date: 'March 10, 2024',
    title: 'Updated User Guide',
    description: 'Comprehensive updates to the user guide with new features',
    url: '/docs/updates/user-guide-v2'
  }
]

const handleSearch = () => {
  // Implement search functionality
  console.log('Searching for:', searchQuery.value)
}

const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId
}

useHead({
  title: 'Knowledge Base - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive documentation, guides, and support resources for Biasbuster.'
    }
  ]
})
</script>

<style scoped>
.knowledge-base-view {
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

.content-section {
  @apply py-20;
}

.content-grid {
  @apply space-y-16;
}

.search-section {
  @apply mb-16;
}

.search-container {
  @apply max-w-3xl mx-auto;
}

.search-box {
  @apply flex gap-4 mb-4;
}

.search-box input {
  @apply flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

.search-button {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
}

.search-filters {
  @apply flex gap-4 justify-center;
}

.filter-button {
  @apply px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.filter-button.active {
  @apply bg-blue-600 text-white;
}

.quick-links-section,
.categories-section,
.api-section,
.updates-section,
.support-section,
.contact-section {
  @apply mb-16;
}

.quick-links-section h2,
.categories-section h2,
.api-section h2,
.updates-section h2,
.support-section h2,
.contact-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.quick-links-grid {
  @apply grid md:grid-cols-4 gap-8;
}

.quick-link-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.quick-link-card i {
  @apply text-3xl text-blue-600 dark:text-blue-400 mb-4;
}

.quick-link-card h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.quick-link-card p {
  @apply text-gray-600 dark:text-gray-300;
}

.categories-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.category-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.category-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.category-card p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.category-links {
  @apply space-y-2 mb-4;
}

.category-links a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.view-all-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.api-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.api-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.api-endpoints {
  @apply space-y-4 mb-6;
}

.endpoint {
  @apply p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.endpoint-header {
  @apply flex items-center gap-4 mb-2;
}

.method {
  @apply px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-sm font-medium;
}

.path {
  @apply text-gray-900 dark:text-white font-mono;
}

.endpoint-description {
  @apply text-gray-600 dark:text-gray-300 mb-2;
}

.endpoint-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.api-docs-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.updates-list {
  @apply space-y-4;
}

.update-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.update-date {
  @apply text-sm text-gray-500 dark:text-gray-400 mb-2;
}

.update-card h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.update-card p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.update-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.support-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.support-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.support-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.support-links {
  @apply space-y-2;
}

.support-links a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.contact-card {
  @apply p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.contact-info {
  @apply mb-8;
}

.contact-info h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.contact-info p {
  @apply text-gray-600 dark:text-gray-300 mb-2;
}

.contact-details {
  @apply space-y-2 text-gray-600 dark:text-gray-300;
}

.contact-actions {
  @apply flex gap-4;
}

.contact-button,
.download-all-button {
  @apply flex items-center gap-2 px-6 py-3 rounded-lg font-medium;
}

.contact-button {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.download-all-button {
  @apply bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500;
}

@media (max-width: 768px) {
  .quick-links-grid,
  .categories-grid,
  .support-grid {
    @apply grid-cols-1;
  }
  
  .search-box {
    @apply flex-col;
  }
  
  .search-filters {
    @apply flex-wrap;
  }
  
  .contact-actions {
    @apply flex-col;
  }
}
</style> 