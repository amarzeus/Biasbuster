<template>
  <div class="ai-ethics-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>AI Ethics & Governance</h1>
        <p class="subtitle">Our commitment to responsible AI, transparency, and fairness</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Model Transparency -->
          <section class="transparency-section">
            <h2>Model Transparency</h2>
            <div class="transparency-content">
              <div class="model-card">
                <h3>Bias Detection Model</h3>
                <div class="model-details">
                  <div class="model-metric">
                    <span class="metric-label">Accuracy</span>
                    <span class="metric-value">95%</span>
                  </div>
                  <div class="model-metric">
                    <span class="metric-label">False Positive Rate</span>
                    <span class="metric-value">3%</span>
                  </div>
                  <div class="model-metric">
                    <span class="metric-label">Last Updated</span>
                    <span class="metric-value">March 15, 2024</span>
                  </div>
                </div>
                <div class="model-documentation">
                  <h4>Model Documentation</h4>
                  <ul>
                    <li>Training data sources and methodology</li>
                    <li>Model architecture and parameters</li>
                    <li>Performance metrics and benchmarks</li>
                    <li>Regular audit reports</li>
                  </ul>
                  <a href="/docs/model-card.pdf" class="documentation-link" target="_blank">
                    View Full Model Card
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- Bias Audit Methodology -->
          <section class="audit-section">
            <h2>Bias Audit Methodology</h2>
            <div class="audit-content">
              <div class="audit-steps">
                <div class="audit-step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h3>Data Collection & Preprocessing</h3>
                    <p>Diverse, representative datasets with balanced demographics and contexts</p>
                    <ul>
                      <li>Source diversity assessment</li>
                      <li>Data quality checks</li>
                      <li>Bias detection in training data</li>
                    </ul>
                  </div>
                </div>
                <div class="audit-step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h3>Model Training & Evaluation</h3>
                    <p>Fairness-aware training with continuous monitoring</p>
                    <ul>
                      <li>Fairness metrics tracking</li>
                      <li>Cross-validation across demographics</li>
                      <li>Performance disparity analysis</li>
                    </ul>
                  </div>
                </div>
                <div class="audit-step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h3>Post-Deployment Monitoring</h3>
                    <p>Continuous monitoring and improvement</p>
                    <ul>
                      <li>Real-time performance tracking</li>
                      <li>User feedback analysis</li>
                      <li>Regular model updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Explainable AI -->
          <section class="explainability-section">
            <h2>Explainable AI</h2>
            <div class="explainability-content">
              <div class="explainability-features">
                <div class="feature-card">
                  <h3>Bias Explanations</h3>
                  <p>Clear, user-friendly explanations for detected bias</p>
                  <ul>
                    <li>Context-aware explanations</li>
                    <li>Supporting evidence</li>
                    <li>Impact assessment</li>
                  </ul>
                </div>
                <div class="feature-card">
                  <h3>Model Decisions</h3>
                  <p>Transparent decision-making process</p>
                  <ul>
                    <li>Decision factors</li>
                    <li>Confidence scores</li>
                    <li>Alternative interpretations</li>
                  </ul>
                </div>
                <div class="feature-card">
                  <h3>User Control</h3>
                  <p>Customizable detection settings</p>
                  <ul>
                    <li>Sensitivity adjustment</li>
                    <li>Custom bias patterns</li>
                    <li>Feedback integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Responsible AI Principles -->
          <section class="principles-section">
            <h2>Responsible AI Principles</h2>
            <div class="principles-content">
              <div class="principles-grid">
                <div class="principle-card">
                  <h3>Fairness</h3>
                  <p>Ensuring unbiased, equitable outcomes across all demographics</p>
                </div>
                <div class="principle-card">
                  <h3>Transparency</h3>
                  <p>Clear, understandable explanations of AI decisions and processes</p>
                </div>
                <div class="principle-card">
                  <h3>Privacy</h3>
                  <p>Protecting user data and maintaining confidentiality</p>
                </div>
                <div class="principle-card">
                  <h3>Accountability</h3>
                  <p>Taking responsibility for AI system outcomes and impacts</p>
                </div>
                <div class="principle-card">
                  <h3>Security</h3>
                  <p>Ensuring robust protection against misuse and attacks</p>
                </div>
                <div class="principle-card">
                  <h3>Human Oversight</h3>
                  <p>Maintaining human control and intervention capabilities</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Compliance & Certifications -->
          <section class="compliance-section">
            <h2>Compliance & Certifications</h2>
            <div class="compliance-content">
              <div class="compliance-grid">
                <div class="compliance-card">
                  <img src="@/assets/images/certifications/gdpr.svg" alt="GDPR Compliance" class="certification-badge" />
                  <h3>GDPR Compliance</h3>
                  <p>Full compliance with EU data protection regulations</p>
                </div>
                <div class="compliance-card">
                  <img src="@/assets/images/certifications/ccpa.svg" alt="CCPA Compliance" class="certification-badge" />
                  <h3>CCPA Compliance</h3>
                  <p>Adherence to California consumer privacy standards</p>
                </div>
                <div class="compliance-card">
                  <img src="@/assets/images/certifications/iso.svg" alt="ISO 27001" class="certification-badge" />
                  <h3>ISO 27001</h3>
                  <p>Information security management certification</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Contact Section -->
          <section class="contact-section">
            <h2>Ethics Committee</h2>
            <div class="contact-card">
              <div class="contact-info">
                <h3>Contact Our Ethics Team</h3>
                <p>For questions about our AI ethics and governance:</p>
                <div class="contact-details">
                  <p><strong>Email:</strong> ethics@biasbuster.com</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                </div>
              </div>
              <div class="contact-actions">
                <a href="mailto:ethics@biasbuster.com" class="contact-button">
                  <i class="icon-mail"></i>
                  Contact Ethics Team
                </a>
                <a href="/docs/ethics-report.pdf" download class="download-all-button">
                  <i class="icon-download"></i>
                  Download Ethics Report
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
  title: 'AI Ethics & Governance - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn about Biasbuster\'s commitment to responsible AI, model transparency, bias audit methodology, and ethical principles.'
    }
  ]
})
</script>

