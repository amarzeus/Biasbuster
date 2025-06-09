<template>
  <div class="press-kit-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Press Kit</h1>
        <p class="subtitle">Media resources and information about Biasbuster</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Brand Assets -->
          <section class="assets-section">
            <h2>Brand Assets</h2>
            <div class="assets-grid">
              <div class="asset-card">
                <h3>Logo</h3>
                <div class="asset-preview">
                  <img src="/assets/logo.svg" alt="Biasbuster Logo" />
                </div>
                <div class="asset-downloads">
                  <a href="/assets/logo.svg" download class="download-button">
                    <i class="icon-download"></i>
                    SVG
                  </a>
                  <a href="/assets/logo.png" download class="download-button">
                    <i class="icon-download"></i>
                    PNG
                  </a>
                </div>
              </div>
              <div class="asset-card">
                <h3>Brand Colors</h3>
                <div class="color-grid">
                  <div class="color-item">
                    <div class="color-swatch" style="background-color: #2A5C8A"></div>
                    <div class="color-info">
                      <span class="color-name">Trust Blue</span>
                      <span class="color-value">#2A5C8A</span>
                    </div>
                  </div>
                  <div class="color-item">
                    <div class="color-swatch" style="background-color: #2EC4B6"></div>
                    <div class="color-info">
                      <span class="color-name">AI Teal</span>
                      <span class="color-value">#2EC4B6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Team Section -->
          <section class="team-section">
            <h2>Our Team</h2>
            <div class="team-grid">
              <div class="team-card">
                <div class="team-photo">
                  <img src="/assets/team/amar.jpg" alt="Amar Mahakal" />
                </div>
                <div class="team-info">
                  <h3>Amar Mahakal</h3>
                  <p class="team-role">Founder & Lead Developer</p>
                  <p class="team-bio">
                    Amar is passionate about using AI to promote fairness and transparency in digital content. With a background in software engineering and AI ethics, he leads the development of Biasbuster.
                  </p>
                  <div class="team-social">
                    <a href="https://linkedin.com/in/amarmahakal" target="_blank" rel="noopener">
                      <i class="icon-linkedin"></i>
                    </a>
                    <a href="https://github.com/amarzeus" target="_blank" rel="noopener">
                      <i class="icon-github"></i>
                    </a>
                    <a href="mailto:amarmahakal92@gmail.com">
                      <i class="icon-mail"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Press Releases -->
          <section class="press-section">
            <h2>Press Releases</h2>
            <div class="press-grid">
              <div
                v-for="release in pressReleases"
                :key="release.id"
                class="press-card"
              >
                <div class="press-date">{{ release.date }}</div>
                <h3>{{ release.title }}</h3>
                <p>{{ release.excerpt }}</p>
                <a :href="release.link" class="press-link">Read More</a>
              </div>
            </div>
          </section>

          <!-- Media Coverage -->
          <section class="coverage-section">
            <h2>Media Coverage</h2>
            <div class="coverage-grid">
              <div
                v-for="article in mediaCoverage"
                :key="article.id"
                class="coverage-card"
              >
                <div class="coverage-source">
                  <img :src="article.sourceLogo" :alt="article.source" />
                </div>
                <div class="coverage-content">
                  <h3>{{ article.title }}</h3>
                  <p>{{ article.excerpt }}</p>
                  <div class="coverage-meta">
                    <span class="source">{{ article.source }}</span>
                    <span class="date">{{ article.date }}</span>
                  </div>
                  <a :href="article.link" target="_blank" rel="noopener" class="coverage-link">
                    Read Article
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- Contact Information -->
          <section class="contact-section">
            <h2>Media Contact</h2>
            <div class="contact-card">
              <div class="contact-info">
                <h3>Press Inquiries</h3>
                <p>For press inquiries, please contact:</p>
                <div class="contact-details">
                  <p><strong>Name:</strong> Amar Mahakal</p>
                  <p><strong>Email:</strong> press@biasbuster.com</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                </div>
              </div>
              <div class="contact-actions">
                <a href="mailto:press@biasbuster.com" class="contact-button">
                  <i class="icon-mail"></i>
                  Email Press
                </a>
                <a href="/assets/press-kit.zip" download class="download-all-button">
                  <i class="icon-download"></i>
                  Download Full Press Kit
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

