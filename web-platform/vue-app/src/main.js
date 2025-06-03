import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/routes'
import App from './App.vue'
import './style.css'

// Create the Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Mount the app
app.mount('#app')
