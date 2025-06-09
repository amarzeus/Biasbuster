<template>
  <div class="course-content">
    <!-- Course Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ course?.title }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        {{ course?.description }}
      </p>
      <div class="flex items-center space-x-4 mt-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Level: {{ course?.level }}
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Duration: {{ course?.duration }}
        </span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Course Progress
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ progress.percentage.toFixed(0) }}%
        </span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-trust-blue dark:bg-trust-teal h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress.percentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Lesson Navigation -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Lessons
      </h2>
      <div class="space-y-2">
        <button
          v-for="lesson in course?.lessons"
          :key="lesson.id"
          @click="selectLesson(lesson.id)"
          class="w-full flex items-center justify-between p-4 rounded-lg transition-colors"
          :class="[
            currentLesson?.id === lesson.id
              ? 'bg-trust-blue bg-opacity-10 dark:bg-trust-teal dark:bg-opacity-10'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            isLessonCompleted(lesson.id)
              ? 'border-l-4 border-trust-blue dark:border-trust-teal'
              : ''
          ]"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="[
                isLessonCompleted(lesson.id)
                  ? 'bg-trust-blue dark:bg-trust-teal text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              ]"
            >
              <span v-if="isLessonCompleted(lesson.id)">✓</span>
              <span v-else>{{ getLessonNumber(lesson.id) }}</span>
            </div>
            <span class="text-gray-900 dark:text-white">{{ lesson.title }}</span>
          </div>
          <span 
            v-if="isLessonCompleted(lesson.id)"
            class="text-sm text-trust-blue dark:text-trust-teal"
          >
            Completed
          </span>
        </button>
      </div>
    </div>

    <!-- Current Lesson Content -->
    <div v-if="currentLesson" class="lesson-content">
      <div class="prose dark:prose-invert max-w-none">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Quiz Section -->
      <div v-if="currentLesson.quiz" class="mt-8">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quiz
        </h3>
        <div class="space-y-6">
          <div 
            v-for="question in currentLesson.quiz.questions"
            :key="question.id"
            class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <p class="text-gray-900 dark:text-white mb-4">
              {{ question.question }}
            </p>
            <div class="space-y-2">
              <button
                v-for="(option, index) in question.options"
                :key="index"
                @click="submitAnswer(question.id, index)"
                class="w-full text-left p-3 rounded-lg transition-colors"
                :class="[
                  selectedAnswers[question.id] === index
                    ? 'bg-trust-blue bg-opacity-10 dark:bg-trust-teal dark:bg-opacity-10'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                  isAnswerCorrect(question.id, index)
                    ? 'border-2 border-green-500'
                    : isAnswerIncorrect(question.id, index)
                    ? 'border-2 border-red-500'
                    : ''
                ]"
                :disabled="hasAnswered(question.id)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-between">
        <button
          v-if="hasPreviousLesson"
          @click="goToPreviousLesson"
          class="btn-secondary"
        >
          Previous Lesson
        </button>
        <button
          v-if="hasNextLesson"
          @click="goToNextLesson"
          class="btn-primary"
          :disabled="!canProceed"
        >
          Next Lesson
        </button>
        <button
          v-else
          @click="completeCourse"
          class="btn-primary"
          :disabled="!canProceed"
        >
          Complete Course
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCourseStore } from '@/stores/courses'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  }
})

const courseStore = useCourseStore()
const selectedAnswers = ref({})
const quizCompleted = ref(false)

// Computed properties
const course = computed(() => courseStore.currentCourse)
const currentLesson = computed(() => courseStore.currentLesson)
const progress = computed(() => courseStore.getCourseProgress(props.courseId))
const renderedContent = computed(() => {
  if (!currentLesson.value?.content) return ''
  return DOMPurify.sanitize(marked(currentLesson.value.content))
})

const hasPreviousLesson = computed(() => {
  if (!course.value || !currentLesson.value) return false
  const currentIndex = course.value.lessons.findIndex(
    lesson => lesson.id === currentLesson.value.id
  )
  return currentIndex > 0
})

const hasNextLesson = computed(() => {
  if (!course.value || !currentLesson.value) return false
  const currentIndex = course.value.lessons.findIndex(
    lesson => lesson.id === currentLesson.value.id
  )
  return currentIndex < course.value.lessons.length - 1
})

const canProceed = computed(() => {
  if (!currentLesson.value?.quiz) return true
  return quizCompleted.value
})

// Methods
function selectLesson(lessonId) {
  courseStore.setCurrentLesson(lessonId)
  selectedAnswers.value = {}
  quizCompleted.value = false
}

function getLessonNumber(lessonId) {
  return course.value.lessons.findIndex(lesson => lesson.id === lessonId) + 1
}

function isLessonCompleted(lessonId) {
  return courseStore.userProgress[props.courseId]?.completedLessons.includes(lessonId)
}

function submitAnswer(questionId, answerIndex) {
  if (hasAnswered(questionId)) return
  
  selectedAnswers.value[questionId] = answerIndex
  const isCorrect = courseStore.submitQuizAnswer(
    props.courseId,
    currentLesson.value.id,
    questionId,
    answerIndex
  )
  
  if (isCorrect) {
    quizCompleted.value = true
  }
}

function hasAnswered(questionId) {
  return selectedAnswers.value[questionId] !== undefined
}

function isAnswerCorrect(questionId, answerIndex) {
  return (
    hasAnswered(questionId) &&
    selectedAnswers.value[questionId] === answerIndex &&
    courseStore.submitQuizAnswer(
      props.courseId,
      currentLesson.value.id,
      questionId,
      answerIndex
    )
  )
}

function isAnswerIncorrect(questionId, answerIndex) {
  return (
    hasAnswered(questionId) &&
    selectedAnswers.value[questionId] === answerIndex &&
    !courseStore.submitQuizAnswer(
      props.courseId,
      currentLesson.value.id,
      questionId,
      answerIndex
    )
  )
}

function goToPreviousLesson() {
  if (!hasPreviousLesson.value) return
  const currentIndex = course.value.lessons.findIndex(
    lesson => lesson.id === currentLesson.value.id
  )
  selectLesson(course.value.lessons[currentIndex - 1].id)
}

function goToNextLesson() {
  if (!hasNextLesson.value) return
  const currentIndex = course.value.lessons.findIndex(
    lesson => lesson.id === currentLesson.value.id
  )
  selectLesson(course.value.lessons[currentIndex + 1].id)
}

function completeCourse() {
  courseStore.completeLesson(props.courseId, currentLesson.value.id)
}

// Lifecycle hooks
onMounted(() => {
  courseStore.setCurrentCourse(props.courseId)
  if (course.value?.lessons.length > 0) {
    selectLesson(course.value.lessons[0].id)
  }
})

watch(() => props.courseId, (newCourseId) => {
  courseStore.setCurrentCourse(newCourseId)
  if (course.value?.lessons.length > 0) {
    selectLesson(course.value.lessons[0].id)
  }
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-trust-blue text-white rounded-md hover:bg-trust-blue-dark focus:outline-none focus:ring-2 focus:ring-trust-blue focus:ring-offset-2 dark:bg-trust-teal dark:hover:bg-trust-teal-dark dark:focus:ring-trust-teal disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}
</style> 