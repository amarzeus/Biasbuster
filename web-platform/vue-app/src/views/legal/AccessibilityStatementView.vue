<template>
  <div class="accessibility-statement-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Accessibility Statement</h1>
        <p class="subtitle">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Table of Contents -->
          <nav class="toc">
            <h2>Contents</h2>
            <ul>
              <li v-for="(section, index) in sections" :key="index">
                <a :href="'#' + section.id">{{ section.title }}</a>
              </li>
            </ul>
          </nav>

          <!-- Statement Content -->
          <div class="statement-content">
            <!-- Commitment -->
            <section :id="sections[0].id" class="statement-section">
              <h2>{{ sections[0].title }}</h2>
              <p>
                At Biasbuster, we are committed to ensuring digital accessibility for people of all abilities. We strive to continually improve the user experience for everyone and apply relevant accessibility standards.
              </p>
            </section>

            <!-- Standards -->
            <section :id="sections[1].id" class="statement-section">
              <h2>{{ sections[1].title }}</h2>
              <p>
                We aim to conform to the following accessibility standards:
              </p>
              <ul>
                <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
                <li>Americans with Disabilities Act (ADA) requirements</li>
                <li>Section 508 of the Rehabilitation Act</li>
                <li>European Accessibility Act (EAA)</li>
              </ul>
            </section>

            <!-- Features -->
            <section :id="sections[2].id" class="statement-section">
              <h2>{{ sections[2].title }}</h2>
              <p>
                Our platform includes the following accessibility features:
              </p>
              <ul>
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>High contrast mode</li>
                <li>Resizable text</li>
                <li>Alternative text for images</li>
                <li>ARIA labels and landmarks</li>
                <li>Focus indicators</li>
                <li>Color contrast compliance</li>
              </ul>
            </section>

            <!-- Browser Support -->
            <section :id="sections[3].id" class="statement-section">
              <h2>{{ sections[3].id }}</h2>
              <p>
                Our website and extension are optimized for the following browsers and assistive technologies:
              </p>
              <ul>
                <li>Chrome (latest version)</li>
                <li>Firefox (latest version)</li>
                <li>Safari (latest version)</li>
                <li>Edge (latest version)</li>
                <li>NVDA screen reader</li>
                <li>JAWS screen reader</li>
                <li>VoiceOver (macOS)</li>
                <li>TalkBack (Android)</li>
              </ul>
            </section>

            <!-- Known Issues -->
            <section :id="sections[4].id" class="statement-section">
              <h2>{{ sections[4].title }}</h2>
              <p>
                We are aware of the following accessibility issues and are working to resolve them:
              </p>
              <ul>
                <li>Some complex data visualizations may not be fully accessible to screen readers</li>
                <li>Certain interactive elements may require additional keyboard navigation improvements</li>
                <li>Some third-party integrations may not meet our accessibility standards</li>
              </ul>
            </section>

            <!-- Testing -->
            <section :id="sections[5].id" class="statement-section">
              <h2>{{ sections[5].title }}</h2>
              <p>
                We regularly test our platform for accessibility using:
              </p>
              <ul>
                <li>Automated testing tools</li>
                <li>Manual testing by accessibility experts</li>
                <li>User testing with people who use assistive technologies</li>
                <li>Regular audits and reviews</li>
              </ul>
            </section>

            <!-- Feedback -->
            <section :id="sections[6].id" class="statement-section">
              <h2>{{ sections[6].title }}</h2>
              <p>
                We welcome your feedback on the accessibility of our platform. Please contact us if you:
              </p>
              <ul>
                <li>Encounter any accessibility barriers</li>
                <li>Have suggestions for improvement</li>
                <li>Need assistance using our platform</li>
              </ul>
              <div class="contact-info">
                <p>Email: accessibility@biasbuster.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Innovation Street, Tech Hub, CA 94107</p>
              </div>
            </section>

            <!-- Updates -->
            <section :id="sections[7].id" class="statement-section">
              <h2>{{ sections[7].title }}</h2>
              <p>
                We regularly review and update our accessibility statement to reflect our ongoing commitment to accessibility. This statement was last updated on {{ lastUpdated }}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

const lastUpdated = 'March 15, 2024'

const sections = [
  { id: 'commitment', title: 'Our Commitment' },
  { id: 'standards', title: 'Accessibility Standards' },
  { id: 'features', title: 'Accessibility Features' },
  { id: 'browser-support', title: 'Browser and Technology Support' },
  { id: 'known-issues', title: 'Known Issues' },
  { id: 'testing', title: 'Accessibility Testing' },
  { id: 'feedback', title: 'Feedback and Assistance' },
  { id: 'updates', title: 'Statement Updates' }
]

useHead({
  title: 'Accessibility Statement - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn about Biasbuster\'s commitment to accessibility and our efforts to ensure our platform is usable by everyone.'
    }
  ]
})
</script>

<style scoped>
.accessibility-statement-view {
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
  @apply grid md:grid-cols-4 gap-12;
}

.toc {
  @apply md:col-span-1;
}

.toc h2 {
  @apply text-xl font-bold mb-4 text-gray-900 dark:text-white;
}

.toc ul {
  @apply space-y-2;
}

.toc a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.statement-content {
  @apply md:col-span-3;
}

.statement-section {
  @apply mb-12;
}

.statement-section h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.statement-section p {
  @apply mb-4 text-gray-600 dark:text-gray-300;
}

.statement-section ul {
  @apply list-disc list-inside mb-4 text-gray-600 dark:text-gray-300;
}

.contact-info {
  @apply bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-6;
}

.contact-info p {
  @apply mb-2;
}

@media (max-width: 768px) {
  .content-grid {
    @apply grid-cols-1;
  }
  
  .toc {
    @apply mb-8;
  }
}
</style> 