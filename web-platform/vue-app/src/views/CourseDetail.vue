<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Course Header -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <button 
          @click="router.back()"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back to Education Hub
        </button>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Progress: {{ progress }}%
          </span>
          <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              class="h-full bg-trust-blue dark:bg-trust-teal rounded-full"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ course.title }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        {{ course.description }}
      </p>
    </div>

    <!-- Course Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Lesson List -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Lessons
          </h2>
          <div class="space-y-4">
            <div 
              v-for="(lesson, index) in course.lessons" 
              :key="lesson.id"
              class="p-4 rounded-lg cursor-pointer"
              :class="{
                'bg-gray-50 dark:bg-gray-700': currentLessonIndex === index,
                'hover:bg-gray-50 dark:hover:bg-gray-700': currentLessonIndex !== index
              }"
              @click="selectLesson(index)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ lesson.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ lesson.duration }}
                  </p>
                </div>
                <div class="flex items-center">
                  <span 
                    v-if="lesson.completed"
                    class="text-green-500"
                  >
                    ✓
                  </span>
                  <span 
                    v-else-if="lesson.locked"
                    class="text-gray-400"
                  >
                    🔒
                  </span>
                  <span 
                    v-else
                    class="text-trust-blue dark:text-trust-teal"
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lesson Content -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div v-if="currentLesson">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {{ currentLesson.title }}
              </h2>
              <div class="prose dark:prose-invert max-w-none">
                <div v-html="currentLesson.content"></div>
              </div>
            </div>

            <!-- Interactive Elements -->
            <div class="space-y-8">
              <!-- Quiz -->
              <div v-if="currentLesson.quiz" class="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Knowledge Check
                </h3>
                <div class="space-y-4">
                  <div 
                    v-for="(question, qIndex) in currentLesson.quiz" 
                    :key="qIndex"
                    class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p class="font-medium text-gray-900 dark:text-white mb-4">
                      {{ question.text }}
                    </p>
                    <div class="space-y-2">
                      <label 
                        v-for="option in question.options" 
                        :key="option.id"
                        class="flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <input 
                          type="radio"
                          :name="`question-${qIndex}`"
                          :value="option.id"
                          v-model="quizAnswers[qIndex]"
                          class="mr-3"
                        >
                        <span class="text-neutral-700 dark:text-gray-300">
                          {{ option.text }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Exercise -->
              <div v-if="currentLesson.exercise" class="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Practice Exercise
                </h3>
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-neutral-700 dark:text-gray-300 mb-4">
                    {{ currentLesson.exercise.instructions }}
                  </p>
                  <textarea 
                    v-model="exerciseAnswer"
                    rows="4"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Type your answer here..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button 
                v-if="currentLessonIndex > 0"
                @click="previousLesson"
                class="btn-secondary"
              >
                Previous Lesson
              </button>
              <button 
                v-if="currentLessonIndex < course.lessons.length - 1"
                @click="nextLesson"
                class="btn-primary ml-auto"
                :disabled="!canProceed"
              >
                Next Lesson
              </button>
              <button 
                v-else
                @click="completeCourse"
                class="btn-primary ml-auto"
                :disabled="!canProceed"
              >
                Complete Course
              </button>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-400">
              Select a lesson to begin
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Mock course data - in a real app, this would come from an API
const course = ref({
  id: 1,
  title: 'Understanding Bias',
  description: 'Learn about different types of bias and how they manifest in content.',
  lessons: [
    {
      id: 1,
      title: 'Introduction to Bias',
      duration: '15 min',
      content: `
        <h3>What is Bias?</h3>
        <p>Bias refers to a tendency, inclination, or prejudice toward or against something or someone. In the context of content and media, bias can manifest in various ways, affecting how information is presented and interpreted.</p>
        
        <h3>Types of Bias</h3>
        <ul>
          <li>Confirmation Bias: The tendency to search for or interpret information in a way that confirms one's preexisting beliefs.</li>
          <li>Selection Bias: The bias introduced by the selection of individuals, groups, or data for analysis in such a way that proper randomization is not achieved.</li>
          <li>Reporting Bias: The tendency to report only positive or significant results, while ignoring negative or non-significant findings.</li>
        </ul>
      `,
      quiz: [
        {
          text: 'What is the main characteristic of confirmation bias?',
          options: [
            { id: 'a', text: 'Seeking information that confirms existing beliefs' },
            { id: 'b', text: 'Avoiding all forms of bias' },
            { id: 'c', text: 'Being completely neutral' },
            { id: 'd', text: 'Following popular opinion' }
          ]
        }
      ],
      exercise: {
        instructions: 'Think about a recent news article you read. Identify any potential biases in how the information was presented.'
      }
    },
    {
      id: 2,
      title: 'Types of Bias',
      duration: '20 min',
      content: `
        <h3>Common Types of Bias in Media</h3>
        <p>Media bias can take many forms, from subtle to overt. Understanding these types helps us become more critical consumers of information.</p>
        
        <h3>Political Bias</h3>
        <p>Political bias occurs when media outlets favor particular political parties, ideologies, or viewpoints in their reporting.</p>
        
        <h3>Cultural Bias</h3>
        <p>Cultural bias involves favoring or disfavoring certain cultural groups, often based on stereotypes or assumptions.</p>
      `,
      quiz: [
        {
          text: 'Which of the following is an example of political bias?',
          options: [
            { id: 'a', text: 'Using neutral language in reporting' },
            { id: 'b', text: 'Favoring one political party in coverage' },
            { id: 'c', text: 'Reporting facts without commentary' },
            { id: 'd', text: 'Including diverse viewpoints' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Impact of Bias',
      duration: '25 min',
      content: `
        <h3>How Bias Affects Society</h3>
        <p>Bias in media and content can have far-reaching effects on society, influencing public opinion and decision-making.</p>
        
        <h3>Social Impact</h3>
        <p>Media bias can reinforce stereotypes, create division, and influence public perception of important issues.</p>
        
        <h3>Individual Impact</h3>
        <p>On a personal level, bias can affect how we make decisions and interact with others.</p>
      `,
      exercise: {
        instructions: 'Reflect on how media bias has influenced your understanding of a current event. How might different perspectives have changed your view?'
      }
    }
  ]
})

const currentLessonIndex = ref(0)
const quizAnswers = ref([])
const exerciseAnswer = ref('')
const completedLessons = ref(new Set())

const currentLesson = computed(() => 
  course.value.lessons[currentLessonIndex.value]
)

const progress = computed(() => {
  const totalLessons = course.value.lessons.length
  const completed = completedLessons.value.size
  return Math.round((completed / totalLessons) * 100)
})

const canProceed = computed(() => {
  if (!currentLesson.value) return false
  
  // Check if quiz is completed
  if (currentLesson.value.quiz) {
    const allQuestionsAnswered = currentLesson.value.quiz.every(
      (_, index) => quizAnswers.value[index]
    )
    if (!allQuestionsAnswered) return false
  }
  
  // Check if exercise is completed
  if (currentLesson.value.exercise && !exerciseAnswer.value.trim()) {
    return false
  }
  
  return true
})

function selectLesson(index) {
  if (index === 0 || completedLessons.value.has(course.value.lessons[index - 1].id)) {
    currentLessonIndex.value = index
    quizAnswers.value = []
    exerciseAnswer.value = ''
  }
}

function previousLesson() {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--
    quizAnswers.value = []
    exerciseAnswer.value = ''
  }
}

function nextLesson() {
  if (currentLessonIndex.value < course.value.lessons.length - 1) {
    completedLessons.value.add(currentLesson.value.id)
    currentLessonIndex.value++
    quizAnswers.value = []
    exerciseAnswer.value = ''
  }
}

function completeCourse() {
  completedLessons.value.add(currentLesson.value.id)
  // TODO: Implement course completion logic
  router.push('/education')
}

onMounted(() => {
  // TODO: Load course data and progress from API
  const courseId = parseInt(route.params.id)
  // In a real app, fetch course data and user progress here
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-trust-blue text-white rounded-md hover:bg-trust-blue-dark focus:outline-none focus:ring-2 focus:ring-trust-blue focus:ring-offset-2 dark:bg-trust-teal dark:hover:bg-trust-teal-dark dark:focus:ring-trust-teal disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-neutral-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}
</style> 