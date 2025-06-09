<!-- Pricing.vue -->
<template>
  <div class="container">
    <section class="pricing-hero">
      <h2>Choose Your Plan</h2>
      <p class="pricing-subheading">Select the perfect subscription that suits your needs</p>
      
      <div class="pricing-grid">
        <!-- Free Tier -->
        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Free</h3>
            <div class="price-container">
              <div class="price">$0</div>
              <div class="price-period">forever</div>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li><i class="fas fa-check"></i> Basic bias detection</li>
              <li><i class="fas fa-check"></i> 10 analyses per month</li>
              <li><i class="fas fa-check"></i> Standard AI models</li>
              <li><i class="fas fa-times"></i> No history tracking</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <a href="/auth" class="btn secondary-btn">Get Started</a>
          </div>
        </div>
        
        <!-- Premium Tier -->
        <div class="pricing-card featured">
          <div class="pricing-header">
            <h3>Premium</h3>
            <div class="price-container">
              <div class="price">$9.99</div>
              <div class="price-period">per month</div>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li><i class="fas fa-check"></i> Advanced bias detection</li>
              <li><i class="fas fa-check"></i> Unlimited analyses</li>
              <li><i class="fas fa-check"></i> Premium AI models</li>
              <li><i class="fas fa-check"></i> Analysis history tracking</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <a href="/auth" class="btn primary-btn">Subscribe Now</a>
          </div>
        </div>
        
        <!-- Team Tier -->
        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Team</h3>
            <div class="price-container">
              <div class="price">$24.99</div>
              <div class="price-period">per month</div>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li><i class="fas fa-check"></i> All Premium features</li>
              <li><i class="fas fa-check"></i> 5 team member accounts</li>
              <li><i class="fas fa-check"></i> Team dashboard</li>
              <li><i class="fas fa-check"></i> Priority support</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <a href="/auth" class="btn secondary-btn">Subscribe Now</a>
          </div>
        </div>
      </div>
    </section>
    
    <section class="contact-cta">
      <div class="cta-content">
        <h3>Need a Custom Plan?</h3>
        <p>For organizations with specific requirements, we offer custom enterprise solutions.</p>
        <a href="/contact" class="btn primary-btn">Contact Sales</a>
      </div>
    </section>
  </div>
</template>

<script setup>
// No additional script logic needed for this component
</script>

<style scoped>
.pricing-hero {
  text-align: center;
  padding: 60px 0;
}

.pricing-subheading {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-top: 1rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 40px 0;
}

.pricing-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 30px;
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
}

.pricing-card.featured {
  border: 2px solid var(--primary-color);
  position: relative;
}

.pricing-header {
  text-align: center;
  margin-bottom: 30px;
}

.price-container {
  margin-top: 15px;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-period {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.pricing-features {
  margin: 30px 0;
}

.pricing-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.pricing-features i {
  margin-right: 10px;
  color: var(--primary-color);
}

.pricing-features i.fa-times {
  color: var(--text-secondary);
}

.pricing-cta {
  text-align: center;
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

.contact-cta {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 40px;
  text-align: center;
  margin: 60px 0;
}

.cta-content h3 {
  margin-bottom: 15px;
}

.cta-content p {
  color: var(--text-secondary);
  margin-bottom: 25px;
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style> 