<!-- Contact.vue -->
<template>
  <div class="container">
    <section class="contact-hero">
      <h2>Get in Touch</h2>
      <p class="contact-subheading">Have questions about Biasbuster? We're here to help!</p>
    </section>
    
    <section class="contact-content">
      <div class="contact-grid">
        <div class="contact-form-container">
          <h3>Send us a Message</h3>
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                required
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                required
              >
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <select 
                id="subject" 
                v-model="formData.subject"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                rows="6" 
                required
              ></textarea>
            </div>
            <button type="submit" class="primary-btn w-full" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
        
        <div class="contact-info">
          <h3>Contact Information</h3>
          <div class="info-items">
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h4>Email</h4>
                <p><a href="mailto:info@biasbuster.com">info@biasbuster.com</a></p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-headset"></i>
              </div>
              <div class="info-content">
                <h4>Support</h4>
                <p><a href="mailto:support@biasbuster.com">support@biasbuster.com</a></p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <h4>Location</h4>
                <p>123 Tech Plaza, Suite 400<br>San Francisco, CA 94107</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-content">
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
              </div>
            </div>
          </div>
          
          <div class="social-connect">
            <h4>Connect With Us</h4>
            <div class="social-icons">
              <a href="#" class="social-icon" target="_blank" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon" target="_blank" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="#" class="social-icon" target="_blank" aria-label="Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon" target="_blank" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="faq-section">
      <h3>Frequently Asked Questions</h3>
      <div class="faq-container">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="faq-item"
          :class="{ 'active': activeFaq === index }"
        >
          <div 
            class="faq-question"
            @click="toggleFaq(index)"
          >
            <h4>{{ faq.question }}</h4>
            <i class="fas" :class="activeFaq === index ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </div>
          <div class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  subject: 'general',
  message: ''
})

const isSubmitting = ref(false)
const activeFaq = ref(null)

const faqs = [
  {
    question: 'How quickly can I expect a response?',
    answer: 'We typically respond to all inquiries within 24-48 business hours. For urgent technical support issues, premium customers receive priority response times.'
  },
  {
    question: 'Do you offer technical support for the free plan?',
    answer: 'Yes, we provide basic technical support for all users, including those on the free plan. However, premium and team plan users receive priority support with faster response times.'
  },
  {
    question: 'Can I request a product demo?',
    answer: 'Absolutely! For team and enterprise solutions, we offer personalized demos. Please select "Sales" in the subject dropdown and mention your interest in a demo in your message.'
  }
]

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData)
    // Reset form after successful submission
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
    formData.subject = 'general'
    alert('Thank you for your message. We will get back to you soon!')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error sending your message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-hero {
  text-align: center;
  padding: 60px 0;
}

.contact-subheading {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-top: 1rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 40px 0;
}

.contact-form-container {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: var(--border-radius);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-color);
  color: var(--text-primary);
}

.form-group textarea {
  resize: vertical;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background: var(--primary-color-dark);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.w-full {
  width: 100%;
}

.contact-info {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: var(--border-radius);
}

.info-items {
  margin: 30px 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.info-content h4 {
  margin: 0 0 5px 0;
  color: var(--text-primary);
}

.info-content p {
  margin: 0;
  color: var(--text-secondary);
}

.social-connect {
  margin-top: 30px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-color);
  color: var(--text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.social-icon:hover {
  background: var(--primary-color);
  color: white;
}

.faq-section {
  margin: 60px 0;
}

.faq-container {
  margin-top: 30px;
}

.faq-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: 15px;
  overflow: hidden;
}

.faq-question {
  padding: 20px;
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h4 {
  margin: 0;
  color: var(--text-primary);
}

.faq-answer {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
}

.faq-item.active .faq-answer {
  padding: 20px;
  max-height: 200px;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style> 