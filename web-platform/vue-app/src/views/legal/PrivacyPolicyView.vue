<template>
  <div class="privacy-policy-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Privacy Policy</h1>
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

          <!-- Policy Content -->
          <div class="policy-content">
            <!-- Introduction -->
            <section :id="sections[0].id" class="policy-section">
              <h2>{{ sections[0].title }}</h2>
              <p>
                At Biasbuster, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website and Chrome extension.
              </p>
              <p>
                Please read this privacy policy carefully. By using our services, you consent to the practices described in this policy.
              </p>
            </section>

            <!-- Information We Collect -->
            <section :id="sections[1].id" class="policy-section">
              <h2>{{ sections[1].title }}</h2>
              <h3>Personal Information</h3>
              <ul>
                <li>Account information (email, name)</li>
                <li>Usage data and preferences</li>
                <li>Device information</li>
                <li>Browser type and settings</li>
              </ul>

              <h3>Content Analysis Data</h3>
              <ul>
                <li>Text content for bias analysis</li>
                <li>Analysis results and feedback</li>
                <li>Custom settings and preferences</li>
              </ul>
            </section>

            <!-- How We Use Your Information -->
            <section :id="sections[2].id" class="policy-section">
              <h2>{{ sections[2].title }}</h2>
              <ul>
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Analyze usage patterns</li>
                <li>Enhance our AI models</li>
                <li>Communicate with you</li>
                <li>Ensure platform security</li>
              </ul>
            </section>

            <!-- Data Sharing -->
            <section :id="sections[3].id" class="policy-section">
              <h2>{{ sections[3].title }}</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul>
                <li>Service providers and partners</li>
                <li>Legal authorities when required</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <!-- Data Security -->
            <section :id="sections[4].id" class="policy-section">
              <h2>{{ sections[4].title }}</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and processing</li>
              </ul>
            </section>

            <!-- Your Rights -->
            <section :id="sections[5].id" class="policy-section">
              <h2>{{ sections[5].title }}</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request data deletion</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <!-- Cookies -->
            <section :id="sections[6].id" class="policy-section">
              <h2>{{ sections[6].title }}</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul>
                <li>Remember your preferences</li>
                <li>Analyze site usage</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
              </ul>
            </section>

            <!-- Children's Privacy -->
            <section :id="sections[7].id" class="policy-section">
              <h2>{{ sections[7].title }}</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <!-- Changes to Policy -->
            <section :id="sections[8].id" class="policy-section">
              <h2>{{ sections[8].title }}</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <!-- Contact Us -->
            <section :id="sections[9].id" class="policy-section">
              <h2>{{ sections[9].title }}</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div class="contact-info">
                <p>Email: privacy@biasbuster.com</p>
                <p>Address: 123 Innovation Street, Tech Hub, CA 94107</p>
              </div>
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
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-collected', title: 'Information We Collect' },
  { id: 'information-use', title: 'How We Use Your Information' },
  { id: 'data-sharing', title: 'Data Sharing' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'cookies', title: 'Cookies and Tracking' },
  { id: 'children-privacy', title: "Children's Privacy" },
  { id: 'policy-changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Us' }
]

useHead({
  title: 'Privacy Policy - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn about how Biasbuster collects, uses, and protects your personal information.'
    }
  ]
})
</script>

<style scoped>
.privacy-policy-view {
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

.policy-content {
  @apply md:col-span-3;
}

.policy-section {
  @apply mb-12;
}

.policy-section h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.policy-section h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.policy-section p {
  @apply mb-4 text-gray-600 dark:text-gray-300;
}

.policy-section ul {
  @apply list-disc list-inside mb-4 text-gray-600 dark:text-gray-300;
}

.contact-info {
  @apply bg-gray-50 dark:bg-gray-800 p-6 rounded-lg;
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