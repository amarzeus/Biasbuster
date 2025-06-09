<template>
  <div class="education-hub">
    <header class="hub-header">
      <h1>Education Hub</h1>
      <p class="subtitle">Learn about bias detection and inclusive communication</p>
    </header>

    <div class="main-content">
      <nav class="hub-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </nav>

      <div class="content-section">
        <!-- Types of Bias Section -->
        <div v-if="activeTab === 'types'" class="bias-types">
          <div v-for="type in biasTypes" :key="type.id" class="bias-card">
            <h3>{{ type.name }}</h3>
            <p class="description">{{ type.description }}</p>
            <div class="examples">
              <h4>Examples:</h4>
              <ul>
                <li v-for="example in type.examples" :key="example">{{ example }}</li>
              </ul>
            </div>
            <div class="solutions">
              <h4>Solutions:</h4>
              <ul>
                <li v-for="solution in type.solutions" :key="solution">{{ solution }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Best Practices Section -->
        <div v-if="activeTab === 'practices'" class="best-practices">
          <div class="practice-card" v-for="practice in bestPractices" :key="practice.id">
            <h3>{{ practice.title }}</h3>
            <p>{{ practice.description }}</p>
            <div class="tips">
              <h4>Tips:</h4>
              <ul>
                <li v-for="tip in practice.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
            <div class="examples">
              <div class="example-pair">
                <div class="before">
                  <h4>Before:</h4>
                  <p>{{ practice.example.before }}</p>
                </div>
                <div class="after">
                  <h4>After:</h4>
                  <p>{{ practice.example.after }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div v-if="activeTab === 'resources'" class="resources">
          <div class="resource-grid">
            <div v-for="resource in resources" :key="resource.id" class="resource-card">
              <h3>{{ resource.title }}</h3>
              <p>{{ resource.description }}</p>
              <div class="resource-links">
                <a v-for="link in resource.links" 
                   :key="link.url" 
                   :href="link.url" 
                   target="_blank"
                   class="resource-link"
                >
                  {{ link.text }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Quiz Section -->
        <div v-if="activeTab === 'quiz'" class="interactive-quiz">
          <div v-if="!quizCompleted" class="quiz-container">
            <h3>Test Your Knowledge</h3>
            <div class="quiz-header">
              <div class="quiz-progress">
                Question {{ currentQuestion + 1 }} of {{ quizQuestions.length }}
              </div>
              <div class="quiz-timer" :class="{ 'timer-warning': timeRemaining <= 10 }">
                Time: {{ timeRemaining }}s
              </div>
            </div>
            <div class="streak-indicator" v-if="showStreak">
              🔥 {{ streakCount }}x Streak!
            </div>
            <div class="progress-bar" v-if="showProgress">
              <div class="progress-fill" :style="{ width: progressValue + '%' }"></div>
              <span class="progress-text">{{ Math.round(progressValue) }}%</span>
            </div>
            <div class="question-card">
              <p class="question">{{ quizQuestions[currentQuestion].question }}</p>
              <div class="options">
                <button 
                  v-for="option in quizQuestions[currentQuestion].options" 
                  :key="option"
                  :class="['option-btn', { 
                    selected: selectedAnswer === option,
                    correct: showFeedback && option === quizQuestions[currentQuestion].correct,
                    incorrect: showFeedback && selectedAnswer === option && option !== quizQuestions[currentQuestion].correct
                  }]"
                  @click="selectAnswer(option)"
                  :disabled="showFeedback"
                >
                  {{ option }}
                </button>
              </div>
              <div v-if="showFeedback" class="feedback">
                <p :class="feedbackClass">{{ feedbackMessage }}</p>
                <div v-if="showExplanation" class="explanation">
                  <h4>Why?</h4>
                  <p>{{ currentExplanation }}</p>
                </div>
                <button @click="nextQuestion" class="next-btn">
                  {{ isLastQuestion ? 'See Results' : 'Next Question' }}
                </button>
              </div>
            </div>
            <div class="achievement-popup" v-if="showAchievement">
              <div class="achievement-content">
                <h4>🏆 Achievement Unlocked!</h4>
                <p>{{ currentAchievement.title }}</p>
                <p class="achievement-description">{{ currentAchievement.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="quiz-results">
            <h3>Quiz Results</h3>
            <div class="score-display">
              <div class="score-circle">
                <span class="score">{{ score }}</span>
                <span class="total">/{{ quizQuestions.length }}</span>
              </div>
              <p class="score-message">{{ scoreMessage }}</p>
            </div>
            <button @click="resetQuiz" class="retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const activeTab = ref('types')
const quizTimer = ref(null)
const timeRemaining = ref(30)
const showExplanation = ref(false)
const currentExplanation = ref('')
const streakCount = ref(0)
const showStreak = ref(false)

const tabs = [
  { id: 'types', name: 'Types of Bias' },
  { id: 'practices', name: 'Best Practices' },
  { id: 'resources', name: 'Resources' },
  { id: 'quiz', name: 'Interactive Quiz' }
]

const biasTypes = [
  {
    id: 'age',
    name: 'Age Bias',
    description: 'Prejudice or discrimination based on age, often affecting both young and older individuals.',
    examples: [
      'Assuming older people are not tech-savvy',
      'Believing young people lack experience',
      'Using age-related stereotypes in hiring decisions'
    ],
    solutions: [
      'Focus on abilities and experience rather than age',
      'Use inclusive language that does not emphasize age',
      'Consider diverse age groups in decision-making'
    ]
  },
  {
    id: 'gender',
    name: 'Gender Bias',
    description: 'Prejudice or discrimination based on gender, often reinforcing traditional gender roles.',
    examples: [
      'Assuming women are better at caregiving',
      'Believing men are better leaders',
      'Using gender-specific job titles'
    ],
    solutions: [
      'Use gender-neutral language',
      'Challenge traditional gender roles',
      'Promote equal opportunities regardless of gender'
    ]
  },
  {
    id: 'racial',
    name: 'Racial Bias',
    description: 'Prejudice or discrimination based on race or ethnicity.',
    examples: [
      'Using racial stereotypes in descriptions',
      'Making assumptions based on racial background',
      'Excluding certain racial groups from opportunities'
    ],
    solutions: [
      'Focus on individual characteristics',
      'Avoid racial stereotypes',
      'Promote diversity and inclusion'
    ]
  },
  {
    id: 'socioeconomic',
    name: 'Socioeconomic Bias',
    description: 'Prejudice or discrimination based on economic or social status.',
    examples: [
      'Assuming wealth indicates competence',
      'Making assumptions about financial status',
      'Using class-based stereotypes'
    ],
    solutions: [
      'Focus on individual circumstances',
      'Avoid assumptions about economic status',
      'Consider diverse socioeconomic backgrounds'
    ]
  },
  {
    id: 'disability',
    name: 'Disability Bias',
    description: 'Prejudice or discrimination against people with disabilities.',
    examples: [
      'Focusing on limitations rather than abilities',
      'Using ableist language',
      'Making assumptions about capabilities'
    ],
    solutions: [
      'Use person-first language',
      'Focus on abilities and accommodations',
      'Avoid making assumptions about capabilities'
    ]
  },
  {
    id: 'religious',
    name: 'Religious Bias',
    description: 'Prejudice or discrimination based on religious beliefs or practices.',
    examples: [
      'Making assumptions about religious practices',
      'Excluding certain religious groups',
      'Using religious stereotypes'
    ],
    solutions: [
      'Respect religious diversity',
      'Avoid religious stereotypes',
      'Be inclusive of all beliefs'
    ]
  },
  {
    id: 'lgbtq',
    name: 'LGBTQ+ Bias',
    description: 'Prejudice or discrimination against LGBTQ+ individuals.',
    examples: [
      'Using heteronormative language',
      'Making assumptions about gender identity',
      'Excluding LGBTQ+ perspectives'
    ],
    solutions: [
      'Use inclusive language',
      'Respect diverse gender identities',
      'Avoid assumptions about orientation'
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural Bias',
    description: 'Prejudice or discrimination based on cultural background.',
    examples: [
      'Favoring Western cultural norms',
      'Making assumptions about cultural practices',
      'Excluding non-Western perspectives'
    ],
    solutions: [
      'Respect cultural diversity',
      'Avoid cultural stereotypes',
      'Include diverse cultural perspectives'
    ]
  },
  {
    id: 'appearance',
    name: 'Appearance Bias',
    description: 'Prejudice or discrimination based on physical appearance.',
    examples: [
      'Making assumptions based on looks',
      'Using appearance-based stereotypes',
      'Favoring certain physical characteristics'
    ],
    solutions: [
      'Focus on abilities and qualifications',
      'Avoid appearance-based judgments',
      'Promote inclusive beauty standards'
    ]
  }
]

const bestPractices = [
  {
    id: 'inclusive-language',
    title: 'Inclusive Language',
    description: 'Using language that respects and includes all people, regardless of their characteristics.',
    tips: [
      'Use gender-neutral terms when possible',
      'Avoid assumptions about people\'s abilities',
      'Be specific rather than using generalizations'
    ],
    example: {
      before: 'The disabled employee needed special accommodations.',
      after: 'The employee requested reasonable accommodations to perform their job effectively.'
    }
  },
  {
    id: 'person-first-language',
    title: 'Person-First Language',
    description: 'Putting the person before their characteristics or conditions.',
    tips: [
      'Focus on the individual, not their characteristics',
      'Avoid defining people by their conditions',
      'Use respectful and accurate terminology'
    ],
    example: {
      before: 'The autistic student participated in the project.',
      after: 'The student, who is autistic, participated in the project.'
    }
  },
  {
    id: 'cultural-sensitivity',
    title: 'Cultural Sensitivity',
    description: 'Being aware of and respecting cultural differences in communication.',
    tips: [
      'Avoid cultural stereotypes',
      'Be mindful of cultural context',
      'Use culturally appropriate examples'
    ],
    example: {
      before: 'The Asian employee excelled at mathematics.',
      after: 'The employee demonstrated strong analytical skills.'
    }
  },
  {
    id: 'age-inclusive',
    title: 'Age-Inclusive Communication',
    description: 'Communicating without making assumptions based on age.',
    tips: [
      'Focus on abilities and experience',
      'Avoid age-related stereotypes',
      'Use inclusive language for all age groups'
    ],
    example: {
      before: 'The young intern learned from the experienced team.',
      after: 'The team member collaborated effectively with the team.'
    }
  },
  {
    id: 'intersectional',
    title: 'Intersectional Awareness',
    description: 'Recognizing and addressing how different aspects of identity intersect and affect experiences.',
    tips: [
      'Consider multiple aspects of identity',
      'Avoid single-axis analysis',
      'Recognize unique challenges faced by individuals with multiple marginalized identities'
    ],
    example: {
      before: 'The female employee faced challenges in the workplace.',
      after: 'The employee, who identifies as a woman of color, faced unique challenges related to both gender and racial bias in the workplace.'
    }
  },
  {
    id: 'neurodiversity',
    title: 'Neurodiversity-Inclusive Language',
    description: 'Using language that respects and includes neurodivergent individuals.',
    tips: [
      'Avoid pathologizing language',
      'Use person-first language when appropriate',
      'Recognize different communication styles'
    ],
    example: {
      before: 'The autistic employee needed special training.',
      after: 'The employee, who is neurodivergent, received customized training that matched their learning style.'
    }
  },
  {
    id: 'generational',
    title: 'Generational Communication',
    description: 'Effective communication across different generations in the workplace.',
    tips: [
      'Avoid generational stereotypes',
      'Recognize different communication preferences',
      'Value diverse perspectives and experiences'
    ],
    example: {
      before: 'The millennial employee prefers digital communication.',
      after: 'The employee prefers digital communication channels for efficiency.'
    }
  },
  {
    id: 'ability',
    title: 'Ability-Inclusive Language',
    description: 'Using language that respects and includes people of all abilities.',
    tips: [
      'Focus on accessibility needs rather than limitations',
      'Use inclusive terminology',
      'Consider diverse learning and communication styles'
    ],
    example: {
      before: 'The disabled employee needed help with the task.',
      after: 'The employee used assistive technology to complete the task effectively.'
    }
  },
  {
    id: 'cultural-competence',
    title: 'Cultural Competence',
    description: 'Developing awareness and understanding of cultural differences.',
    tips: [
      'Learn about different cultural practices',
      'Avoid cultural assumptions',
      'Respect cultural differences in communication'
    ],
    example: {
      before: 'The foreign employee adapted to our work culture.',
      after: 'The team worked together to create an inclusive work environment that respected diverse cultural backgrounds.'
    }
  }
]

const resources = [
  {
    id: 'guides',
    title: 'Inclusive Language Guides',
    description: 'Comprehensive guides for using inclusive language in various contexts.',
    links: [
      { text: 'Inclusive Language Guide', url: '#' },
      { text: 'Bias Detection Workshop', url: '#' }
    ]
  },
  {
    id: 'templates',
    title: 'Communication Templates',
    description: 'Ready-to-use templates for inclusive communication.',
    links: [
      { text: 'Email Templates', url: '#' },
      { text: 'Document Templates', url: '#' }
    ]
  },
  {
    id: 'training',
    title: 'Training Resources',
    description: 'Interactive training materials for bias awareness.',
    links: [
      { text: 'Bias Awareness Course', url: '#' },
      { text: 'Inclusive Communication Workshop', url: '#' }
    ]
  },
  {
    id: 'tools',
    title: 'Bias Detection Tools',
    description: 'Tools and resources for identifying and addressing bias.',
    links: [
      { text: 'Bias Detection Checklist', url: '#' },
      { text: 'Inclusive Language Tool', url: '#' }
    ]
  },
  {
    id: 'research',
    title: 'Research & Studies',
    description: 'Academic research and studies on bias and inclusive communication.',
    links: [
      { text: 'Bias in AI Systems', url: '#' },
      { text: 'Inclusive Language Research', url: '#' }
    ]
  },
  {
    id: 'community',
    title: 'Community Resources',
    description: 'Community-driven resources and support networks.',
    links: [
      { text: 'Inclusive Language Forum', url: '#' },
      { text: 'Bias Detection Community', url: '#' }
    ]
  },
  {
    id: 'case-studies',
    title: 'Case Studies',
    description: 'Real-world examples of bias detection and resolution.',
    links: [
      { text: 'Corporate Communication Case Studies', url: '#' },
      { text: 'Educational Institution Examples', url: '#' }
    ]
  },
  {
    id: 'interactive-tools',
    title: 'Interactive Tools',
    description: 'Tools and resources for practicing inclusive communication.',
    links: [
      { text: 'Bias Detection Simulator', url: '#' },
      { text: 'Inclusive Language Checker', url: '#' }
    ]
  }
]

const quizQuestions = [
  {
    question: 'Which of the following is an example of age bias?',
    options: [
      'The elderly man struggled with the new technology',
      'The experienced professional led the project',
      'The team member completed the task efficiently',
      'The employee attended the training session'
    ],
    correct: 'The elderly man struggled with the new technology'
  },
  {
    question: 'What is the most inclusive way to refer to a group of people?',
    options: [
      'Ladies and gentlemen',
      'Everyone',
      'Boys and girls',
      'Men and women'
    ],
    correct: 'Everyone'
  },
  {
    question: 'Which statement shows cultural bias?',
    options: [
      'The team collaborated effectively',
      'The Western approach was more efficient',
      'The project was completed on time',
      'The solution met all requirements'
    ],
    correct: 'The Western approach was more efficient'
  },
  {
    question: 'What is the best practice for writing about disabilities?',
    options: [
      'Focus on the disability first',
      'Use person-first language',
      'Avoid mentioning disabilities',
      'Use medical terminology'
    ],
    correct: 'Use person-first language'
  },
  {
    question: 'Which statement demonstrates gender bias?',
    options: [
      'The nurse provided excellent care',
      'The female nurse provided excellent care',
      'The healthcare provider provided excellent care',
      'The medical professional provided excellent care'
    ],
    correct: 'The female nurse provided excellent care'
  },
  {
    question: 'What is the most inclusive way to describe someone\'s role?',
    options: [
      'The working mother balanced her career',
      'The parent balanced their career',
      'The stay-at-home mom managed the household',
      'The career woman led the team'
    ],
    correct: 'The parent balanced their career'
  },
  {
    question: 'Which statement shows socioeconomic bias?',
    options: [
      'The team achieved their goals',
      'The wealthy donor contributed significantly',
      'The project was successful',
      'The collaboration was effective'
    ],
    correct: 'The wealthy donor contributed significantly'
  },
  {
    question: 'What is the best way to describe someone\'s appearance?',
    options: [
      'The attractive candidate',
      'The professional candidate',
      'The beautiful employee',
      'The good-looking team member'
    ],
    correct: 'The professional candidate'
  },
  {
    question: 'Which statement demonstrates religious bias?',
    options: [
      'The team celebrated their success',
      'The Christian employee took a holiday',
      'The project was completed',
      'The collaboration was effective'
    ],
    correct: 'The Christian employee took a holiday'
  },
  {
    question: 'What is the most inclusive way to refer to a person\'s relationship status?',
    options: [
      'The single mother',
      'The parent',
      'The unmarried woman',
      'The divorced employee'
    ],
    correct: 'The parent'
  },
  {
    question: 'Which statement demonstrates intersectional bias?',
    options: [
      'The young employee showed great potential',
      'The Asian woman was hired for her technical skills',
      'The team member completed the project successfully',
      'The employee received a promotion'
    ],
    correct: 'The Asian woman was hired for her technical skills',
    explanation: 'This statement combines racial and gender bias, demonstrating intersectional bias by focusing on both characteristics unnecessarily.'
  },
  {
    question: 'What is the most inclusive way to describe someone\'s communication style?',
    options: [
      'The quiet employee rarely speaks up',
      'The employee prefers written communication',
      'The shy team member needs encouragement',
      'The reserved person should participate more'
    ],
    correct: 'The employee prefers written communication',
    explanation: 'This focuses on the communication preference without making assumptions about personality or behavior.'
  },
  {
    question: 'Which statement best demonstrates cultural competence?',
    options: [
      'The international team adapted to our company culture',
      'The team created an inclusive environment that respected diverse cultural backgrounds',
      'The foreign employees learned our way of doing things',
      'The team members from different countries adjusted to our norms'
    ],
    correct: 'The team created an inclusive environment that respected diverse cultural backgrounds',
    explanation: 'This statement shows cultural competence by focusing on creating an inclusive environment rather than expecting others to adapt to a single culture.'
  },
  {
    question: 'What is the most inclusive way to describe someone\'s work style?',
    options: [
      'The introverted employee works alone',
      'The employee prefers independent work',
      'The quiet team member avoids collaboration',
      'The reserved person works best alone'
    ],
    correct: 'The employee prefers independent work',
    explanation: 'This focuses on the work preference without making assumptions about personality or social behavior.'
  },
  {
    question: 'Which statement shows generational bias?',
    options: [
      'The experienced professional led the project',
      'The digital native quickly learned the new software',
      'The team member completed the task efficiently',
      'The employee demonstrated strong leadership skills'
    ],
    correct: 'The digital native quickly learned the new software',
    explanation: 'This statement makes assumptions about technological ability based on age, which is a form of generational bias.'
  },
  {
    question: 'What is the most inclusive way to describe a team\'s success?',
    options: [
      'The diverse team achieved their goals',
      'The team of different backgrounds succeeded',
      'The multicultural group completed the project',
      'The team achieved their goals through collaboration'
    ],
    correct: 'The team achieved their goals through collaboration',
    explanation: 'This focuses on the achievement and collaboration without unnecessarily highlighting differences.'
  },
  {
    question: 'Which statement demonstrates ability-inclusive language?',
    options: [
      'The disabled employee used a wheelchair',
      'The employee used a wheelchair for mobility',
      'The handicapped worker needed assistance',
      'The special needs employee required help'
    ],
    correct: 'The employee used a wheelchair for mobility',
    explanation: 'This statement focuses on the specific accommodation needed without defining the person by their disability.'
  }
]

const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const showFeedback = ref(false)
const quizCompleted = ref(false)
const score = ref(0)

const isLastQuestion = computed(() => currentQuestion.value === quizQuestions.length - 1)

const feedbackMessage = computed(() => {
  if (selectedAnswer.value === quizQuestions[currentQuestion.value].correct) {
    return 'Correct! Well done!'
  }
  return `Incorrect. The correct answer is: ${quizQuestions[currentQuestion.value].correct}`
})

const feedbackClass = computed(() => {
  return selectedAnswer.value === quizQuestions[currentQuestion.value].correct
    ? 'correct-feedback'
    : 'incorrect-feedback'
})

const scoreMessage = computed(() => {
  const percentage = (score.value / quizQuestions.length) * 100
  if (percentage >= 90) return "Excellent! You're a bias detection expert!"
  if (percentage >= 70) return "Great job! You have a good understanding of bias detection."
  if (percentage >= 50) return "Good effort! Keep learning about bias detection."
  return "Keep practicing! You'll improve with more experience."
})

// Add new interactive features
const showProgress = ref(false)
const progressValue = ref(0)
const showAchievement = ref(false)
const currentAchievement = ref('')

const achievements = [
  { id: 'first_correct', title: 'First Step', description: 'Got your first correct answer!' },
  { id: 'streak_3', title: 'On Fire!', description: '3 correct answers in a row!' },
  { id: 'streak_5', title: 'Unstoppable!', description: '5 correct answers in a row!' },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Completed the quiz with 100%!' }
]

function startTimer() {
  timeRemaining.value = 30
  quizTimer.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(quizTimer.value)
      showFeedback.value = true
      selectedAnswer.value = null
    }
  }, 1000)
}

function selectAnswer(option) {
  clearInterval(quizTimer.value)
  selectedAnswer.value = option
  showFeedback.value = true
  if (option === quizQuestions[currentQuestion.value].correct) {
    score.value++
    streakCount.value++
    if (streakCount.value > 1) {
      showStreak.value = true
      setTimeout(() => {
        showStreak.value = false
      }, 2000)
    }
  } else {
    streakCount.value = 0
  }
  currentExplanation.value = quizQuestions[currentQuestion.value].explanation
  showExplanation.value = true
  updateProgress()
  checkAchievements()
}

function nextQuestion() {
  if (isLastQuestion.value) {
    quizCompleted.value = true
  } else {
    currentQuestion.value++
    selectedAnswer.value = null
    showFeedback.value = false
    showExplanation.value = false
    startTimer()
  }
}

function resetQuiz() {
  currentQuestion.value = 0
  selectedAnswer.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
  streakCount.value = 0
  showStreak.value = false
  showExplanation.value = false
  startTimer()
}

function updateProgress() {
  progressValue.value = (score.value / quizQuestions.length) * 100
  showProgress.value = true
  setTimeout(() => {
    showProgress.value = false
  }, 2000)
}

function checkAchievements() {
  if (score.value === 1) {
    showAchievement.value = true
    currentAchievement.value = achievements[0]
  } else if (streakCount.value === 3) {
    showAchievement.value = true
    currentAchievement.value = achievements[1]
  } else if (streakCount.value === 5) {
    showAchievement.value = true
    currentAchievement.value = achievements[2]
  } else if (score.value === quizQuestions.length) {
    showAchievement.value = true
    currentAchievement.value = achievements[3]
  }
  
  if (showAchievement.value) {
    setTimeout(() => {
      showAchievement.value = false
    }, 3000)
  }
}

// Start timer when quiz tab is selected
watch(activeTab, (newTab) => {
  if (newTab === 'quiz' && !quizCompleted.value) {
    startTimer()
  }
})

onMounted(() => {
  if (activeTab.value === 'quiz') {
    startTimer()
  }
})

onUnmounted(() => {
  if (quizTimer.value) {
    clearInterval(quizTimer.value)
  }
})
</script>

<style scoped>
.education-hub {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  min-height: 100vh;
}

.hub-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.hub-header:hover {
  transform: translateY(-5px);
}

.hub-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.hub-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
}

