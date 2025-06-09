import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEducationStore = defineStore('education', () => {
  // State
  const courses = ref([])
  const resources = ref([])
  const userProgress = ref({})
  const bookmarks = ref(new Set())

  // Getters
  const getCourseById = computed(() => {
    return (id) => courses.value.find(course => course.id === id)
  })

  const getResourceById = computed(() => {
    return (id) => resources.value.find(resource => resource.id === id)
  })

  const getCourseProgress = computed(() => {
    return (courseId) => {
      const progress = userProgress.value[courseId] || { completedLessons: new Set() }
      const course = getCourseById.value(courseId)
      if (!course) return 0
      return Math.round((progress.completedLessons.size / course.lessons.length) * 100)
    }
  })

  const isBookmarked = computed(() => {
    return (resourceId) => bookmarks.value.has(resourceId)
  })

  // Actions
  async function fetchCourses() {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/courses')
      const data = await response.json()
      courses.value = data
    } catch (error) {
      console.error('Error fetching courses:', error)
      // For now, use mock data
      courses.value = [
        {
          id: 1,
          title: 'Understanding Bias',
          description: 'Learn about different types of bias and how they manifest in content.',
          lessons: [
            { id: 1, title: 'Introduction to Bias', duration: '15 min' },
            { id: 2, title: 'Types of Bias', duration: '20 min' },
            { id: 3, title: 'Impact of Bias', duration: '25 min' }
          ]
        },
        {
          id: 2,
          title: 'Media Literacy',
          description: 'Develop critical thinking skills to evaluate media content.',
          lessons: [
            { id: 4, title: 'Media Analysis', duration: '20 min' },
            { id: 5, title: 'Fact Checking', duration: '25 min' },
            { id: 6, title: 'Source Evaluation', duration: '30 min' }
          ]
        },
        {
          id: 3,
          title: 'Ethical AI',
          description: 'Explore the intersection of AI and bias detection.',
          lessons: [
            { id: 7, title: 'AI and Bias', duration: '20 min' },
            { id: 8, title: 'Ethical Considerations', duration: '25 min' },
            { id: 9, title: 'Future of AI', duration: '30 min' }
          ]
        }
      ]
    }
  }

  async function fetchResources() {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/resources')
      const data = await response.json()
      resources.value = data
    } catch (error) {
      console.error('Error fetching resources:', error)
      // For now, use mock data
      resources.value = [
        {
          id: 1,
          title: 'Bias Detection Guide',
          description: 'A comprehensive guide to identifying and addressing bias in content.',
          image: '/images/resources/bias-guide.jpg',
          link: '/resources/bias-guide'
        },
        {
          id: 2,
          title: 'Media Literacy Toolkit',
          description: 'Tools and resources for developing media literacy skills.',
          image: '/images/resources/media-toolkit.jpg',
          link: '/resources/media-toolkit'
        },
        {
          id: 3,
          title: 'AI Ethics Handbook',
          description: 'Understanding ethical considerations in AI and bias detection.',
          image: '/images/resources/ai-ethics.jpg',
          link: '/resources/ai-ethics'
        }
      ]
    }
  }

  async function fetchUserProgress() {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/progress')
      const data = await response.json()
      userProgress.value = data
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // For now, use mock data
      userProgress.value = {}
    }
  }

  async function completeLesson(courseId, lessonId) {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST'
      })
      
      if (!userProgress.value[courseId]) {
        userProgress.value[courseId] = { completedLessons: new Set() }
      }
      userProgress.value[courseId].completedLessons.add(lessonId)
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  async function toggleBookmark(resourceId) {
    try {
      const isCurrentlyBookmarked = bookmarks.value.has(resourceId)
      // TODO: Replace with actual API call
      await fetch(`/api/resources/${resourceId}/bookmark`, {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST'
      })
      
      if (isCurrentlyBookmarked) {
        bookmarks.value.delete(resourceId)
      } else {
        bookmarks.value.add(resourceId)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  async function submitExercise(courseId, lessonId, answer) {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer })
      })
    } catch (error) {
      console.error('Error submitting exercise:', error)
    }
  }

  async function submitComment(resourceId, comment) {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/resources/${resourceId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: comment })
      })
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  return {
    // State
    courses,
    resources,
    userProgress,
    bookmarks,
    
    // Getters
    getCourseById,
    getResourceById,
    getCourseProgress,
    isBookmarked,
    
    // Actions
    fetchCourses,
    fetchResources,
    fetchUserProgress,
    completeLesson,
    toggleBookmark,
    submitExercise,
    submitComment
  }
}) 