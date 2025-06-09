<!-- EthicsCommittee.vue -->
<template>
  <div class="ethics-committee">
    <div class="hero-section">
      <h1>Ethics Committee</h1>
      <p>Ensuring Fair and Ethical AI Development</p>
      <img src="@/assets/images/ethics-committee.svg" alt="Ethics Committee" class="hero-image" />
    </div>

    <div class="steps-container">
      <h2>Our Process</h2>
      <div class="step-cards">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Review</h3>
          <p>Thorough examination of AI models and algorithms for potential biases</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Assessment</h3>
          <p>Evaluation of impact and potential risks to different user groups</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Recommendation</h3>
          <p>Clear guidance for improvements and bias mitigation strategies</p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h3>Monitoring</h3>
          <p>Continuous oversight and regular audits of implemented changes</p>
        </div>
      </div>
    </div>

    <div class="committee-members">
      <h2>Committee Members</h2>
      <div class="members-grid">
        <div class="member-card">
          <img src="@/assets/images/team/team-1.svg" alt="Committee Member" />
          <h3>Dr. Sarah Chen</h3>
          <p>AI Ethics Specialist</p>
        </div>
        <div class="member-card">
          <img src="@/assets/images/team/team-2.svg" alt="Committee Member" />
          <h3>Prof. James Wilson</h3>
          <p>Data Privacy Expert</p>
        </div>
        <div class="member-card">
          <img src="@/assets/images/team/team-3.svg" alt="Committee Member" />
          <h3>Dr. Maria Rodriguez</h3>
          <p>Fairness in AI Researcher</p>
        </div>
        <div class="member-card">
          <img src="@/assets/images/team/team-4.svg" alt="Committee Member" />
          <h3>Dr. Kwame Osei</h3>
          <p>Social Impact Analyst</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.ethics-committee {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-section h1 {
  font-size: 3rem;
  color: #1A1A1A;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.5rem;
  color: #666666;
  margin-bottom: 2rem;
}

.hero-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.steps-container {
  margin-bottom: 4rem;
}

.steps-container h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #1A1A1A;
  margin-bottom: 2rem;
}

.step-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-number {
  width: 40px;
  height: 40px;
  background: #2EC4B6;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
}

.step-card h3 {
  color: #1A1A1A;
  margin-bottom: 1rem;
}

.step-card p {
  color: #666666;
}

.committee-members {
  margin-bottom: 4rem;
}

.committee-members h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #1A1A1A;
  margin-bottom: 2rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.member-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.member-card:hover {
  transform: translateY(-5px);
}

.member-card img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.member-card h3 {
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.member-card p {
  color: #666666;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .hero-section p {
    font-size: 1.2rem;
  }

  .steps-container h2,
  .committee-members h2 {
    font-size: 2rem;
  }

  .step-cards,
  .members-grid {
    grid-template-columns: 1fr;
  }
}
</style> 