const pressReleases = ref([
  {
    id: 1,
    date: 'March 15, 2024',
    title: 'Biasbuster Launches AI-Powered Bias Detection Platform',
    excerpt: 'Biasbuster announces the launch of its innovative platform for detecting and analyzing bias in digital content...',
    link: '/press/releases/1'
  },
  {
    id: 2,
    date: 'February 28, 2024',
    title: 'Biasbuster Raises $2M in Seed Funding',
    excerpt: 'Biasbuster secures $2M in seed funding to accelerate development of its bias detection technology...',
    link: '/press/releases/2'
  }
])

const mediaCoverage = ref([
  {
    id: 1,
    source: 'TechCrunch',
    sourceLogo: '/assets/press/techcrunch.png',
    title: 'Biasbuster: The AI Tool Fighting Digital Bias',
    excerpt: 'A new startup is using artificial intelligence to help users identify and understand bias in online content...',
    date: 'March 10, 2024',
    link: 'https://techcrunch.com/biasbuster'
  },
  {
    id: 2,
    source: 'Wired',
    sourceLogo: '/assets/press/wired.png',
    title: 'How AI is Making the Internet More Fair',
    excerpt: 'Biasbuster\'s innovative approach to bias detection is changing how we consume digital content...',
    date: 'March 5, 2024',
    link: 'https://wired.com/biasbuster'
  }
])

useHead({
  title: 'Press Kit - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Access Biasbuster\'s press kit, including brand assets, team information, press releases, and media coverage.'
    }
  ]
})
</script>

<style scoped>
.press-kit-view {
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

.assets-section,
.team-section,
.press-section,
.coverage-section,
.contact-section {
  @apply mb-16;
}

.assets-section h2,
.team-section h2,
.press-section h2,
.coverage-section h2,
.contact-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.assets-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.asset-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.asset-card h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.asset-preview {
  @apply mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.asset-preview img {
  @apply max-h-32 mx-auto;
}

.asset-downloads {
  @apply flex gap-4;
}

.download-button {
  @apply flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500;
}

.color-grid {
  @apply grid grid-cols-2 gap-4;
}

.color-item {
  @apply flex items-center gap-4;
}

.color-swatch {
  @apply w-12 h-12 rounded-lg;
}

.color-info {
  @apply flex flex-col;
}

.color-name {
  @apply font-medium text-gray-900 dark:text-white;
}

.color-value {
  @apply text-sm text-gray-600 dark:text-gray-300;
}

.team-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.team-card {
  @apply flex gap-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.team-photo {
  @apply w-32 h-32 rounded-lg overflow-hidden;
}

.team-photo img {
  @apply w-full h-full object-cover;
}

.team-info {
  @apply flex-1;
}

.team-info h3 {
  @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
}

.team-role {
  @apply text-blue-600 dark:text-blue-400 mb-2;
}

.team-bio {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.team-social {
  @apply flex gap-4;
}

.team-social a {
  @apply text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400;
}

.press-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.press-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.press-date {
  @apply text-sm text-gray-500 dark:text-gray-400 mb-2;
}

.press-card h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.press-card p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.press-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.coverage-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.coverage-card {
  @apply flex gap-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.coverage-source {
  @apply w-16 h-16;
}

.coverage-source img {
  @apply w-full h-full object-contain;
}

.coverage-content {
  @apply flex-1;
}

.coverage-content h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.coverage-content p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.coverage-meta {
  @apply flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4;
}

.coverage-link {
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
  .team-card,
  .coverage-card {
    @apply flex-col;
  }
  
  .team-photo {
    @apply w-full h-48;
  }
  
  .contact-actions {
    @apply flex-col;
  }
}
</style> 