.nav-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.nav-btn.active {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  border-bottom: 2px solid #4CAF50;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.content-section:hover {
  transform: translateY(-2px);
}

.bias-card, .practice-card, .resource-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.bias-card:hover, .practice-card:hover, .resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bias-card h3, .practice-card h3, .resource-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bias-card h3::before, .practice-card h3::before, .resource-card h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background: #4CAF50;
  border-radius: 2px;
}

.examples, .solutions, .tips {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.examples h4, .solutions h4, .tips h4 {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.examples ul, .solutions ul, .tips ul {
  list-style: none;
  padding: 0;
}

.examples li, .solutions li, .tips li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.examples li::before, .solutions li::before, .tips li::before {
  content: '•';
  color: #4CAF50;
  font-weight: bold;
}

.example-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.before, .after {
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.before {
  background: #fff3f3;
  border: 1px solid #ffcdd2;
}

.after {
  background: #f3fff3;
  border: 1px solid #c8e6c9;
}

.before:hover, .after:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.resource-link:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.quiz-progress {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

.quiz-timer {
  font-size: 1.2rem;
  font-weight: 500;
  color: #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
}

.timer-warning {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  animation: pulse 1s infinite;
}

.streak-indicator {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff9800;
  margin: 1rem 0;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.question-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.question {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.5;
}

.options {
  display: grid;
  gap: 1rem;
}

.option-btn {
  padding: 1rem 1.5rem;
  border: 2px solid #eee;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-align: left;
  color: #2c3e50;
}

.option-btn:hover:not(:disabled) {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
  transform: translateY(-2px);
}

.option-btn.selected {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.option-btn.correct {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  animation: pulse 0.5s ease;
}

.option-btn.incorrect {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  animation: shake 0.5s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.feedback {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.correct-feedback {
  color: #4CAF50;
  font-weight: 500;
}

.incorrect-feedback {
  color: #f44336;
  font-weight: 500;
}

.explanation {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.explanation h4 {
  color: #4CAF50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.explanation p {
  color: #2c3e50;
  line-height: 1.6;
}

.next-btn, .retry-btn {
  padding: 0.75rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
}

.next-btn:hover, .retry-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-results {
  text-align: center;
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}

.score-display {
  margin: 2rem 0;
}

.score-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.score {
  font-size: 3.5rem;
  font-weight: 700;
}

.total {
  font-size: 1.8rem;
  opacity: 0.8;
}

.score-message {
  margin-top: 1.5rem;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 500;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.achievement-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.5s ease;
  z-index: 1000;
}

.achievement-content {
  text-align: center;
}

.achievement-content h4 {
  color: #4CAF50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.achievement-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
  .education-hub {
    padding: 1rem;
  }

  .hub-header {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .hub-header h1 {
    font-size: 2rem;
  }

  .nav-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .example-pair {
    grid-template-columns: 1fr;
  }

  .score-circle {
    width: 150px;
    height: 150px;
  }

  .score {
    font-size: 3rem;
  }

  .total {
    font-size: 1.5rem;
  }
}
</style> 