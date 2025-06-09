import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create the Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Mount the app
app.mount('#app')

// Print startup info
console.log('Biasbuster Vue App started successfully.')
console.log('Access the website at: http://localhost:3000')
console.log('Available commands:')
console.log('  npm run dev       - Start development server')
console.log('  npm run build     - Build for production')
console.log('  npm run test      - Run tests')
