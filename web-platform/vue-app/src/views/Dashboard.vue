<!-- Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <ul class="sidebar-menu">
        <li v-for="item in sidebarItems" :key="item.id">
          <a :href="item.link" :class="{ active: currentSection === item.id }" @click.prevent="currentSection = item.id">
            <i :class="item.icon"></i>
            {{ item.label }}
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-content">
      <div class="dashboard-header">
        <h1 class="dashboard-title">{{ currentSectionTitle }}</h1>
        <div class="dashboard-actions">
          <button class="btn btn--primary" v-if="currentSection === 'analyses'" @click="refreshAnalyses">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Overview Section -->
      <section v-if="currentSection === 'overview'">
        <div class="dashboard-stats">
          <div v-for="stat in stats" :key="stat.id" class="stat-card">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
        <div class="dashboard-card">
          <h2>Welcome back, {{ userName }}!</h2>
          <p>Here you can view your recent analyses, manage your account, and explore your subscription details.</p>
        </div>
      </section>

      <!-- Analyses Section -->
      <section v-if="currentSection === 'analyses'">
        <div class="dashboard-card recent-analyses">
          <h2>Recent Analyses</h2>
          <table class="analysis-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Text</th>
                <th>Bias Score</th>
                <th>Type</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="analysis in recentAnalyses" :key="analysis.id">
                <td>{{ analysis.date }}</td>
                <td>{{ analysis.text }}</td>
                <td class="bias-score">{{ analysis.score }}</td>
                <td>
                  <span :class="['bias-badge', `bias-${analysis.type}`]">
                    {{ analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1) }}
                  </span>
                </td>
                <td>{{ analysis.result }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Settings Section -->
      <section v-if="currentSection === 'settings'">
        <div class="dashboard-card user-settings">
          <h2>User Settings</h2>
          <form class="settings-form" @submit.prevent="saveSettings">
            <div class="form-group">
              <label for="user-name">Name</label>
              <input id="user-name" v-model="userName" class="form-control" type="text" />
            </div>
            <div class="form-group">
              <label for="user-email">Email</label>
              <input id="user-email" v-model="userEmail" class="form-control" type="email" />
            </div>
            <div class="form-group">
              <label for="api-key">API Key</label>
              <div class="api-key-container">
                <input id="api-key" v-model="apiKey" class="form-control api-key-field" type="text" readonly />
                <button class="copy-btn" type="button" @click="copyApiKey"><i class="fas fa-copy"></i></button>
              </div>
            </div>
            <button class="btn btn--primary" type="submit">Save Settings</button>
          </form>
        </div>
        <div class="dashboard-card subscription-card">
          <div class="plan-name">{{ subscription.plan }}</div>
          <div class="plan-price">{{ subscription.price }}</div>
          <div class="plan-details">{{ subscription.details }}</div>
          <div class="usage-bar-container">
            <div class="usage-bar" :style="{ width: subscription.usage + '%' }"></div>
          </div>
          <div class="usage-label">Usage: {{ subscription.usage }}%</div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-home', link: '#overview' },
  { id: 'analyses', label: 'My Analyses', icon: 'fas fa-list', link: '#analyses' },
  { id: 'settings', label: 'Settings', icon: 'fas fa-cog', link: '#settings' }
]
const currentSection = ref('overview')
const currentSectionTitle = computed(() => {
  const item = sidebarItems.find(item => item.id === currentSection.value)
  return item ? item.label : ''
})

const stats = ref([
  { id: 1, label: 'Total Analyses', value: 42 },
  { id: 2, label: 'Average Bias Score', value: '0.12' },
  { id: 3, label: 'Subscription', value: 'Pro' }
])

const userName = ref('Jane Doe')
const userEmail = ref('jane.doe@email.com')
const apiKey = ref('sk-1234-5678-ABCD')

const recentAnalyses = ref([
  { id: 1, date: '2024-06-01', text: 'Media coverage of elections...', score: 0.15, type: 'left', result: 'Mild Bias' },
  { id: 2, date: '2024-05-28', text: 'Economic policy review...', score: 0.02, type: 'neutral', result: 'No Bias' },
  { id: 3, date: '2024-05-25', text: 'Healthcare reform debate...', score: 0.22, type: 'right', result: 'Moderate Bias' }
])

const subscription = ref({
  plan: 'Pro',
  price: '$19/mo',
  details: 'Unlimited analyses, priority support',
  usage: 65
})

function refreshAnalyses() {
  // TODO: Implement refresh logic
  console.log('Refreshing analyses...')
}

function saveSettings() {
  // TODO: Implement save logic
  alert('Settings saved!')
}

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  alert('API Key copied!')
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: calc(100vh - 180px);
}
.dashboard-sidebar {
  width: 250px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 30px 0;
}
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu li {
  margin-bottom: 5px;
}
.sidebar-menu a {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-primary);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.sidebar-menu a:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
  border-left-color: var(--primary-color);
}
.sidebar-menu a.active {
  background-color: rgba(var(--primary-rgb), 0.1);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}
.sidebar-menu i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
}
.dashboard-content {
  flex: 1;
  padding: 30px;
  background-color: var(--bg-primary);
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.dashboard-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
.dashboard-actions .btn {
  margin-left: 10px;
}
.dashboard-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  text-align: center;
  padding: 20px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 10px 0;
}
.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}
.recent-analyses {
  margin-top: 30px;
}
.analysis-list {
  border-collapse: collapse;
  width: 100%;
}
.analysis-list th {
  text-align: left;
  padding: 12px 15px;
  border-bottom: 2px solid var(--border-color);
  font-weight: 600;
}
.analysis-list td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
}
.analysis-list tr:hover {
  background-color: rgba(var(--primary-rgb), 0.02);
}
.analysis-list .bias-score {
  font-weight: 600;
}
.bias-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}
.bias-left {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}
.bias-right {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}
.bias-neutral {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}
.user-settings {
  display: block;
}
.settings-form {
  max-width: 600px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
}
.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
}
.api-key-container {
  display: flex;
  align-items: center;
}
.api-key-field {
  flex: 1;
  font-family: monospace;
  background-color: var(--bg-secondary);
}
.copy-btn {
  margin-left: 10px;
  background-color: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 16px;
}
.subscription-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}
.plan-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}
.plan-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 15px;
}
.plan-details {
  margin-bottom: 20px;
}
.usage-bar-container {
  width: 100%;
  height: 8px;
}
.usage-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 4px;
}
.usage-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
}
</style> 