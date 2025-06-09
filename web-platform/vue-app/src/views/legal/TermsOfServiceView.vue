<template>
  <div class="terms-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Terms of Service</h1>
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

          <!-- Terms Content -->
          <div class="terms-content">
            <!-- Agreement -->
            <section :id="sections[0].id" class="terms-section">
              <h2>{{ sections[0].title }}</h2>
              <p>
                By accessing or using Biasbuster's services, including our website and Chrome extension, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <!-- Definitions -->
            <section :id="sections[1].id" class="terms-section">
              <h2>{{ sections[1].title }}</h2>
              <ul>
                <li><strong>"Service"</strong> refers to Biasbuster's website and Chrome extension</li>
                <li><strong>"User"</strong> refers to any individual accessing or using our Service</li>
                <li><strong>"Content"</strong> refers to any text, data, or information analyzed by our Service</li>
                <li><strong>"Account"</strong> refers to a user's registered profile on our Service</li>
              </ul>
            </section>

            <!-- User Accounts -->
            <section :id="sections[2].id" class="terms-section">
              <h2>{{ sections[2].title }}</h2>
              <p>
                When you create an account with us, you must provide accurate and complete information. You are responsible for:
              </p>
              <ul>
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </section>

            <!-- Acceptable Use -->
            <section :id="sections[3].id" class="terms-section">
              <h2>{{ sections[3].title }}</h2>
              <p>
                You agree not to:
              </p>
              <ul>
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with the Service's operation</li>
                <li>Use automated systems or bots</li>
              </ul>
            </section>

            <!-- Intellectual Property -->
            <section :id="sections[4].id" class="terms-section">
              <h2>{{ sections[4].title }}</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Biasbuster and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <!-- User Content -->
            <section :id="sections[5].id" class="terms-section">
              <h2>{{ sections[5].title }}</h2>
              <p>
                By using our Service, you retain ownership of your content. However, you grant us a license to:
              </p>
              <ul>
                <li>Use, modify, and analyze your content</li>
                <li>Improve our AI models and services</li>
                <li>Generate anonymous usage statistics</li>
              </ul>
            </section>

            <!-- Termination -->
            <section :id="sections[6].id" class="terms-section">
              <h2>{{ sections[6].title }}</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
            </section>

            <!-- Limitation of Liability -->
            <section :id="sections[7].id" class="terms-section">
              <h2>{{ sections[7].title }}</h2>
              <p>
                In no event shall Biasbuster be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <!-- Disclaimer -->
            <section :id="sections[8].id" class="terms-section">
              <h2>{{ sections[8].title }}</h2>
              <p>
                The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the accuracy, reliability, or completeness of our bias detection.
              </p>
            </section>

            <!-- Changes to Terms -->
            <section :id="sections[9].id" class="terms-section">
              <h2>{{ sections[9].title }}</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date and posting the new terms on this page.
              </p>
            </section>

            <!-- Governing Law -->
            <section :id="sections[10].id" class="terms-section">
              <h2>{{ sections[10].title }}</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <!-- Contact -->
            <section :id="sections[11].id" class="terms-section">
              <h2>{{ sections[11].title }}</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div class="contact-info">
                <p>Email: legal@biasbuster.com</p>
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
  { id: 'agreement', title: 'Agreement to Terms' },
  { id: 'definitions', title: 'Definitions' },
  { id: 'accounts', title: 'User Accounts' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'user-content', title: 'User Content' },
  { id: 'termination', title: 'Termination' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Us' }
]

useHead({
  title: 'Terms of Service - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Read Biasbuster\'s Terms of Service to understand your rights and responsibilities when using our platform.'
    }
  ]
})
</script>

<style scoped>
.terms-view {
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

.terms-content {
  @apply md:col-span-3;
}

.terms-section {
  @apply mb-12;
}

.terms-section h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.terms-section p {
  @apply mb-4 text-gray-600 dark:text-gray-300;
}

.terms-section ul {
  @apply list-disc list-inside mb-4 text-gray-600 dark:text-gray-300;
}

.terms-section strong {
  @apply font-semibold;
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