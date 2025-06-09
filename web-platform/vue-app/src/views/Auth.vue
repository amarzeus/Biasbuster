<!-- Auth.vue -->
<template>
  <div class="container">
    <div class="auth-tabs mb-4 text-center">
      <button 
        class="view-tab" 
        :class="{ active: activeTab === 'login' }"
        @click="activeTab = 'login'"
      >
        Login
      </button>
      <button 
        class="view-tab" 
        :class="{ active: activeTab === 'signup' }"
        @click="activeTab = 'signup'"
      >
        Sign Up
      </button>
    </div>

    <!-- Login Form -->
    <div v-show="activeTab === 'login'" class="auth-container">
      <div class="auth-header">
        <h2>Welcome Back</h2>
        <p class="text-secondary">Sign in to access your account</p>
      </div>
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input 
            type="email" 
            id="login-email" 
            v-model="loginForm.email" 
            required
          >
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input 
            type="password" 
            id="login-password" 
            v-model="loginForm.password" 
            required
          >
        </div>
        <div class="auth-links">
          <label>
            <input 
              type="checkbox" 
              v-model="loginForm.rememberMe"
            > Remember me
          </label>
          <a href="#" @click.prevent="activeTab = 'reset'">Forgot password?</a>
        </div>
        <button 
          type="submit" 
          class="w-full auth-submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="text-center mt-3">
        <p>Don't have an account? <a href="#" @click.prevent="activeTab = 'signup'">Sign up</a></p>
      </div>
    </div>

    <!-- Sign Up Form -->
    <div v-show="activeTab === 'signup'" class="auth-container">
      <div class="auth-header">
        <h2>Create Account</h2>
        <p class="text-secondary">Join Biasbuster to track your analyses</p>
      </div>
      <form class="auth-form" @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="signup-firstname">First Name</label>
          <input 
            type="text" 
            id="signup-firstname" 
            v-model="signupForm.firstName" 
            required
          >
        </div>
        <div class="form-group">
          <label for="signup-lastname">Last Name</label>
          <input 
            type="text" 
            id="signup-lastname" 
            v-model="signupForm.lastName" 
            required
          >
        </div>
        <div class="form-group">
          <label for="signup-email">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            v-model="signupForm.email" 
            required
          >
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            v-model="signupForm.password" 
            required 
            minlength="8"
          >
        </div>
        <div class="form-group">
          <label for="signup-confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="signup-confirm-password" 
            v-model="signupForm.confirmPassword" 
            required 
            minlength="8"
          >
          <p v-if="passwordMismatch" class="error-text">Passwords do not match</p>
        </div>
        <div class="auth-links">
          <label>
            <input 
              type="checkbox" 
              v-model="signupForm.terms" 
              required
            > I agree to the <a href="/terms">Terms & Conditions</a>
          </label>
        </div>
        <button 
          type="submit" 
          class="w-full auth-submit"
          :disabled="isLoading || passwordMismatch"
        >
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>
      <div class="text-center mt-3">
        <p>Already have an account? <a href="#" @click.prevent="activeTab = 'login'">Login</a></p>
      </div>
    </div>

    <!-- Password Reset Form -->
    <div v-show="activeTab === 'reset'" class="auth-container">
      <div class="auth-header">
        <h2>Reset Password</h2>
        <p class="text-secondary">Enter your email to receive a reset link</p>
      </div>
      <form class="auth-form" @submit.prevent="handleReset">
        <div class="form-group">
          <label for="reset-email">Email</label>
          <input 
            type="email" 
            id="reset-email" 
            v-model="resetForm.email" 
            required
          >
        </div>
        <button 
          type="submit" 
          class="w-full auth-submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
      <div class="text-center mt-3">
        <p><a href="#" @click.prevent="activeTab = 'login'">Back to Login</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const signupForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const resetForm = ref({
  email: ''
})

const passwordMismatch = computed(() => {
  return signupForm.value.password && 
         signupForm.value.confirmPassword && 
         signupForm.value.password !== signupForm.value.confirmPassword
})

const handleLogin = async () => {
  isLoading.value = true
  try {
    // TODO: Implement login logic
    console.log('Login form submitted:', loginForm.value)
    // On successful login:
    // router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  if (passwordMismatch.value) return
  
  isLoading.value = true
  try {
    // TODO: Implement signup logic
    console.log('Signup form submitted:', signupForm.value)
    // On successful signup:
    // router.push('/dashboard')
  } catch (error) {
    console.error('Signup error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = async () => {
  isLoading.value = true
  try {
    // TODO: Implement password reset logic
    console.log('Reset form submitted:', resetForm.value)
    // On successful reset request:
    // Show success message
    // activeTab.value = 'login'
  } catch (error) {
    console.error('Reset error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-tabs {
  margin-bottom: 2rem;
}

.view-tab {
  padding: 0.75rem 2rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
}

.view-tab.active {
  color: var(--primary-color);
}

.view-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-color);
}

.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.text-secondary {
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-color);
  color: var(--text-primary);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.error-text {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.auth-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.auth-links a {
  color: var(--primary-color);
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}

.auth-submit {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-submit:hover {
  background: var(--primary-color-dark);
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1.5rem;
  }
  
  .auth-links {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style> 