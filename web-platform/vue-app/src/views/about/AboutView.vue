<template>
  <div class="about-view">
    <section class="hero">
      <h1>About Biasbuster</h1>
      <p class="subtitle">Empowering critical thinking in the digital age</p>
    </section>

    <section class="mission-vision">
      <div class="container">
        <div class="mission">
          <h2>Our Mission</h2>
          <p>To empower everyone to think critically and spot bias in the digital age through AI-powered, explainable bias detection and education.</p>
        </div>
        <div class="vision">
          <h2>Our Vision</h2>
          <p>A world where digital literacy and critical thinking are accessible to all, enabling informed decision-making and fair representation.</p>
        </div>
      </div>
    </section>

    <section class="values">
      <div class="container">
        <h2>Our Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <i class="icon-shield"></i>
            <h3>Trust</h3>
            <p>Building transparent, explainable AI systems that users can trust.</p>
          </div>
          <div class="value-card">
            <i class="icon-graduation"></i>
            <h3>Education</h3>
            <p>Empowering users with knowledge and tools for critical thinking.</p>
          </div>
          <div class="value-card">
            <i class="icon-balance"></i>
            <h3>Fairness</h3>
            <p>Committed to detecting and mitigating bias in all forms.</p>
          </div>
          <div class="value-card">
            <i class="icon-globe"></i>
            <h3>Accessibility</h3>
            <p>Making bias detection and education available to everyone.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="founder">
      <div class="container">
        <h2>Meet the Founder</h2>
        <div class="founder-content">
          <div class="founder-image">
            <img src="@/assets/images/amar.jpg" alt="Amar Mahakal" />
          </div>
          <div class="founder-bio">
            <h3>Amar Mahakal</h3>
            <p class="title">Founder & Lead Developer</p>
            <p>Hi, I'm Amar, the creator of Biasbuster. My mission is to empower everyone to think critically and spot bias in the digital age.</p>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/amarmahakal/" target="_blank" rel="noopener">
                <i class="icon-linkedin"></i> LinkedIn
              </a>
              <a href="https://github.com/amarzeus/" target="_blank" rel="noopener">
                <i class="icon-github"></i> GitHub
              </a>
              <a href="mailto:amarmahakal92@gmail.com">
                <i class="icon-email"></i> Email
              </a>
              <a href="https://buymeacoffee.com/amarmahakal" target="_blank" rel="noopener">
                <i class="icon-coffee"></i> Buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="impact">
      <div class="container">
        <h2>Our Impact</h2>
        <div class="impact-stats">
          <div class="stat-card">
            <span class="number">10K+</span>
            <span class="label">Articles Analyzed</span>
          </div>
          <div class="stat-card">
            <span class="number">5K+</span>
            <span class="label">Active Users</span>
          </div>
          <div class="stat-card">
            <span class="number">95%</span>
            <span class="label">Accuracy Rate</span>
          </div>
          <div class="stat-card">
            <span class="number">50+</span>
            <span class="label">Countries Reached</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'About Us - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn about Biasbuster\'s mission to empower critical thinking through AI-powered bias detection and education.'
    }
  ]
})
</script>

<style scoped>
.about-view {
  @apply min-h-screen bg-white dark:bg-gray-900;
}

.hero {
  @apply py-20 text-center bg-gradient-to-r from-blue-600 to-teal-500 text-white;
}

.hero h1 {
  @apply text-4xl md:text-5xl font-bold mb-4;
}

.subtitle {
  @apply text-xl md:text-2xl opacity-90;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12;
}

.mission-vision {
  @apply bg-gray-50 dark:bg-gray-800;
}

.mission-vision .container {
  @apply grid md:grid-cols-2 gap-12;
}

.mission, .vision {
  @apply p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg;
}

.mission h2, .vision h2 {
  @apply text-2xl font-bold mb-4 text-gray-900 dark:text-white;
}

.values-grid {
  @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
}

.value-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.value-card i {
  @apply text-4xl text-blue-600 dark:text-blue-400 mb-4;
}

.value-card h3 {
  @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
}

.founder {
  @apply bg-gray-50 dark:bg-gray-800;
}

.founder-content {
  @apply flex flex-col md:flex-row items-center gap-12;
}

.founder-image {
  @apply w-64 h-64 rounded-full overflow-hidden;
}

.founder-image img {
  @apply w-full h-full object-cover;
}

.founder-bio {
  @apply flex-1;
}

.founder-bio h3 {
  @apply text-2xl font-bold mb-2 text-gray-900 dark:text-white;
}

.founder-bio .title {
  @apply text-lg text-gray-600 dark:text-gray-300 mb-4;
}

.social-links {
  @apply flex flex-wrap gap-4 mt-6;
}

.social-links a {
  @apply flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.impact-stats {
  @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
}

.stat-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.stat-card .number {
  @apply block text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2;
}

.stat-card .label {
  @apply text-gray-600 dark:text-gray-300;
}

@media (max-width: 768px) {
  .founder-content {
    @apply text-center;
  }
  
  .social-links {
    @apply justify-center;
  }
}
</style> 