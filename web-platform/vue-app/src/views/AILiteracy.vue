<template>
  <div class="ai-literacy">
    <section class="hero hero--secondary">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Understanding AI in Bias Detection</h1>
          <p class="hero__description">
            Master the intersection of artificial intelligence and media literacy. Learn how AI helps identify bias and make informed decisions.
          </p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <article class="content-card">
            <h2>How AI Detects Bias</h2>
            <div class="content-card__body">
              <p>Our advanced AI system analyzes text using multiple parameters:</p>
              <ul>
                <li>Language patterns and word choice</li>
                <li>Sentiment analysis</li>
                <li>Context evaluation</li>
                <li>Source credibility assessment</li>
              </ul>
            </div>
          </article>

          <article class="content-card">
            <h2>Types of Bias</h2>
            <div class="content-card__body">
              <div class="bias-type">
                <h3>Confirmation Bias</h3>
                <p>Tendency to favor information that confirms existing beliefs.</p>
              </div>
              <div class="bias-type">
                <h3>Selection Bias</h3>
                <p>Cherry-picking data or stories that support a particular narrative.</p>
              </div>
              <div class="bias-type">
                <h3>Attribution Bias</h3>
                <p>Attributing behaviors to character rather than circumstance.</p>
              </div>
            </div>
          </article>

          <article class="content-card">
            <h2>AI Limitations</h2>
            <div class="content-card__body">
              <p>Understanding AI's capabilities and limitations:</p>
              <ul>
                <li>Context interpretation challenges</li>
                <li>Cultural nuances</li>
                <li>Sarcasm and humor detection</li>
                <li>Complex narrative structures</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="interactive-section">
      <div class="container">
        <h2>Interactive Learning Modules</h2>
        <div class="modules-grid">
          <div v-for="module in learningModules" 
               :key="module.title" 
               class="module-card"
          >
            <div class="module-card__header">
              <h3>{{ module.title }}</h3>
              <span class="module-badge" :class="module.level.toLowerCase()">
                {{ module.level }}
              </span>
            </div>
            <p>{{ module.description }}</p>
            <button class="btn btn--secondary" @click="startModule(module)">
              Start Module
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="resources-section">
      <div class="container">
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
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const learningModules = ref([
  {
    title: 'Bias Recognition',
    level: 'Beginner',
    description: 'Learn to identify common forms of bias in media.',
    link: '#'
  },
  {
    title: 'AI Analysis Deep Dive',
    level: 'Intermediate',
    description: 'Understand how AI analyzes and scores bias in text.',
    link: '#'
  },
  {
    title: 'Advanced Interpretation',
    level: 'Advanced',
    description: 'Master the nuances of AI-powered bias detection.',
    link: '#'
  }
])

const resources = ref([
  {
    title: 'Research Papers',
    description: 'Academic research on AI in bias detection',
    link: '#'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step guides on using our platform',
    link: '#'
  },
  {
    title: 'Case Studies',
    description: 'Real-world examples of bias detection',
    link: '#'
  },
  {
    title: 'Community Forum',
    description: 'Discuss and share insights with others',
    link: '#'
  }
])

const startModule = (module) => {
  // TODO: Implement module navigation
  console.log('Starting module:', module.title)
}
</script>

<style scoped>
.ai-literacy {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

.hero--secondary {
  background: linear-gradient(135deg, var(--primary-color-light), var(--primary-color));
}

.hero__title {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero__description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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

.content-card h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.content-card__body {
  color: var(--text-secondary);
}

.content-card ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.content-card li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.content-card li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.bias-type {
  margin-bottom: 1.5rem;
}

.bias-type h3 {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.interactive-section {
  margin: 4rem 0;
}

.interactive-section h2 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.module-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.module-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.module-card h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin: 0;
}

.module-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.module-badge.beginner {
  background: var(--success-color-light);
  color: var(--success-color);
}

.module-badge.intermediate {
  background: var(--warning-color-light);
  color: var(--warning-color);
}

.module-badge.advanced {
  background: var(--error-color-light);
  color: var(--error-color);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn--secondary {
  background: var(--primary-color);
  color: white;
}

.btn--secondary:hover {
  background: var(--primary-color-dark);
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
  .ai-literacy {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 1rem;
  }

  .hero__title {
    font-size: 2rem;
  }

  .content-grid,
  .modules-grid,
  .resources-grid {
    grid-template-columns: 1fr;
  }

  .module-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
