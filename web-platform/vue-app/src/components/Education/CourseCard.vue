<template>
  <div 
    class="course-card bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105"
    :class="{ 'border-2 border-trust-blue dark:border-trust-teal': isInProgress }"
  >
    <!-- Course Image -->
    <div class="relative h-48">
      <img 
        :src="course.image" 
        :alt="course.title"
        class="w-full h-full object-cover"
      >
      <div 
        v-if="isInProgress"
        class="absolute top-4 right-4 bg-trust-blue dark:bg-trust-teal text-white px-3 py-1 rounded-full text-sm"
      >
        In Progress
      </div>
    </div>

    <!-- Course Content -->
    <div class="p-6">
      <div class="flex items-center justify-between mb-2">
        <span 
          class="text-sm font-medium px-2 py-1 rounded-full"
          :class="[
            course.level === 'Beginner' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : course.level === 'Intermediate'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          ]"
        >
          {{ course.level }}
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ course.duration }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ course.title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ course.description }}
      </p>

      <!-- Progress Bar -->
      <div v-if="isInProgress" class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Progress
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

      <!-- Action Button -->
      <button 
        @click="navigateToCourse"
        class="w-full btn-primary"
      >
        {{ isInProgress ? 'Continue Learning' : 'Start Learning' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const courseStore = useCourseStore()

const progress = computed(() => courseStore.getCourseProgress(props.course.id))
const isInProgress = computed(() => progress.value.percentage > 0)

function navigateToCourse() {
  router.push(`/education/${props.course.id}`)
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-trust-blue text-white rounded-md hover:bg-trust-blue-dark focus:outline-none focus:ring-2 focus:ring-trust-blue focus:ring-offset-2 dark:bg-trust-teal dark:hover:bg-trust-teal-dark dark:focus:ring-trust-teal disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 