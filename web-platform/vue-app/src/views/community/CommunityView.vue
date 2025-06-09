<template>
  <div class="community-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Community & Feedback</h1>
        <p class="subtitle">Join our community, share your thoughts, and help shape the future of Biasbuster</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Community Stats -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ stats.members }}</div>
                <div class="stat-label">Community Members</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ stats.discussions }}</div>
                <div class="stat-label">Active Discussions</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ stats.ideas }}</div>
                <div class="stat-label">Feature Ideas</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ stats.contributors }}</div>
                <div class="stat-label">Contributors</div>
              </div>
            </div>
          </div>

          <!-- Feedback Form -->
          <section class="feedback-section">
            <h2>Share Your Feedback</h2>
            <form @submit.prevent="submitFeedback" class="feedback-form">
              <div class="form-group">
                <label for="feedback-type">Feedback Type</label>
                <select
                  id="feedback-type"
                  v-model="feedback.type"
                  required
                >
                  <option value="">Select type</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="feedback-title">Title</label>
                <input
                  id="feedback-title"
                  v-model="feedback.title"
                  type="text"
                  required
                  placeholder="Brief description of your feedback"
                />
              </div>

              <div class="form-group">
                <label for="feedback-description">Description</label>
                <textarea
                  id="feedback-description"
                  v-model="feedback.description"
                  required
                  rows="6"
                  placeholder="Please provide detailed information about your feedback"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="feedback-priority">Priority</label>
                <select
                  id="feedback-priority"
                  v-model="feedback.priority"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                :loading="submitting"
              >
                Submit Feedback
              </Button>
            </form>
          </section>

          <!-- Recent Discussions -->
          <section class="discussions-section">
            <h2>Recent Discussions</h2>
            <div class="discussions-grid">
              <div
                v-for="discussion in discussions"
                :key="discussion.id"
                class="discussion-card"
              >
                <div class="discussion-header">
                  <h3>{{ discussion.title }}</h3>
                  <span class="discussion-category">{{ discussion.category }}</span>
                </div>
                <p class="discussion-excerpt">{{ discussion.excerpt }}</p>
                <div class="discussion-meta">
                  <span class="author">By {{ discussion.author }}</span>
                  <span class="date">{{ discussion.date }}</span>
                  <span class="comments">{{ discussion.comments }} comments</span>
                </div>
                <a :href="discussion.link" class="discussion-link">Read More</a>
              </div>
            </div>
          </section>

          <!-- Feature Ideas -->
          <section class="ideas-section">
            <h2>Feature Ideas</h2>
            <div class="ideas-grid">
              <div
                v-for="idea in ideas"
                :key="idea.id"
                class="idea-card"
              >
                <div class="idea-header">
                  <h3>{{ idea.title }}</h3>
                  <div class="idea-stats">
                    <span class="votes">{{ idea.votes }} votes</span>
                    <span class="status" :class="idea.status">{{ idea.status }}</span>
                  </div>
                </div>
                <p class="idea-description">{{ idea.description }}</p>
                <div class="idea-actions">
                  <button
                    class="vote-button"
                    :class="{ 'voted': idea.hasVoted }"
                    @click="voteIdea(idea.id)"
                  >
                    <i class="icon-thumbs-up"></i>
                    Vote
                  </button>
                  <a :href="idea.link" class="idea-link">View Details</a>
                </div>
              </div>
            </div>
          </section>

          <!-- GitHub Integration -->
          <section class="github-section">
            <h2>Contribute on GitHub</h2>
            <div class="github-card">
              <div class="github-stats">
                <div class="stat">
                  <span class="value">{{ github.stars }}</span>
                  <span class="label">Stars</span>
                </div>
                <div class="stat">
                  <span class="value">{{ github.forks }}</span>
                  <span class="label">Forks</span>
                </div>
                <div class="stat">
                  <span class="value">{{ github.issues }}</span>
                  <span class="label">Open Issues</span>
                </div>
              </div>
              <div class="github-actions">
                <a
                  href="https://github.com/biasbuster"
                  target="_blank"
                  rel="noopener"
                  class="github-button"
                >
                  <i class="icon-github"></i>
                  View on GitHub
                </a>
                <a
                  href="https://github.com/biasbuster/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener"
                  class="contribute-button"
                >
                  How to Contribute
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
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'

const stats = ref({
  members: '10,000+',
  discussions: '2,500+',
  ideas: '1,000+',
  contributors: '500+'
})

const feedback = ref({
  type: '',
  title: '',
  description: '',
  priority: 'medium'
})

