<template>
  <div class="container">
    <section class="about-hero">
      <h2 class="animate-fadeIn">Our Mission</h2>
      <div class="mission-statement animate-slideUp">
        <p class="lead-text">Biasbuster exists to promote media literacy and critical thinking in the digital age.</p>
        <p>In today's information-rich world, we're constantly bombarded with news and media content from countless sources. Our AI-powered tools help individuals, educators, and organizations identify bias, understand different perspectives, and make more informed decisions about the content they consume.</p>
      </div>
      <div class="stats-container animate-fadeIn">
        <div class="stat-box">
          <div class="stat-number">{{ stats.users }}</div>
          <div class="stat-label">Active Users</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">{{ stats.analyses }}</div>
          <div class="stat-label">Articles Analyzed</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">{{ stats.accuracy }}</div>
          <div class="stat-label">Accuracy Rate</div>
        </div>
      </div>
    </section>

    <section class="about-story">
      <h3 class="animate-fadeIn">Our Story</h3>
      <div class="story-timeline animate-slideUp">
        <div 
          v-for="(item, index) in timeline" 
          :key="index"
          class="timeline-item"
        >
          <div class="timeline-year">{{ item.year }}</div>
          <div class="timeline-content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="about-technology">
      <h3 class="animate-fadeIn">Our Technology</h3>
      <div class="tech-grid animate-fadeIn">
        <div 
          v-for="(tech, index) in technologies" 
          :key="index"
          class="tech-card"
        >
          <div class="tech-icon">
            <i :class="tech.icon"></i>
          </div>
          <h4>{{ tech.title }}</h4>
          <p>{{ tech.description }}</p>
        </div>
      </div>

      <div class="tech-diagram animate-fadeIn">
        <h4 class="text-center mb-3">How Biasbuster Works</h4>
        <div class="mermaid-diagram">
          <img src="@/assets/flowchart.svg" alt="Biasbuster Analysis Process" class="flowchart">
        </div>
      </div>
    </section>

    <section class="team-section">
      <h3 class="animate-fadeIn">Our Team</h3>
      <p class="text-center mb-4 animate-fadeIn">Biasbuster is developed by a passionate team of engineers, data scientists, and media literacy experts.</p>
      
      <div class="team-grid animate-fadeIn">
        <div 
          v-for="(member, index) in teamMembers" 
          :key="index"
          class="team-member"
        >
          <div class="member-photo">
            <img 
              :src="member.photo" 
              :alt="member.name"
              @error="handleImageError"
            >
          </div>
          <h4>{{ member.name }}</h4>
          <p class="member-title">{{ member.title }}</p>
          <p class="member-bio">{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <section class="partners-section">
      <h3 class="animate-fadeIn">Our Partners</h3>
      <p class="text-center mb-4 animate-fadeIn">We collaborate with leading organizations in education, media, and technology.</p>
      
      <div class="partners-grid animate-fadeIn">
        <div 
          v-for="(partner, index) in partners" 
          :key="index"
          class="partner-logo"
        >
          <img 
            :src="partner.logo" 
            :alt="partner.name"
            @error="handleImageError"
          >
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-box animate-fadeIn">
        <h3>Join the Movement for Media Literacy</h3>
        <p>Try Biasbuster today and start improving your critical thinking skills.</p>
        <div class="cta-buttons">
          <a href="/#demo" class="btn primary-btn">Try Demo</a>
          <a href="/auth" class="btn secondary-btn">Create Account</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  users: '10,000+',
  analyses: '1M+',
  accuracy: '98.5%'
})

const timeline = ref([
  {
    year: '2022',
    title: 'The Beginning',
    description: 'Biasbuster started as a research project focused on using AI to detect political bias in news articles.'
  },
  {
    year: '2023',
    title: 'Prototype Launch',
    description: 'The first prototype was launched, featuring basic bias detection capabilities. Early user feedback helped shape our development roadmap.'
  },
  {
    year: '2024',
    title: 'Full Platform Release',
    description: 'Biasbuster evolved into a comprehensive platform with advanced AI models, sentiment analysis, and multiple language support.'
  },
  {
    year: 'Today',
    title: 'Ongoing Evolution',
    description: 'We continue to refine our algorithms and expand our capabilities to better serve our growing user base.'
  }
])

