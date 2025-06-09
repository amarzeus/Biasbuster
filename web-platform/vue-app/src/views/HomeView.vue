<template>
  <div class="home-view">
    <!-- Header -->
    <header class="site-header">
      <nav class="main-nav">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.svg" alt="BiasBuster Logo" width="40" height="40">
            <span>BiasBuster</span>
          </router-link>
        </div>
        <ul class="nav-links">
          <li><router-link to="/features">Features</router-link></li>
          <li><router-link to="/ai-literacy">AI Literacy</router-link></li>
          <li><router-link to="/docs">Docs</router-link></li>
          <li><router-link to="/try-demo" class="try-demo-link">Try Demo</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <h1>Detect Media Bias in Real-Time</h1>
        <p class="subtitle">BiasBuster uses advanced AI to analyze news articles, identify potential biases, and provide balanced perspectives. Make informed decisions with our powerful bias detection tools.</p>
        
        <div class="cta-buttons">
          <button class="primary-button" @click="$router.push('/try-demo')">Try Demo</button>
          <button class="secondary-button" @click="showVideo">Watch Video</button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Features</h2>
          <p class="section-subtitle">A Better Way to Write</p>
          <p class="section-description">Everything you need to create unbiased, inclusive content.</p>
        </div>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.name" class="feature-card">
            <div class="feature-icon">
              <component :is="feature.icon" class="icon" aria-hidden="true" />
            </div>
            <h3 class="feature-title">{{ feature.name }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- Analysis Tool Section -->
      <section class="analysis-container">
        <div class="side-by-side-view">
          <!-- Input Section -->
          <div class="input-section">
            <div class="input-header">
              <h3>Original Text</h3>
              <div class="analysis-options">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="realtimeAnalysis">
                  <span class="toggle-slider"></span>
                  Real-time Analysis
                </label>
                <select v-model="sensitivityLevel" class="sensitivity-select">
                  <option value="low">Low Sensitivity</option>
                  <option value="medium">Medium Sensitivity</option>
                  <option value="high">High Sensitivity</option>
                </select>
              </div>
            </div>
            
            <textarea 
              v-model="inputText"
              class="enhanced-textarea" 
              placeholder="Paste any news article or text here to analyze for bias..."
              @input="handleInput"
            ></textarea>
            
            <div class="analysis-controls">
              <button class="primary-button" @click="analyzeText">
                <span class="button-icon">📊</span>
                Analyze Text
              </button>
              <button class="secondary-button" @click="clearText">
                <span class="button-icon">🗑️</span>
                Clear
              </button>
            </div>
          </div>

          <!-- Results Section -->
          <div class="results-section">
            <div class="results-header">
              <h3>Analysis Results</h3>
              <div class="customization-options">
                <button class="tool-button" @click="showColorModal">
                  <span class="button-icon">🎨</span>
                  Customize Colors
                </button>
                <button class="tool-button" @click="showBiasModal">
                  <span class="button-icon">⚙️</span>
                  Bias Settings
                </button>
                <button class="tool-button" @click="toggleTheme" aria-label="Toggle theme">
                  <span class="button-icon">{{ isDarkTheme ? '🌙' : '🌞' }}</span>
                </button>
              </div>
            </div>
            
            <div id="analysis-results" :class="{ show: hasResults }">
              <p v-if="!hasResults" class="placeholder">Results will appear here...</p>
              <div v-else class="results-content">
                <!-- Results content will be dynamically rendered -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="section-header">
          <h2>How It Works</h2>
          <p class="section-subtitle">Simple, Fast, and Effective</p>
        </div>

        <div class="steps-grid">
          <div v-for="step in steps" :key="step.name" class="step-card">
            <div class="step-number">{{ step.number }}</div>
            <h3 class="step-title">{{ step.name }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="section-header">
          <h2>Testimonials</h2>
          <p class="section-subtitle">Trusted by Writers Worldwide</p>
        </div>

        <div class="testimonials-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="testimonial-card">
            <p class="testimonial-quote">{{ testimonial.quote }}</p>
            <div class="testimonial-author">
              <img :src="testimonial.image" :alt="testimonial.name" class="author-image">
              <div class="author-info">
                <p class="author-name">{{ testimonial.name }}</p>
                <p class="author-title">{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to start writing better?</h2>
          <p>Try Biasbuster today.</p>
          <div class="cta-buttons">
            <router-link to="/analysis" class="primary-button">Get started</router-link>
            <router-link to="/education" class="secondary-button">Learn more</router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <Modal v-if="showColorSettings" @close="showColorSettings = false">
      <template #header>
        <h3>Customize Colors</h3>
      </template>
      <template #default>
        <div class="color-options">
          <div class="color-option">
            <label for="bias-highlight-color">Bias Highlight Color</label>
            <input type="color" id="bias-highlight-color" v-model="biasHighlightColor">
          </div>
          <div class="color-option">
            <label for="suggestion-highlight-color">Suggestion Highlight Color</label>
            <input type="color" id="suggestion-highlight-color" v-model="suggestionHighlightColor">
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-buttons">
          <button class="primary-button" @click="saveColorSettings">Save Changes</button>
          <button class="secondary-button" @click="showColorSettings = false">Cancel</button>
        </div>
      </template>
    </Modal>

    <Modal v-if="showBiasSettings" @close="showBiasSettings = false">
      <template #header>
        <h3>Bias Detection Settings</h3>
      </template>
      <template #default>
        <div class="bias-settings">
          <div class="custom-bias-words">
            <h4>Custom Bias Words</h4>
            <textarea 
              v-model="customBiasWords"
              placeholder="Add custom words (one per line)"
            ></textarea>
          </div>
          <div class="bias-categories">
            <h4>Categories to Detect</h4>
            <div class="category-toggles">
              <label v-for="category in biasCategories" :key="category.value">
                <input 
                  type="checkbox" 
                  v-model="selectedCategories" 
                  :value="category.value"
                >
                {{ category.label }}
              </label>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-buttons">
          <button class="primary-button" @click="saveBiasSettings">Save Changes</button>
          <button class="secondary-button" @click="showBiasSettings = false">Cancel</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/Common/Modal.vue'

// State
const inputText = ref('')
const realtimeAnalysis = ref(true)
const sensitivityLevel = ref('medium')
const showColorSettings = ref(false)
const showBiasSettings = ref(false)
const isDarkTheme = ref(false)
const biasHighlightColor = ref('#ff0000')
const suggestionHighlightColor = ref('#00ff00')
const customBiasWords = ref('')
const selectedCategories = ref(['political', 'gender', 'racial', 'cultural', 'socioeconomic', 'religious'])

// Features
const features = ref([
  {
    name: 'Real-time Analysis',
    description: 'Get instant feedback on potential bias in your writing as you type.',
    icon: 'LightningBoltIcon'
  },
  {
    name: 'Multiple Bias Types',
    description: 'Detect various forms of bias including gender, racial, age, and more.',
    icon: 'ScaleIcon'
  },
  {
    name: 'Educational Resources',
    description: 'Learn about different types of bias and how to avoid them.',
    icon: 'AcademicCapIcon'
  },
  {
    name: 'Custom Keywords',
    description: 'Add your own keywords to detect specific types of bias.',
    icon: 'KeyIcon'
  }
])

// Steps
const steps = ref([
  {
    number: '1',
    name: 'Paste Your Content',
    description: 'Simply paste your text into our editor.'
  },
  {
    number: '2',
    name: 'Get Analysis',
    description: 'Our AI analyzes your content for potential bias.'
  },
  {
    number: '3',
    name: 'Make Improvements',
    description: 'Follow our suggestions to make your writing more inclusive.'
  }
])

// Testimonials
const testimonials = ref([
  {
    quote: 'Biasbuster has transformed how I write. It helps me catch unconscious bias before publishing.',
    name: 'Sarah Johnson',
    title: 'Content Writer',
    image: '/images/testimonials/sarah.jpg'
  },
  {
    quote: 'An essential tool for any writer who wants to create inclusive content.',
    name: 'Michael Chen',
    title: 'Journalist',
    image: '/images/testimonials/michael.jpg'
  }
])

// Computed
const hasResults = computed(() => {
  // TODO: Implement results check
  return false
})

// Bias categories
const biasCategories = [
  { value: 'political', label: 'Political Bias' },
  { value: 'gender', label: 'Gender Bias' },
  { value: 'racial', label: 'Racial Bias' },
  { value: 'cultural', label: 'Cultural Bias' },
  { value: 'socioeconomic', label: 'Socioeconomic Bias' },
  { value: 'religious', label: 'Religious Bias' }
]

// Methods
const handleInput = () => {
  if (realtimeAnalysis.value) {
    // TODO: Implement real-time analysis
  }
}

const analyzeText = () => {
  // TODO: Implement text analysis
}

const clearText = () => {
  inputText.value = ''
}

const showVideo = () => {
  // TODO: Implement video modal
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
}

const showColorModal = () => {
  showColorSettings.value = true
}

const showBiasModal = () => {
  showBiasSettings.value = true
}

const saveColorSettings = () => {
  // TODO: Implement color settings save
  showColorSettings.value = false
}

const saveBiasSettings = () => {
  // TODO: Implement bias settings save
  showBiasSettings.value = false
}
</script>

<style scoped>
@import '@/assets/styles/common.css';
@import '@/assets/styles/analysis.css';

.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  background-color: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.try-demo-link {
  background-color: var(--primary-color);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
}

.try-demo-link:hover {
  background-color: var(--primary-color-dark);
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  opacity: 0.9;
}

/* Features Section */
.features-section {
  padding: 4rem 2rem;
  background-color: var(--background-color);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon .icon {
  width: 24px;
  height: 24px;
  color: white;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.5;
}

/* How It Works Section */
.how-it-works-section {
  padding: 4rem 2rem;
  background-color: var(--bg-secondary);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.step-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.step-number {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.step-description {
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Testimonials Section */
.testimonials-section {
  padding: 4rem 2rem;
  background-color: var(--background-color);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonial-quote {
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.author-title {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-nav {
    padding: 1rem;
  }

  .nav-links {
    display: none;
  }

  .hero-section {
    padding: 3rem 1rem;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .section-subtitle {
    font-size: 2rem;
  }

  .features-grid,
  .steps-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
