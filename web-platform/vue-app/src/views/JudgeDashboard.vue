<!-- JudgeDashboard.vue -->
<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <a v-for="item in sidebarItems" 
           :key="item.id"
           :href="item.link"
           class="sidebar-link"
           :class="{ active: currentSection === item.id }"
           @click.prevent="currentSection = item.id"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </a>
      </nav>
    </aside>

    <main class="dashboard-content">
      <div class="dashboard-header">
        <h1 class="dashboard-title">{{ currentSectionTitle }}</h1>
        <div class="dashboard-actions">
          <button class="btn btn--primary" @click="generateReport">
            <i class="fas fa-file-export"></i>
            Generate Report
          </button>
          <button class="btn btn--secondary" @click="refreshData">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- Overview Section -->
      <section v-if="currentSection === 'overview'" class="dashboard-section">
        <div class="metrics-grid">
          <div v-for="metric in metrics" 
               :key="metric.id" 
               class="metric-card"
          >
            <div class="metric-icon">
              <i :class="metric.icon"></i>
            </div>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
          </div>
        </div>

        <div class="dashboard-card">
          <h2>Performance Trends</h2>
          <div class="chart-container">
            <div class="chart-placeholder">
              Performance Chart Placeholder
            </div>
          </div>
        </div>
      </section>

      <!-- Technical Architecture Section -->
      <section v-if="currentSection === 'architecture'" class="dashboard-section">
        <div class="dashboard-card">
          <h2>System Architecture</h2>
          <div class="architecture-diagram">
            <img src="@/assets/images/architecture-diagram.svg" 
                 alt="System Architecture Diagram"
                 class="diagram-img"
            >
          </div>
        </div>

        <div class="dashboard-card">
          <h2>Technology Stack</h2>
          <div class="tech-stack-grid">
            <div v-for="tech in techStack" 
                 :key="tech.name" 
                 class="tech-card"
            >
              <i :class="tech.icon"></i>
              <h3 class="tech-name">{{ tech.name }}</h3>
              <p class="tech-role">{{ tech.role }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Reports Section -->
      <section v-if="currentSection === 'reports'" class="dashboard-section">
        <div class="dashboard-card">
          <h2>Generate Report</h2>
          <div class="report-generator">
            <div class="form-group">
              <label for="report-type">Report Type</label>
              <select id="report-type" v-model="reportType">
                <option value="performance">Performance Report</option>
                <option value="bias">Bias Analysis Report</option>
                <option value="system">System Health Report</option>
              </select>
            </div>

            <div class="form-group">
              <label for="date-range">Date Range</label>
              <div class="date-range-inputs">
                <input type="date" 
                       id="start-date" 
                       v-model="startDate"
                >
                <span>to</span>
                <input type="date" 
                       id="end-date" 
                       v-model="endDate"
                >
              </div>
            </div>

            <div class="checkbox-group">
              <h3>Include Sections</h3>
              <div v-for="section in reportSections" 
                   :key="section.id"
                   class="checkbox-item"
              >
                <input type="checkbox" 
                       :id="section.id"
                       v-model="section.selected"
                >
                <label :for="section.id">{{ section.label }}</label>
              </div>
            </div>

            <button class="btn btn--primary" @click="generateReport">
              Generate Report
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sidebar Navigation
const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line', link: '#overview' },
  { id: 'architecture', label: 'Technical Architecture', icon: 'fas fa-sitemap', link: '#architecture' },
  { id: 'reports', label: 'Reports', icon: 'fas fa-file-alt', link: '#reports' }
]

const currentSection = ref('overview')
const currentSectionTitle = computed(() => {
  const item = sidebarItems.find(item => item.id === currentSection.value)
  return item ? item.label : ''
})

// Metrics Data
const metrics = ref([
  { id: 1, label: 'Total Analyses', value: '1,234', icon: 'fas fa-chart-bar' },
  { id: 2, label: 'Accuracy Rate', value: '98.5%', icon: 'fas fa-bullseye' },
  { id: 3, label: 'Response Time', value: '0.8s', icon: 'fas fa-clock' },
  { id: 4, label: 'Active Users', value: '456', icon: 'fas fa-users' }
])

// Technology Stack
const techStack = ref([
  { name: 'Vue.js', role: 'Frontend Framework', icon: 'fab fa-vuejs' },
  { name: 'Node.js', role: 'Backend Runtime', icon: 'fab fa-node-js' },
  { name: 'Python', role: 'AI Processing', icon: 'fab fa-python' },
  { name: 'TensorFlow', role: 'Machine Learning', icon: 'fas fa-brain' },
  { name: 'PostgreSQL', role: 'Database', icon: 'fas fa-database' },
  { name: 'Docker', role: 'Containerization', icon: 'fab fa-docker' }
])

// Report Generation
const reportType = ref('performance')
const startDate = ref('')
const endDate = ref('')
const reportSections = ref([
  { id: 'metrics', label: 'Performance Metrics', selected: true },
  { id: 'bias', label: 'Bias Analysis', selected: true },
  { id: 'system', label: 'System Health', selected: true },
  { id: 'users', label: 'User Statistics', selected: false }
])

const generateReport = () => {
  // TODO: Implement report generation
  console.log('Generating report:', {
    type: reportType.value,
    dateRange: { start: startDate.value, end: endDate.value },
    sections: reportSections.value.filter(s => s.selected).map(s => s.id)
  })
}

const refreshData = () => {
  // TODO: Implement data refresh
  console.log('Refreshing dashboard data')
}
</script>

<style scoped>
.dashboard-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 160px);
}

.sidebar {
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 30px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text-color);
  border-left: 3px solid transparent;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.sidebar-link:hover {
  background-color: rgba(var(--primary-color-rgb), 0.05);
  color: var(--primary-color);
}

.sidebar-link.active {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.dashboard-content {
  padding: 30px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-title {
  font-size: 1.8rem;
  margin: 0;
}

.dashboard-actions {
  display: flex;
  gap: 15px;
}

.dashboard-card {
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 25px;
  margin-bottom: 30px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  text-align: center;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: var(--primary-color);
}

.metric-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.chart-container {
  height: 300px;
  margin-bottom: 20px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.tech-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.tech-card {
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  text-align: center;
  transition: transform var(--transition-normal);
}

.tech-card:hover {
  transform: translateY(-5px);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.tech-name {
  font-weight: 600;
  margin: 0 0 5px;
}

.tech-role {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.architecture-diagram {
  text-align: center;
  margin-bottom: 30px;
}

.diagram-img {
  max-width: 100%;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.report-generator {
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group select, 
.form-group input[type="date"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  font-family: var(--font-family);
}

.date-range-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.btn--primary {
  background-color: var(--primary-color);
  color: white;
}

.btn--primary:hover {
  background-color: var(--primary-color-dark);
}

.btn--secondary {
  background-color: var(--bg-secondary);
  color: var(--text-color);
}

.btn--secondary:hover {
  background-color: var(--bg-tertiary);
}

@media (max-width: 992px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}
</style> 