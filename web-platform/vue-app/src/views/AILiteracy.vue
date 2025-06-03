<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Literacy Hub
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Learn about AI bias, understand its implications, and discover how to create more inclusive AI systems.
        </p>
      </div>

      <!-- Learning Modules -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="module in learningModules" :key="module.id" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="text-4xl mb-4">{{ module.icon }}</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ module.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ module.description }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ module.duration }}
            </span>
            <button class="btn-primary text-sm">
              Start Learning
            </button>
          </div>
        </div>
      </div>

      <!-- Resources Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Additional Resources
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📚 Research Papers
            </h3>
            <ul class="space-y-3">
              <li v-for="paper in researchPapers" :key="paper.title">
                <a href="#" class="text-trust-blue hover:text-trust-blue-dark">
                  {{ paper.title }}
                </a>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ paper.authors }}</p>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🎥 Video Tutorials
            </h3>
            <ul class="space-y-3">
              <li v-for="video in videoTutorials" :key="video.title">
                <a href="#" class="text-trust-blue hover:text-trust-blue-dark">
                  {{ video.title }}
                </a>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ video.duration }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const learningModules = [
  {
    id: 1,
    title: 'Understanding AI Bias',
    description: 'Learn the fundamentals of bias in artificial intelligence systems.',
    icon: '🧠',
    duration: '30 min'
  },
  {
    id: 2,
    title: 'Types of Bias',
    description: 'Explore different categories of bias and their real-world impacts.',
    icon: '🔍',
    duration: '45 min'
  },
  {
    id: 3,
    title: 'Bias Detection Methods',
    description: 'Discover techniques and tools for identifying bias in AI systems.',
    icon: '⚡',
    duration: '60 min'
  },
  {
    id: 4,
    title: 'Mitigation Strategies',
    description: 'Learn how to reduce and prevent bias in AI applications.',
    icon: '🛡️',
    duration: '50 min'
  },
  {
    id: 5,
    title: 'Ethical AI Development',
    description: 'Best practices for building fair and inclusive AI systems.',
    icon: '⚖️',
    duration: '40 min'
  },
  {
    id: 6,
    title: 'Case Studies',
    description: 'Real-world examples of bias in AI and lessons learned.',
    icon: '📊',
    duration: '35 min'
  }
]

const researchPapers = [
  {
    title: 'Fairness and Machine Learning',
    authors: 'Barocas, Hardt, Narayanan'
  },
  {
    title: 'The Ethical Algorithm',
    authors: 'Kearns, Roth'
  },
  {
    title: 'Weapons of Math Destruction',
    authors: 'Cathy O\'Neil'
  }
]

const videoTutorials = [
  {
    title: 'Introduction to AI Bias',
    duration: '15 min'
  },
  {
    title: 'Bias in Natural Language Processing',
    duration: '25 min'
  },
  {
    title: 'Building Fair AI Systems',
    duration: '30 min'
  }
]
</script>
