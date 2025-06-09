<template>
  <div class="judges-corner-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Judges' Corner</h1>
        <p class="subtitle">Technical details, project timeline, and team information for the Startupathon Challenge</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Technical Architecture -->
          <section class="architecture-section">
            <h2>Technical Architecture</h2>
            <div class="architecture-content">
              <div class="architecture-diagram">
                <img src="/assets/architecture-diagram.svg" alt="System Architecture Diagram" />
              </div>
              <div class="architecture-details">
                <h3>System Components</h3>
                <ul class="component-list">
                  <li>
                    <strong>Frontend:</strong>
                    <ul>
                      <li>Vue.js 3 with Composition API</li>
                      <li>Tailwind CSS for styling</li>
                      <li>Chrome Extension (Manifest V3)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Backend:</strong>
                    <ul>
                      <li>Node.js with Express</li>
                      <li>MongoDB for data storage</li>
                      <li>Redis for caching</li>
                    </ul>
                  </li>
                  <li>
                    <strong>AI/ML:</strong>
                    <ul>
                      <li>Custom bias detection models</li>
                      <li>Explainable AI components</li>
                      <li>Continuous learning pipeline</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Project Timeline -->
          <section class="timeline-section">
            <h2>Project Timeline</h2>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-date">Phase 1: Planning</div>
                <div class="timeline-content">
                  <h3>Requirements & Design</h3>
                  <ul>
                    <li>PRD completion</li>
                    <li>Architecture design</li>
                    <li>UI/UX mockups</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Phase 2: Development</div>
                <div class="timeline-content">
                  <h3>Core Implementation</h3>
                  <ul>
                    <li>Website development</li>
                    <li>Chrome extension</li>
                    <li>AI model training</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Phase 3: Testing</div>
                <div class="timeline-content">
                  <h3>Quality Assurance</h3>
                  <ul>
                    <li>Unit testing</li>
                    <li>Integration testing</li>
                    <li>User acceptance testing</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Phase 4: Launch</div>
                <div class="timeline-content">
                  <h3>Deployment & Release</h3>
                  <ul>
                    <li>Production deployment</li>
                    <li>Chrome Web Store submission</li>
                    <li>Marketing launch</li>
                  </ul>
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
                    Passionate about AI ethics and digital literacy. Leading the development of Biasbuster with a focus on fairness, transparency, and user empowerment.
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

          <!-- Startupathon Resources -->
          <section class="resources-section">
            <h2>Startupathon Resources</h2>
            <div class="resources-grid">
              <div class="resource-card">
                <h3>Project Documentation</h3>
                <ul class="resource-list">
                  <li>
                    <a href="/docs/prd.md" target="_blank">Product Requirements Document</a>
                  </li>
                  <li>
                    <a href="/docs/architecture.md" target="_blank">Technical Architecture</a>
                  </li>
                  <li>
                    <a href="/docs/api.md" target="_blank">API Documentation</a>
                  </li>
                </ul>
              </div>
              <div class="resource-card">
                <h3>Demo Materials</h3>
                <ul class="resource-list">
                  <li>
                    <a href="/demo/presentation.pdf" target="_blank">Pitch Deck</a>
                  </li>
                  <li>
                    <a href="/demo/video.mp4" target="_blank">Demo Video</a>
                  </li>
                  <li>
                    <a href="/demo/screenshots.zip" target="_blank">Screenshots</a>
                  </li>
                </ul>
              </div>
              <div class="resource-card">
                <h3>Technical Resources</h3>
                <ul class="resource-list">
                  <li>
                    <a href="/docs/testing.md" target="_blank">Test Reports</a>
                  </li>
                  <li>
                    <a href="/docs/security.md" target="_blank">Security Audit</a>
                  </li>
                  <li>
                    <a href="/docs/roadmap.md" target="_blank">Future Roadmap</a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Contact Section -->
          <section class="contact-section">
            <h2>Contact Information</h2>
            <div class="contact-card">
              <div class="contact-info">
                <h3>Project Lead</h3>
                <p><strong>Name:</strong> Amar Mahakal</p>
                <p><strong>Email:</strong> amarmahakal92@gmail.com</p>
                <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/amarmahakal" target="_blank" rel="noopener">linkedin.com/in/amarmahakal</a></p>
                <p><strong>GitHub:</strong> <a href="https://github.com/amarzeus" target="_blank" rel="noopener">github.com/amarzeus</a></p>
              </div>
              <div class="contact-actions">
                <a href="mailto:amarmahakal92@gmail.com" class="contact-button">
                  <i class="icon-mail"></i>
                  Email Project Lead
                </a>
                <a href="/docs/startupathon-resources.zip" download class="download-all-button">
                  <i class="icon-download"></i>
                  Download All Resources
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
import { useHead } from '@vueuse/head'

useHead({
  title: "Judges' Corner - Biasbuster",
  meta: [
    {
      name: 'description',
      content: 'Technical details, project timeline, team information, and Startupathon-specific resources for Biasbuster.'
    }
  ]
})
</script>

<style scoped>
.judges-corner-view {
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

.architecture-section,
.timeline-section,
.team-section,
.resources-section,
.contact-section {
  @apply mb-16;
}

.architecture-section h2,
.timeline-section h2,
.team-section h2,
.resources-section h2,
.contact-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.architecture-content {
  @apply grid md:grid-cols-2 gap-8;
}

.architecture-diagram {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.architecture-diagram img {
  @apply w-full h-auto;
}

.architecture-details {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.component-list {
  @apply space-y-4;
}

.component-list li {
  @apply mb-4;
}

.component-list ul {
  @apply ml-6 mt-2 space-y-2;
}

.timeline {
  @apply space-y-8;
}

.timeline-item {
  @apply flex gap-8;
}

.timeline-date {
  @apply w-48 text-blue-600 dark:text-blue-400 font-medium;
}

.timeline-content {
  @apply flex-1 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.timeline-content h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.timeline-content ul {
  @apply space-y-2 text-gray-600 dark:text-gray-300;
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

.resources-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.resource-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.resource-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.resource-list {
  @apply space-y-2;
}

.resource-list a {
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

.contact-info a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
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
  .architecture-content,
  .team-card {
    @apply flex-col;
  }
  
  .timeline-item {
    @apply flex-col;
  }
  
  .timeline-date {
    @apply w-full mb-2;
  }
  
  .contact-actions {
    @apply flex-col;
  }
}
</style> 