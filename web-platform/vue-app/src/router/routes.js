import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'BiasBuster - World-Class Bias Detection Platform'
    }
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import('@/views/Features.vue'),
    meta: {
      title: 'Features - BiasBuster'
    }
  },
  {
    path: '/ai-literacy',
    name: 'AILiteracy',
    component: () => import('@/views/AILiteracy.vue'),
    meta: {
      title: 'AI Literacy Hub - BiasBuster'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo.vue'),
    meta: {
      title: 'Try Demo - BiasBuster'
    }
  },
  {
    path: '/docs',
    name: 'Documentation',
    component: () => import('@/views/Documentation.vue'),
    meta: {
      title: 'Documentation - BiasBuster'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: 'About Us - BiasBuster'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page Not Found - BiasBuster'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'BiasBuster'
  next()
})

export default router