const technologies = ref([
  {
    icon: 'fas fa-brain',
    title: 'Advanced AI Models',
    description: 'We use state-of-the-art language models like LLaMA3 and Claude to understand context, nuance, and subtle bias indicators in text.'
  },
  {
    icon: 'fas fa-chart-network',
    title: 'NLP Pipeline',
    description: 'Our custom natural language processing pipeline analyzes text at multiple levels, from word choice to overall narrative framing.'
  },
  {
    icon: 'fas fa-database',
    title: 'Comprehensive Training Data',
    description: 'Our models are trained on diverse datasets representing various political viewpoints, ideologies, and writing styles.'
  },
  {
    icon: 'fas fa-sync-alt',
    title: 'Continuous Improvement',
    description: 'Our technology gets better with each analysis through continuous learning and refinement.'
  }
])

const teamMembers = ref([
  {
    name: 'Alex Johnson',
    title: 'Founder & CEO',
    bio: 'AI researcher with a background in computational linguistics and media studies.',
    photo: '@/assets/team-1.jpg'
  },
  {
    name: 'Maria Rodriguez',
    title: 'Lead Data Scientist',
    bio: 'PhD in Machine Learning with expertise in NLP and bias detection algorithms.',
    photo: '@/assets/team-2.jpg'
  },
  {
    name: 'David Chen',
    title: 'CTO',
    bio: 'Software architect with 15+ years of experience building scalable AI systems.',
    photo: '@/assets/team-3.jpg'
  },
  {
    name: 'Sarah Williams',
    title: 'Media Literacy Expert',
    bio: 'Former journalist with a passion for promoting critical thinking in media consumption.',
    photo: '@/assets/team-4.jpg'
  }
])

const partners = ref([
  { name: 'Partner 1', logo: '@/assets/partner1.png' },
  { name: 'Partner 2', logo: '@/assets/partner2.png' },
  { name: 'Partner 3', logo: '@/assets/partner3.png' },
  { name: 'Partner 4', logo: '@/assets/partner4.png' },
  { name: 'Partner 5', logo: '@/assets/partner5.png' }
])

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'
}
</script>

<style scoped>
.about-hero {
  text-align: center;
  padding: 60px 0;
}

.mission-statement {
  max-width: 800px;
  margin: 0 auto 40px;
}

.lead-text {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-box {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: var(--border-radius);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.stat-label {
  color: var(--text-secondary);
}

.about-story {
  margin: 80px 0;
}

.story-timeline {
  max-width: 800px;
  margin: 40px auto 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 30px;
  margin-bottom: 40px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 50px;
  top: 60px;
  bottom: -40px;
  width: 2px;
  background: var(--border-color);
}

.timeline-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.timeline-content h4 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.timeline-content p {
  color: var(--text-secondary);
  margin: 0;
}

.about-technology {
  margin: 80px 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 40px 0;
}

.tech-card {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: var(--border-radius);
  text-align: center;
}

.tech-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.tech-card h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.tech-card p {
  color: var(--text-secondary);
  margin: 0;
}

.tech-diagram {
  margin-top: 60px;
}

.flowchart {
  max-width: 100%;
  height: auto;
}

.team-section {
  margin: 80px 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.team-member {
  text-align: center;
}

.member-photo {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member h4 {
  margin: 0 0 5px 0;
  color: var(--text-primary);
}

.member-title {
  color: var(--primary-color);
  font-weight: 500;
  margin: 0 0 10px 0;
}

.member-bio {
  color: var(--text-secondary);
  margin: 0;
}

.partners-section {
  margin: 80px 0;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.partner-logo {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo img {
  max-width: 100%;
  height: auto;
}

.cta-section {
  margin: 80px 0;
}

.cta-box {
  background: var(--bg-secondary);
  padding: 60px;
  border-radius: var(--border-radius);
  text-align: center;
}

.cta-box h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.cta-box p {
  color: var(--text-secondary);
  margin: 0 0 30px 0;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background: var(--primary-color-dark);
}

.secondary-btn {
  background: var(--bg-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.secondary-btn:hover {
  background: var(--bg-secondary);
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .partners-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .timeline-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .timeline-item:not(:last-child)::after {
    display: none;
  }
}
</style>
