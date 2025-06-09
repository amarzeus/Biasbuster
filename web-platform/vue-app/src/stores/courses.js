import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCourseStore = defineStore('courses', () => {
  // State
  const courses = ref([
    {
      id: 'bias-basics',
      title: 'Understanding Bias',
      description: 'Learn the fundamentals of bias, its types, and how it affects our daily lives.',
      level: 'Beginner',
      duration: '2 hours',
      lessons: [
        {
          id: 'what-is-bias',
          title: 'What is Bias?',
          content: `
            Bias is a tendency to lean in a certain direction, either in favor of or against a particular thing. 
            It can be conscious or unconscious, and it affects how we perceive and interact with the world around us.
            
            ## Types of Bias
            
            1. **Cognitive Bias**: Systematic patterns of deviation from norm or rationality in judgment
            2. **Confirmation Bias**: Tendency to search for or interpret information in a way that confirms one's preexisting beliefs
            3. **Implicit Bias**: Attitudes or stereotypes that affect our understanding, actions, and decisions in an unconscious manner
            
            ## Why Understanding Bias Matters
            
            Understanding bias is crucial because:
            - It helps us make more informed decisions
            - It enables us to recognize and challenge our own biases
            - It promotes fair and equitable treatment of others
            - It improves our ability to communicate effectively
          `,
          quiz: {
            questions: [
              {
                id: 1,
                question: 'What is the main characteristic of implicit bias?',
                options: [
                  'It is always intentional',
                  'It operates unconsciously',
                  'It only affects certain groups',
                  'It can be easily eliminated'
                ],
                correctAnswer: 1
              },
              {
                id: 2,
                question: 'Which type of bias involves seeking information that confirms our existing beliefs?',
                options: [
                  'Cognitive Bias',
                  'Confirmation Bias',
                  'Implicit Bias',
                  'Selection Bias'
                ],
                correctAnswer: 1
              }
            ]
          }
        },
        {
          id: 'media-bias',
          title: 'Media Bias and Its Impact',
          content: `
            Media bias refers to the bias of journalists and news producers in the selection of events and stories that are reported and how they are covered.
            
            ## Common Types of Media Bias
            
            1. **Selection Bias**: Choosing which stories to cover
            2. **Framing Bias**: How stories are presented
            3. **Statement Bias**: How quotes and statements are used
            4. **Source Bias**: Which sources are chosen for stories
            
            ## Impact on Society
            
            Media bias can:
            - Shape public opinion
            - Influence political decisions
            - Create echo chambers
            - Affect social relationships
            
            ## How to Identify Media Bias
            
            1. Check multiple sources
            2. Look for loaded language
            3. Consider the source's perspective
            4. Analyze the story's framing
          `,
          quiz: {
            questions: [
              {
                id: 1,
                question: 'What is the primary way to identify media bias?',
                options: [
                  'Only read one news source',
                  'Check multiple sources',
                  'Ignore the source',
                  'Focus on headlines only'
                ],
                correctAnswer: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 'ai-bias',
      title: 'AI and Bias',
      description: 'Explore how artificial intelligence can perpetuate or amplify bias, and learn how to address it.',
      level: 'Intermediate',
      duration: '3 hours',
      lessons: [
        {
          id: 'ai-bias-intro',
          title: 'Introduction to AI Bias',
          content: `
            AI bias occurs when an algorithm produces results that are systematically prejudiced due to erroneous assumptions in the machine learning process.
            
            ## Sources of AI Bias
            
            1. **Training Data Bias**: Biases present in the data used to train AI models
            2. **Algorithmic Bias**: Biases introduced by the design of the algorithm
            3. **User Interaction Bias**: Biases that emerge from how users interact with AI systems
            
            ## Impact of AI Bias
            
            AI bias can:
            - Reinforce existing social inequalities
            - Discriminate against certain groups
            - Lead to unfair decision-making
            - Create feedback loops of bias
            
            ## Mitigating AI Bias
            
            1. Diverse training data
            2. Regular bias audits
            3. Transparent algorithms
            4. Human oversight
          `,
          quiz: {
            questions: [
              {
                id: 1,
                question: 'What is the primary source of AI bias?',
                options: [
                  'Computer hardware',
                  'Training data',
                  'User interface',
                  'Internet connection'
                ],
                correctAnswer: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 'bias-detection',
      title: 'Bias Detection Techniques',
      description: 'Learn practical techniques for identifying and analyzing bias in various contexts.',
      level: 'Advanced',
      duration: '4 hours',
      lessons: [
        {
          id: 'text-analysis',
          title: 'Text Analysis for Bias Detection',
          content: `
            Text analysis is a powerful tool for detecting bias in written content.
            
            ## Key Indicators of Bias
            
            1. **Language Patterns**
               - Loaded words
               - Emotional language
               - Stereotypical descriptions
            
            2. **Structural Elements**
               - Story placement
               - Source selection
               - Quote usage
            
            3. **Content Analysis**
               - Topic coverage
               - Perspective balance
               - Context provision
            
            ## Analysis Techniques
            
            1. **Word Choice Analysis**
               - Identify loaded terms
               - Track emotional language
               - Note descriptive patterns
            
            2. **Structural Analysis**
               - Examine story organization
               - Analyze source diversity
               - Evaluate quote selection
            
            3. **Content Balance**
               - Check topic coverage
               - Assess perspective diversity
               - Verify context adequacy
          `,
          quiz: {
            questions: [
              {
                id: 1,
                question: 'Which of these is NOT a key indicator of bias in text?',
                options: [
                  'Loaded words',
                  'Font size',
                  'Emotional language',
                  'Stereotypical descriptions'
                ],
                correctAnswer: 1
              }
            ]
          }
        }
      ]
    }
  ])

  const userProgress = ref({})
  const currentCourse = ref(null)
  const currentLesson = ref(null)

  // Getters
  const getCourseById = computed(() => {
    return (courseId) => courses.value.find(course => course.id === courseId)
  })

  const getLessonById = computed(() => {
    return (courseId, lessonId) => {
      const course = getCourseById.value(courseId)
      return course?.lessons.find(lesson => lesson.id === lessonId)
    }
  })

  const getCourseProgress = computed(() => {
    return (courseId) => {
      const progress = userProgress.value[courseId] || { completedLessons: [] }
      const course = getCourseById.value(courseId)
      return {
        completed: progress.completedLessons.length,
        total: course?.lessons.length || 0,
        percentage: course ? (progress.completedLessons.length / course.lessons.length) * 100 : 0
      }
    }
  })

  // Actions
  function setCurrentCourse(courseId) {
    currentCourse.value = getCourseById.value(courseId)
  }

  function setCurrentLesson(lessonId) {
    if (currentCourse.value) {
      currentLesson.value = getLessonById.value(currentCourse.value.id, lessonId)
    }
  }

  function completeLesson(courseId, lessonId) {
    if (!userProgress.value[courseId]) {
      userProgress.value[courseId] = { completedLessons: [] }
    }
    if (!userProgress.value[courseId].completedLessons.includes(lessonId)) {
      userProgress.value[courseId].completedLessons.push(lessonId)
    }
  }

  function submitQuizAnswer(courseId, lessonId, questionId, answer) {
    const lesson = getLessonById.value(courseId, lessonId)
    const question = lesson?.quiz.questions.find(q => q.id === questionId)
    return question?.correctAnswer === answer
  }

  return {
    courses,
    userProgress,
    currentCourse,
    currentLesson,
    getCourseById,
    getLessonById,
    getCourseProgress,
    setCurrentCourse,
    setCurrentLesson,
    completeLesson,
    submitQuizAnswer
  }
}) 