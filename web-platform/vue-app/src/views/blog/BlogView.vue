<template>
  <div class="blog-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Blog & News</h1>
        <p class="subtitle">Stay updated with the latest insights on bias detection, AI fairness, and digital literacy.</p>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="featured-section" v-if="featuredArticle">
      <div class="container">
        <div class="featured-article">
          <div class="featured-image">
            <img :src="featuredArticle.image" :alt="featuredArticle.title" />
          </div>
          <div class="featured-content">
            <Badge variant="primary">Featured</Badge>
            <h2>{{ featuredArticle.title }}</h2>
            <p class="meta">
              <span class="author">
                <img :src="featuredArticle.author.avatar" :alt="featuredArticle.author.name" />
                {{ featuredArticle.author.name }}
              </span>
              <span class="date">{{ featuredArticle.date }}</span>
              <span class="category">{{ featuredArticle.category }}</span>
            </p>
            <p class="excerpt">{{ featuredArticle.excerpt }}</p>
            <Button variant="primary" @click="readArticle(featuredArticle)">
              Read More
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="categories-tabs">
          <Button
            v-for="category in categories"
            :key="category.id"
            :variant="activeCategory === category.id ? 'primary' : 'outline'"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="articles-section">
      <div class="container">
        <div class="articles-grid">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
          >
            <div class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-content">
              <Badge :variant="article.category === 'Case Study' ? 'success' : 'info'">
                {{ article.category }}
              </Badge>
              <h3>{{ article.title }}</h3>
              <p class="meta">
                <span class="author">
                  <img :src="article.author.avatar" :alt="article.author.name" />
                  {{ article.author.name }}
                </span>
                <span class="date">{{ article.date }}</span>
              </p>
              <p class="excerpt">{{ article.excerpt }}</p>
              <Button variant="text" @click="readArticle(article)">
                Read More
              </Button>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <Button
            variant="outline"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </Button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <Button
            variant="outline"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </Button>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest articles and updates.</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <div class="form-group">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'
import Badge from '@/components/Common/Badge.vue'

const router = useRouter()
const activeCategory = ref('all')
const currentPage = ref(1)
const email = ref('')

const categories = [
  { id: 'all', name: 'All' },
  { id: 'case-studies', name: 'Case Studies' },
  { id: 'updates', name: 'Updates' },
  { id: 'research', name: 'Research' },
  { id: 'tutorials', name: 'Tutorials' }
]

const featuredArticle = ref({
  id: 1,
  title: 'Understanding AI Bias: A Comprehensive Guide',
  excerpt: 'Learn about the different types of bias in AI systems and how to detect and mitigate them effectively.',
  image: '/images/blog/featured-article.jpg',
  date: 'March 15, 2024',
  category: 'Research',
  author: {
    name: 'Dr. Sarah Johnson',
    avatar: '/images/team/sarah.jpg'
  }
})

const articles = ref([
  {
    id: 2,
    title: 'Case Study: Bias Detection in News Media',
    excerpt: 'How Biasbuster helped a major news outlet identify and address bias in their reporting.',
    image: '/images/blog/case-study-1.jpg',
    date: 'March 10, 2024',
    category: 'Case Study',
    author: {
      name: 'Michael Chen',
      avatar: '/images/team/michael.jpg'
    }
  },
  {
    id: 3,
    title: 'New Features: Enhanced Bias Detection',
    excerpt: 'Introducing our latest improvements to the bias detection algorithm.',
    image: '/images/blog/update-1.jpg',
    date: 'March 5, 2024',
    category: 'Updates',
    author: {
      name: 'Emily Rodriguez',
      avatar: '/images/team/emily.jpg'
    }
  },
  // Add more articles...
])

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') {
    return articles.value
  }
  return articles.value.filter(article => 
    article.category.toLowerCase() === activeCategory.value
  )
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / 6))

const readArticle = (article: any) => {
  router.push(`/blog/${article.id}`)
}

const subscribeNewsletter = async () => {
  try {
    // TODO: Implement newsletter subscription
    console.log('Subscribing email:', email.value)
    email.value = ''
  } catch (error) {
    console.error('Newsletter subscription failed:', error)
  }
}

useHead({
  title: 'Blog & News - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Stay updated with the latest insights on bias detection, AI fairness, and digital literacy from the Biasbuster team.'
    }
  ]
})
</script>

<style scoped>
.blog-view {
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

.featured-section {
  @apply py-12;
}

.featured-article {
  @apply grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden;
}

.featured-image {
  @apply h-64 md:h-full;
}

.featured-image img {
  @apply w-full h-full object-cover;
}

.featured-content {
  @apply p-6;
}

.featured-content h2 {
  @apply text-2xl font-bold mb-4 text-gray-900 dark:text-white;
}

.meta {
  @apply flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4;
}

.author {
  @apply flex items-center gap-2;
}

.author img {
  @apply w-6 h-6 rounded-full;
}

.excerpt {
  @apply text-gray-600 dark:text-gray-300 mb-6;
}

.categories-section {
  @apply py-8 bg-gray-50 dark:bg-gray-800;
}

.categories-tabs {
  @apply flex flex-wrap gap-4 justify-center;
}

.articles-section {
  @apply py-20;
}

.articles-grid {
  @apply grid md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.article-card {
  @apply bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden;
}

.article-image {
  @apply h-48;
}

.article-image img {
  @apply w-full h-full object-cover;
}

.article-content {
  @apply p-6;
}

.article-content h3 {
  @apply text-xl font-semibold mb-4 text-gray-900 dark:text-white;
}

.pagination {
  @apply flex items-center justify-center gap-4 mt-12;
}

.page-info {
  @apply text-gray-600 dark:text-gray-300;
}

.newsletter-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800;
}

.newsletter-content {
  @apply max-w-2xl mx-auto text-center;
}

.newsletter-content h2 {
  @apply text-3xl font-bold mb-4 text-gray-900 dark:text-white;
}

.newsletter-form {
  @apply mt-8;
}

.form-group {
  @apply flex gap-4;
}

.form-group input {
  @apply flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

@media (max-width: 768px) {
  .form-group {
    @apply flex-col;
  }
}
</style> 