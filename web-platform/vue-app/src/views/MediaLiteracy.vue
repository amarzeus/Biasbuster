<!-- MediaLiteracy.vue -->
<template>
  <div class="media-literacy">
    <section class="hero-section">
      <h1>Understanding Media Bias</h1>
      <p>Learn to identify, analyze, and overcome media bias in the digital age</p>
    </section>

    <section class="content-section">
      <div class="content-grid">
        <article class="content-card">
          <h2>Types of Media Bias</h2>
          <div class="bias-types">
            <div class="bias-type">
              <h3>Selection Bias</h3>
              <p>Stories chosen or ignored to promote a certain narrative</p>
            </div>
            <div class="bias-type">
              <h3>Placement Bias</h3>
              <p>Story positioning to influence perceived importance</p>
            </div>
            <div class="bias-type">
              <h3>Language Bias</h3>
              <p>Word choice that affects story interpretation</p>
            </div>
            <div class="bias-type">
              <h3>Source Bias</h3>
              <p>Selective quoting to support specific viewpoints</p>
            </div>
          </div>
        </article>

        <article class="content-card">
          <h2>Identifying Bias</h2>
          <div class="checklist">
            <h3>Key Questions to Ask:</h3>
            <ul>
              <li>Who created this content?</li>
              <li>What is their motivation?</li>
              <li>What facts or perspectives are missing?</li>
              <li>How does the language influence interpretation?</li>
              <li>Are sources credible and diverse?</li>
            </ul>
          </div>
        </article>

        <article class="content-card">
          <h2>Common Bias Indicators</h2>
          <div class="indicators">
            <ul>
              <li>Emotional language</li>
              <li>Loaded words</li>
              <li>Oversimplification</li>
              <li>False equivalence</li>
              <li>Cherry-picked data</li>
              <li>Lack of context</li>
              <li>One-sided reporting</li>
              <li>Ad hominem attacks</li>
            </ul>
          </div>
        </article>

        <article class="content-card">
          <h2>Fact-Checking Tools</h2>
          <div class="tools-list">
            <ul>
              <li>Primary source verification</li>
              <li>Cross-reference multiple sources</li>
              <li>Fact-checking websites</li>
              <li>Academic databases</li>
              <li>BiasBuster AI analysis</li>
            </ul>
          </div>
        </article>

        <article class="content-card full-width">
          <h2>Interactive Learning</h2>
          <div class="interactive-demo">
            <h3>Practice Bias Detection</h3>
            <div class="example-text">
              <p>Click on any text below to analyze it for potential bias:</p>
              <div class="bias-examples">
                <div 
                  v-for="(example, index) in examples" 
                  :key="index"
                  class="example"
                  @click="analyzeExample(example)"
                >
                  {{ example.text }}
                </div>
              </div>
              <div v-if="selectedAnalysis" class="analysis-result">
                <h4>Analysis Results:</h4>
                <ul>
                  <li v-for="(result, index) in selectedAnalysis" :key="index">
                    {{ result }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="resources-section">
      <h2>Additional Resources</h2>
      <div class="resources-grid">
        <a v-for="resource in resources" 
           :key="resource.title" 
           :href="resource.link" 
           class="resource-card"
        >
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const examples = ref([
  {
    text: "The controversial politician's radical agenda has sparked outrage among concerned citizens.",
    analysis: [
      "Emotional language: 'controversial', 'radical', 'outrage'",
      "Loaded terms: 'agenda'",
      "One-sided perspective: lacks opposing viewpoints"
    ]
  },
  {
    text: "Studies suggest the innovative policy could benefit economic growth.",
    analysis: [
      "Neutral language",
      "Qualified statement: 'could benefit'",
      "Fact-based approach"
    ]
  },
  {
    text: "Experts warn that the proposed changes might have unintended consequences.",
    analysis: [
      "Appeal to authority: 'Experts warn'",
      "Balanced perspective: acknowledges potential risks",
      "Qualified statement: 'might have'"
    ]
  }
])

const resources = ref([
  {
    title: "Media Bias Chart",
    description: "Download our comprehensive media bias classification chart",
    link: "#"
  },
  {
    title: "Bias Detection Guide",
    description: "Step-by-step guide for identifying different types of bias",
    link: "#"
  },
  {
    title: "Case Studies",
    description: "Real-world examples of media bias analysis",
    link: "#"
  },
  {
    title: "Educational Videos",
    description: "Video tutorials on media literacy and bias detection",
    link: "#"
  }
])

const selectedAnalysis = ref(null)

const analyzeExample = (example) => {
  selectedAnalysis.value = example.analysis
}
</script>

<style scoped>
.media-literacy {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.content-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-card.full-width {
  grid-column: 1 / -1;
}

.content-card h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.content-card h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.bias-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.bias-type {
  padding: 1rem;
  background: var(--background-color);
  border-radius: var(--border-radius);
}

.bias-type h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.bias-type p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.checklist ul,
.indicators ul,
.tools-list ul {
  list-style: none;
  padding: 0;
}

.checklist li,
.indicators li,
.tools-list li {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.checklist li::before,
.indicators li::before,
.tools-list li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.interactive-demo {
  background: var(--background-color);
  padding: 2rem;
  border-radius: var(--border-radius);
}

.bias-examples {
  margin: 1.5rem 0;
}

.example {
  background: var(--surface-color);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.example:hover {
  background: var(--primary-color-light);
}

.analysis-result {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
}

.analysis-result h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.analysis-result ul {
  list-style: none;
  padding: 0;
}

.analysis-result li {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.analysis-result li::before {
  content: "→";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.resources-section {
  margin-top: 4rem;
}

.resources-section h2 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.resource-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: transform 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
}

.resource-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.resource-card p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .media-literacy {
    padding: 1rem;
  }

  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .bias-types {
    grid-template-columns: 1fr;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style> 