<style scoped>
.ai-ethics-view {
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

.transparency-section,
.audit-section,
.explainability-section,
.principles-section,
.compliance-section,
.contact-section {
  @apply mb-16;
}

.transparency-section h2,
.audit-section h2,
.explainability-section h2,
.principles-section h2,
.compliance-section h2,
.contact-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.model-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.model-card h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.model-details {
  @apply grid grid-cols-3 gap-4 mb-6;
}

.model-metric {
  @apply flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.metric-label {
  @apply text-sm text-gray-600 dark:text-gray-300 mb-1;
}

.metric-value {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.model-documentation {
  @apply mt-6;
}

.model-documentation h4 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.model-documentation ul {
  @apply space-y-2 mb-4 text-gray-600 dark:text-gray-300;
}

.documentation-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.audit-steps {
  @apply space-y-8;
}

.audit-step {
  @apply flex gap-6;
}

.step-number {
  @apply w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xl;
}

.step-content {
  @apply flex-1 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.step-content h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.step-content p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.step-content ul {
  @apply space-y-2 text-gray-600 dark:text-gray-300;
}

.explainability-features {
  @apply grid md:grid-cols-3 gap-8;
}

.feature-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.feature-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.feature-card p {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.feature-card ul {
  @apply space-y-2 text-gray-600 dark:text-gray-300;
}

.principles-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.principle-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.principle-card h3 {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.principle-card p {
  @apply text-gray-600 dark:text-gray-300;
}

.compliance-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.compliance-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.compliance-card img {
  @apply w-16 h-16 mx-auto mb-4;
}

.compliance-card h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.compliance-card p {
  @apply text-gray-600 dark:text-gray-300;
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
  .model-details {
    @apply grid-cols-1;
  }
  
  .audit-step {
    @apply flex-col;
  }
  
  .step-number {
    @apply mx-auto mb-4;
  }
  
  .explainability-features,
  .principles-grid,
  .compliance-grid {
    @apply grid-cols-1;
  }
  
  .contact-actions {
    @apply flex-col;
  }
}

.certification-badge {
  width: 100px;
  height: 100px;
  margin: 1rem;
}
</style> 