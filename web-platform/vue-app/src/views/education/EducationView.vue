<template>
  <div class="education-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Education Hub</h1>
        <p class="subtitle">Learn to identify and understand bias through interactive lessons and exercises.</p>
      </div>
    </section>

    <!-- Progress Overview -->
    <section class="progress-section">
      <div class="container">
        <div class="progress-cards">
          <div class="progress-card">
            <div class="progress-circle">
              <Progress
                :value="userProgress.completedLessons"
                :max="userProgress.totalLessons"
                size="lg"
                show-value
              />
            </div>
            <h3>Lessons Completed</h3>
            <p>{{ userProgress.completedLessons }} of {{ userProgress.totalLessons }}</p>
          </div>
          <div class="progress-card">
            <div class="progress-circle">
              <Progress
                :value="userProgress.quizScore"
                :max="100"
                size="lg"
                show-value
                variant="success"
              />
            </div>
            <h3>Average Quiz Score</h3>
            <p>{{ userProgress.quizScore }}%</p>
          </div>
          <div class="progress-card">
            <div class="progress-circle">
              <Progress
                :value="userProgress.certificationProgress"
                :max="100"
                size="lg"
                show-value
                variant="warning"
              />
            </div>
            <h3>Certification Progress</h3>
            <p>{{ userProgress.certificationProgress }}%</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Course Catalog -->
    <section class="courses-section">
      <div class="container">
        <h2>Available Courses</h2>
        <div class="courses-grid">
          <div
            v-for="course in courses"
            :key="course.id"
            class="course-card"
            :class="{ 'completed': course.completed }"
          >
            <div class="course-header">
              <i :class="course.icon"></i>
              <Badge :variant="course.level">{{ course.level }}</Badge>
            </div>
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="course-meta">
              <span>
                <i class="icon-clock"></i>
                {{ course.duration }}
              </span>
              <span>
                <i class="icon-lesson"></i>
                {{ course.lessons }} lessons
              </span>
            </div>
            <Button
              :variant="course.completed ? 'success' : 'primary'"
              :disabled="!course.available"
              @click="startCourse(course)"
            >
              {{ course.completed ? 'Review Course' : 'Start Course' }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Exercises -->
    <section class="exercises-section">
      <div class="container">
        <h2>Practice Exercises</h2>
        <div class="exercises-grid">
          <div
            v-for="exercise in exercises"
            :key="exercise.id"
            class="exercise-card"
          >
            <div class="exercise-header">
              <h3>{{ exercise.title }}</h3>
              <Badge :variant="exercise.difficulty">
                {{ exercise.difficulty }}
              </Badge>
            </div>
            <p>{{ exercise.description }}</p>
            <div class="exercise-actions">
              <Button
                variant="outline"
                @click="startExercise(exercise)"
              >
                Start Exercise
              </Button>
              <Button
                variant="text"
                @click="viewSolution(exercise)"
              >
                View Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources -->
    <section class="resources-section">
      <div class="container">
        <h2>Learning Resources</h2>
        <div class="resources-grid">
          <div
            v-for="resource in resources"
            :key="resource.id"
            class="resource-card"
          >
            <div class="resource-icon">
              <i :class="resource.icon"></i>
            </div>
            <h3>{{ resource.title }}</h3>
            <p>{{ resource.description }}</p>
            <Button
              variant="text"
              @click="accessResource(resource)"
            >
              Access Resource
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Certification -->
    <section class="certification-section">
      <div class="container">
        <div class="certification-content">
          <div class="certification-text">
            <h2>Get Certified</h2>
            <p>Complete our comprehensive bias detection certification program and showcase your expertise.</p>
            <ul class="certification-benefits">
              <li>
                <i class="icon-check"></i>
                <span>Comprehensive assessment</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Industry-recognized certificate</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Professional profile badge</span>
              </li>
              <li>
                <i class="icon-check"></i>
                <span>Access to advanced features</span>
              </li>
            </ul>
            <Button
              variant="primary"
              size="lg"
              @click="startCertification"
            >
              Start Certification
            </Button>
          </div>
          <div class="certification-image">
            <img src="@/assets/images/certification-badge.png" alt="Biasbuster Certification" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Button from '@/components/Common/Button.vue'
import Progress from '@/components/Common/Progress.vue'
import Badge from '@/components/Common/Badge.vue'

const router = useRouter()

const userProgress = ref({
  completedLessons: 12,
  totalLessons: 24,
  quizScore: 85,
  certificationProgress: 60
})

const courses = ref([
  {
    id: 1,
    title: 'Introduction to Bias Detection',
    description: 'Learn the fundamentals of identifying bias in digital content.',
    icon: 'icon-book',
    level: 'beginner',
    duration: '2 hours',
    lessons: 6,
    completed: true,
    available: true
  },
  {
    id: 2,
    title: 'Advanced Bias Analysis',
    description: 'Master advanced techniques for detecting subtle forms of bias.',
    icon: 'icon-magnifier',
    level: 'intermediate',
    duration: '4 hours',
    lessons: 8,
    completed: false,
    available: true
  },
  {
    id: 3,
    title: 'Bias in AI Systems',
    description: 'Understand how bias manifests in artificial intelligence systems.',
    icon: 'icon-ai',
    level: 'advanced',
    duration: '6 hours',
    lessons: 10,
    completed: false,
    available: false
  }
])

const exercises = ref([
  {
    id: 1,
    title: 'News Article Analysis',
    description: 'Practice identifying bias in real news articles.',
    difficulty: 'intermediate'
  },
  {
    id: 2,
    title: 'Social Media Content',
    description: 'Learn to spot bias in social media posts and comments.',
    difficulty: 'beginner'
  },
  {
    id: 3,
    title: 'Academic Writing',
    description: 'Analyze bias in academic papers and research articles.',
    difficulty: 'advanced'
  }
])

const resources = ref([
  {
    id: 1,
    title: 'Bias Detection Guide',
    description: 'Comprehensive guide to different types of bias and detection methods.',
    icon: 'icon-guide'
  },
  {
    id: 2,
    title: 'Case Studies',
    description: 'Real-world examples of bias detection and mitigation.',
    icon: 'icon-case'
  },
  {
    id: 3,
    title: 'Research Papers',
    description: 'Academic research on bias detection and AI fairness.',
    icon: 'icon-research'
  }
])

const startCourse = (course: any) => {
  router.push(`/education/course/${course.id}`)
}

const startExercise = (exercise: any) => {
  router.push(`/education/exercise/${exercise.id}`)
}

const viewSolution = (exercise: any) => {
  router.push(`/education/exercise/${exercise.id}/solution`)
}

const accessResource = (resource: any) => {
  router.push(`/education/resource/${resource.id}`)
}

const startCertification = () => {
  router.push('/education/certification')
}

useHead({
  title: 'Education Hub - Biasbuster',
  meta: [
    {
      name: 'description',
      content: 'Learn to identify and understand bias through interactive lessons, exercises, and resources in the Biasbuster Education Hub.'
    }
  ]
})
</script>

<style scoped>
.education-view {
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

.progress-section {
  @apply py-12 bg-gray-50 dark:bg-gray-800;
}

.progress-cards {
  @apply grid md:grid-cols-3 gap-8;
}

.progress-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.progress-circle {
  @apply w-32 h-32 mx-auto mb-4;
}

.progress-card h3 {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.courses-section,
.exercises-section,
.resources-section {
  @apply py-20;
}

.courses-grid {
  @apply grid md:grid-cols-3 gap-8 mt-12;
}

.course-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.course-header {
  @apply flex items-center justify-between mb-4;
}

.course-header i {
  @apply text-3xl text-blue-600 dark:text-blue-400;
}

.course-card h3 {
  @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
}

.course-meta {
  @apply flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4;
}

.exercises-grid {
  @apply grid md:grid-cols-2 gap-8 mt-12;
}

.exercise-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md;
}

.exercise-header {
  @apply flex items-center justify-between mb-4;
}

.exercise-actions {
  @apply flex justify-between mt-4;
}

.resources-grid {
  @apply grid md:grid-cols-3 gap-8 mt-12;
}

.resource-card {
  @apply p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center;
}

.resource-icon {
  @apply w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400;
}

.resource-icon i {
  @apply text-4xl;
}

.certification-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800;
}

.certification-content {
  @apply flex flex-col md:flex-row items-center gap-12;
}

.certification-text {
  @apply flex-1;
}

.certification-text h2 {
  @apply text-3xl font-bold mb-6 text-gray-900 dark:text-white;
}

.certification-benefits {
  @apply space-y-4 mb-8;
}

.certification-benefits li {
  @apply flex items-center gap-3 text-gray-700 dark:text-gray-200;
}

.certification-benefits i {
  @apply text-green-500;
}

.certification-image {
  @apply flex-1;
}

.certification-image img {
  @apply max-w-md mx-auto;
}

@media (max-width: 768px) {
  .certification-content {
    @apply text-center;
  }
  
  .certification-benefits {
    @apply inline-block text-left;
  }
}
</style> 