const submitting = ref(false)

const discussions = ref([
  {
    id: 1,
    title: 'Improving Bias Detection Accuracy',
    category: 'Discussion',
    excerpt: 'Let\'s discuss ways to enhance our bias detection algorithms...',
    author: 'Jane Smith',
    date: '2 days ago',
    comments: 15,
    link: '/discussions/1'
  },
  {
    id: 2,
    title: 'New Feature: Custom Bias Categories',
    category: 'Feature Request',
    excerpt: 'I think it would be great to allow users to define their own bias categories...',
    author: 'John Doe',
    date: '1 week ago',
    comments: 8,
    link: '/discussions/2'
  }
])

const ideas = ref([
  {
    id: 1,
    title: 'Real-time Collaboration',
    description: 'Allow multiple users to analyze and discuss content together in real-time.',
    votes: 156,
    status: 'planned',
    hasVoted: false,
    link: '/ideas/1'
  },
  {
    id: 2,
    title: 'API Integration',
    description: 'Create a public API for developers to integrate bias detection into their applications.',
    votes: 89,
    status: 'in-progress',
    hasVoted: true,
    link: '/ideas/2'
  }
])

const github = ref({
  stars: '1.2k',
  forks: '350',
  issues: '45'
})

const submitFeedback = async () => {
  submitting.value = true
  try {
    // TODO: Implement feedback submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    feedback.value = {
      type: '',
      title: '',
      description: '',
      priority: 'medium'
    }
    // Show success message
  } catch (error) {
    console.error('Feedback submission failed:', error)
    // Show error message
  } finally {
    submitting.value = false
  }
}

const voteIdea = (ideaId: number) => {
  const idea = ideas.value.find(i => i.id === ideaId)
  if (idea) {
    idea.hasVoted = !idea.hasVoted
    idea.votes += idea.hasVoted ? 1 : -1
  }
}

useHead({
  title: 'Community & Feedback - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Join the Biasbuster community, share your feedback, and help shape the future of bias detection.'
    }
  ]
})
</script>

<style scoped>
.community-view {
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

.stats-section {
  @apply mb-12;
}

.stats-grid {
  @apply grid md:grid-cols-4 gap-6;
}

.stat-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2;
}

.stat-label {
  @apply text-gray-600 dark:text-gray-300;
}

.feedback-section {
  @apply mb-16;
}

.feedback-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.feedback-form {
  @apply max-w-2xl space-y-6;
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

.discussions-section,
.ideas-section {
  @apply mb-16;
}

.discussions-section h2,
.ideas-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.discussions-grid,
.ideas-grid {
  @apply grid md:grid-cols-2 gap-8;
}

.discussion-card,
.idea-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.discussion-header,
.idea-header {
  @apply flex justify-between items-start mb-4;
}

.discussion-header h3,
.idea-header h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.discussion-category {
  @apply px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full;
}

.discussion-excerpt,
.idea-description {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.discussion-meta {
  @apply flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4;
}

.discussion-link,
.idea-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
}

.idea-stats {
  @apply flex gap-4;
}

.idea-stats .status {
  @apply px-3 py-1 text-sm rounded-full;
}

.idea-stats .status.planned {
  @apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200;
}

.idea-stats .status.in-progress {
  @apply bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200;
}

.idea-actions {
  @apply flex justify-between items-center mt-4;
}

.vote-button {
  @apply flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500;
}

.vote-button.voted {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200;
}

.github-section {
  @apply mb-16;
}

.github-section h2 {
  @apply text-2xl font-bold mb-8 text-gray-900 dark:text-white;
}

.github-card {
  @apply p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.github-stats {
  @apply flex justify-center gap-12 mb-8;
}

.github-stats .stat {
  @apply text-center;
}

.github-stats .value {
  @apply block text-3xl font-bold text-gray-900 dark:text-white mb-1;
}

.github-stats .label {
  @apply text-gray-600 dark:text-gray-300;
}

.github-actions {
  @apply flex justify-center gap-4;
}

.github-button,
.contribute-button {
  @apply px-6 py-3 rounded-lg font-medium;
}

.github-button {
  @apply bg-gray-900 text-white hover:bg-gray-800;
}

.contribute-button {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

@media (max-width: 768px) {
  .stats-grid {
    @apply grid-cols-2;
  }
  
  .discussions-grid,
  .ideas-grid {
    @apply grid-cols-1;
  }
  
  .github-stats {
    @apply gap-6;
  }
  
  .github-actions {
    @apply flex-col;
  }
}
</style> 