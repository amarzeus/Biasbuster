<template>
  <div class="documentation">
    <aside class="doc-sidebar">
      <nav>
        <h3>Getting Started</h3>
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#quick-start">Quick Start Guide</a></li>
          <li><a href="#installation">Installation</a></li>
        </ul>

        <h3>Features</h3>
        <ul>
          <li><a href="#bias-detection">Bias Detection</a></li>
          <li><a href="#analysis-types">Analysis Types</a></li>
          <li><a href="#browser-extension">Browser Extension</a></li>
          <li><a href="#api-reference">API Reference</a></li>
        </ul>

        <h3>Guides</h3>
        <ul>
          <li><a href="#user-guide">User Guide</a></li>
          <li><a href="#developer-guide">Developer Guide</a></li>
          <li><a href="#best-practices">Best Practices</a></li>
        </ul>

        <h3>Resources</h3>
        <ul>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#troubleshooting">Troubleshooting</a></li>
          <li><a href="#support">Support</a></li>
        </ul>
      </nav>
    </aside>

    <div class="doc-content">
      <section id="introduction">
        <h1>BiasBuster Documentation</h1>
        <p>Welcome to the BiasBuster documentation. This guide will help you understand and utilize our AI-powered bias detection platform effectively.</p>
      </section>

      <section id="quick-start">
        <h2>Quick Start Guide</h2>
        <div class="quick-start-steps">
          <div class="step">
            <h3>1. Install the Extension</h3>
            <p>Download and install the BiasBuster Chrome extension from the Chrome Web Store.</p>
          </div>
          <div class="step">
            <h3>2. Create an Account</h3>
            <p>Sign up for a free account to access all features and save your analysis history.</p>
          </div>
          <div class="step">
            <h3>3. Start Analyzing</h3>
            <p>Click the BiasBuster icon while reading any news article to analyze it for bias.</p>
          </div>
        </div>
      </section>

      <section id="bias-detection">
        <h2>Bias Detection</h2>
        <h3>How It Works</h3>
        <p>BiasBuster uses advanced natural language processing and machine learning to identify various types of bias in text:</p>
        <ul>
          <li>Political bias</li>
          <li>Gender bias</li>
          <li>Racial bias</li>
          <li>Cultural bias</li>
          <li>Socioeconomic bias</li>
        </ul>

        <h3>Analysis Process</h3>
        <ol>
          <li>Text extraction and preprocessing</li>
          <li>Sentiment analysis</li>
          <li>Bias pattern recognition</li>
          <li>Context evaluation</li>
          <li>Source credibility assessment</li>
        </ol>
      </section>

      <section id="api-reference">
        <h2>API Reference</h2>
        <div class="api-endpoints">
          <h3>Authentication</h3>
          <pre><code>
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
          </code></pre>

          <h3>Analysis</h3>
          <pre><code>
POST /api/analysis/analyze
GET /api/analysis/{id}
GET /api/analysis/user/analyses
          </code></pre>

          <h3>Example Request</h3>
          <pre><code>
curl -X POST https://api.biasbuster.com/analysis/analyze \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"text": "Your text here"}'
          </code></pre>
        </div>
      </section>

      <section id="best-practices">
        <h2>Best Practices</h2>
        <div class="best-practices">
          <h3>For Users</h3>
          <ul>
            <li>Always verify results with multiple sources</li>
            <li>Consider context and intent</li>
            <li>Report false positives to improve accuracy</li>
            <li>Use the educational resources provided</li>
          </ul>

          <h3>For Developers</h3>
          <ul>
            <li>Implement rate limiting for API calls</li>
            <li>Cache analysis results when appropriate</li>
            <li>Handle errors gracefully</li>
            <li>Follow security best practices</li>
          </ul>
        </div>
      </section>

      <section id="support">
        <h2>Support</h2>
        <div class="support-options">
          <div class="support-card">
            <h3>Community Forum</h3>
            <p>Join our community forum for discussions and peer support.</p>
            <a href="#forum" class="button">Visit Forum</a>
          </div>
          <div class="support-card">
            <h3>Technical Support</h3>
            <p>Contact our technical team for implementation assistance.</p>
            <a href="#support" class="button">Get Help</a>
          </div>
          <div class="support-card">
            <h3>Feature Requests</h3>
            <p>Submit and vote on new feature requests.</p>
            <a href="#features" class="button">Submit Request</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// No reactive state needed for this component
</script>

<style scoped>
.documentation {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.doc-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.doc-sidebar h3 {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
}

.doc-sidebar h3:first-child {
  margin-top: 0;
}

.doc-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.doc-sidebar li {
  margin: 0.5rem 0;
}

.doc-sidebar a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.doc-sidebar a:hover {
  color: var(--primary-color);
}

.doc-content {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.doc-content h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.doc-content h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
}

.doc-content h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}

.doc-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.doc-content ul,
.doc-content ol {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.doc-content li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.quick-start-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.step {
  background: var(--background-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step h3 {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.api-endpoints {
  background: var(--background-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

.api-endpoints pre {
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
}

.api-endpoints code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.best-practices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.support-card {
  background: var(--background-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-align: center;
}

.support-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.support-card p {
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background-color 0.3s ease;
}

.button:hover {
  background: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .documentation {
    grid-template-columns: 1fr;
  }

  .doc-sidebar {
    position: static;
    margin-bottom: 2rem;
  }

  .doc-content {
    padding: 1.5rem;
  }

  .doc-content h1 {
    font-size: 2rem;
  }

  .doc-content h2 {
    font-size: 1.5rem;
  }

  .doc-content h3 {
    font-size: 1.2rem;
  }

  .quick-start-steps,
  .best-practices,
  .support-options {
    grid-template-columns: 1fr;
  }
}
</style>
