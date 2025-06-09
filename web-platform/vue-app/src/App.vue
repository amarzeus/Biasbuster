<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <nav class="nav-container">
        <router-link to="/" class="logo-link">
          <img 
            :src="isDarkMode ? '/src/assets/images/logo-dark.svg' : '/src/assets/images/logo-horizontal.svg'" 
            alt="BiasBuster Logo" 
            class="logo"
          />
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/features" class="nav-link">Features</router-link>
          <router-link to="/how-it-works" class="nav-link">How It Works</router-link>
          <router-link to="/education" class="nav-link">Education Hub</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>
        <div class="header-controls">
          <button @click="toggleDarkMode" class="theme-toggle" aria-label="Toggle dark mode">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <button @click="toggleAccessibilityMenu" class="accessibility-toggle" aria-label="Accessibility options">
            <i class="fas fa-universal-access"></i>
          </button>
        </div>
      </nav>
    </header>

    <AccessibilityMenu 
      v-if="showAccessibilityMenu"
      @close="showAccessibilityMenu = false"
    />

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img 
            src="/src/assets/images/logo-monochrome.svg" 
            alt="BiasBuster Logo" 
            class="footer-logo-img"
          />
        </div>
        <div class="footer-links">
          <router-link to="/privacy" class="footer-link">Privacy Policy</router-link>
          <router-link to="/terms" class="footer-link">Terms of Service</router-link>
          <router-link to="/accessibility" class="footer-link">Accessibility</router-link>
          <a href="https://github.com/amarzeus/biasbuster" class="footer-link">GitHub</a>
        </div>
        <div class="footer-social">
          <a href="https://linkedin.com/in/amarmahakal" class="social-link" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/amarzeus" class="social-link" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="mailto:amarmahakal92@gmail.com" class="social-link" aria-label="Email">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Made with ❤️ by Amar</p>
        <a href="https://buymeacoffee.com/amarmahakal" class="coffee-link">
          <i class="fas fa-coffee"></i> Buy me a coffee
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import AccessibilityMenu from './components/AccessibilityMenu.vue'
import { useAccessibility } from './composables/useAccessibility'

export default {
  name: 'App',
  components: {
    AccessibilityMenu
  },
  setup() {
    const isDarkMode = ref(false)
    const showAccessibilityMenu = ref(false)
    const { fontSize, highContrast, readingMode } = useAccessibility()

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value)
    }

    const toggleAccessibilityMenu = () => {
      showAccessibilityMenu.value = !showAccessibilityMenu.value
    }

    onMounted(() => {
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode !== null) {
        isDarkMode.value = savedDarkMode === 'true'
      } else {
        // Check system preference
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    })

    // Watch for system dark mode changes
    watch(() => window.matchMedia('(prefers-color-scheme: dark)').matches, (isDark) => {
      if (localStorage.getItem('darkMode') === null) {
        isDarkMode.value = isDark
      }
    })

    return {
      isDarkMode,
      showAccessibilityMenu,
      toggleDarkMode,
      toggleAccessibilityMenu,
      fontSize,
      highContrast,
      readingMode
    }
  }
}
</script>

<style>
:root {
  /* Light mode colors */
  --primary-color: #2A5C8A;
  --secondary-color: #2EC4B6;
  --accent-color: #FFD700;
  --text-color: #333333;
  --background-color: #FFFFFF;
  --surface-color: #F5F5F5;
  --border-color: #E0E0E0;
}

.dark-mode {
  /* Dark mode colors */
  --primary-color: #2EC4B6;
  --secondary-color: #2A5C8A;
  --accent-color: #FFD700;
  --text-color: #FFFFFF;
  --background-color: #1A1A1A;
  --surface-color: #2A2A2A;
  --border-color: #404040;
}

/* ... existing styles ... */

.app-header {
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  height: 40px;
  width: auto;
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.theme-toggle,
.accessibility-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.theme-toggle:hover,
.accessibility-toggle:hover {
  background-color: var(--surface-color);
}

.app-footer {
  background-color: var(--surface-color);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-logo-img {
  height: 60px;
  width: auto;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: var(--primary-color);
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--text-color);
  font-size: 1.5rem;
  transition: color 0.3s;
}

.social-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.coffee-link {
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
}

.coffee-link:hover {
  color: var(--accent-color);
}

/* Accessibility styles */
:root {
  --font-size-base: 16px;
  --line-height-base: 1.5;
}

body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color);
  background-color: var(--background-color);
  transition: background-color 0.3s, color 0.3s;
}

/* High contrast mode */
.high-contrast {
  --text-color: #000000;
  --background-color: #FFFFFF;
  --primary-color: #0000FF;
  --secondary-color: #FF0000;
  --accent-color: #FFFF00;
}

/* Reading mode */
.reading-mode {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.2em;
  line-height: 1.8;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-social {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
