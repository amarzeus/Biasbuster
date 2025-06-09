<template>
  <div class="contact-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Contact Us</h1>
        <p class="subtitle">Get in touch with our team for support, partnerships, or general inquiries.</p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form">
            <h2>Send us a Message</h2>
            <form @submit.prevent="submitForm" class="form">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Your name"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Your email"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select
                  id="subject"
                  v-model="form.subject"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="6"
                  placeholder="Your message"
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                :loading="submitting"
              >
                Send Message
              </Button>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="contact-info">
            <h2>Contact Information</h2>
            
            <div class="info-card">
              <i class="icon-email"></i>
              <div class="info-content">
                <h3>Email</h3>
                <p>support@biasbuster.com</p>
                <p>partnerships@biasbuster.com</p>
              </div>
            </div>

            <div class="info-card">
              <i class="icon-location"></i>
              <div class="info-content">
                <h3>Office Location</h3>
                <p>123 Innovation Street</p>
                <p>Tech Hub, CA 94107</p>
                <p>United States</p>
              </div>
            </div>

            <div class="info-card">
              <i class="icon-social"></i>
              <div class="info-content">
                <h3>Social Media</h3>
                <div class="social-links">
                  <a href="https://twitter.com/biasbuster" target="_blank" rel="noopener">
                    <i class="icon-twitter"></i>
                    Twitter
                  </a>
                  <a href="https://linkedin.com/company/biasbuster" target="_blank" rel="noopener">
                    <i class="icon-linkedin"></i>
                    LinkedIn
                  </a>
                  <a href="https://github.com/biasbuster" target="_blank" rel="noopener">
                    <i class="icon-github"></i>
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            <div class="info-card">
              <i class="icon-support"></i>
              <div class="info-content">
                <h3>Support Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                <p>Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
          >
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
      <div class="map-container">
        <!-- TODO: Add Google Maps integration -->
        <div class="map-placeholder">
          <p>Map loading...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)

const faqs = [
  {
    question: 'How do I get started with Biasbuster?',
    answer: 'Simply install our Chrome extension and start browsing. The extension will automatically analyze content for bias.'
  },
  {
    question: 'Is Biasbuster free to use?',
    answer: 'We offer both free and premium plans. The free plan includes basic bias detection, while premium features include advanced analysis and educational resources.'
  },
  {
    question: 'How accurate is the bias detection?',
    answer: 'Our AI models are trained on diverse datasets and regularly audited for fairness. We maintain a 95% accuracy rate in bias detection.'
  },
  {
    question: 'Can I customize the bias detection settings?',
    answer: 'Yes, you can adjust sensitivity levels and customize which types of bias to detect in the extension settings.'
  }
]

const submitForm = async () => {
  submitting.value = true
  try {
    // TODO: Implement form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    // Show success message
  } catch (error) {
    console.error('Form submission failed:', error)
    // Show error message
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'Contact Us - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with the Biasbuster team for support, partnerships, or general inquiries.'
    }
  ]
})
</script>

<style scoped>
.contact-view {
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

.contact-section {
  @apply py-20;
}

.contact-grid {
  @apply grid md:grid-cols-2 gap-12;
}

.contact-form {
  @apply bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8;
}

.contact-form h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.form {
  @apply space-y-6;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-group input,
.form-group select,
.form-group textarea {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

.contact-info {
  @apply space-y-8;
}

.contact-info h2 {
  @apply text-2xl font-bold mb-6 text-gray-900 dark:text-white;
}

.info-card {
  @apply flex items-start gap-4 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.info-card i {
  @apply text-2xl text-blue-600 dark:text-blue-400;
}

.info-content h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.info-content p {
  @apply text-gray-600 dark:text-gray-300;
}

.social-links {
  @apply flex flex-col gap-2;
}

.social-links a {
  @apply flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.faq-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800;
}

.faq-section h2 {
  @apply text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white;
}

.faq-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.faq-item {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.faq-item h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.faq-item p {
  @apply text-gray-600 dark:text-gray-300;
}

.map-section {
  @apply h-96;
}

.map-container {
  @apply h-full;
}

.map-placeholder {
  @apply h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center;
}

@media (max-width: 768px) {
  .contact-grid {
    @apply grid-cols-1;
  }
  
  .faq-grid {
    @apply grid-cols-1;
  }
}
</style> 