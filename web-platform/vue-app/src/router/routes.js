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
    path: '/how-it-works',
    name: 'HowItWorks',
    component: () => import('@/views/HowItWorks.vue'),
    meta: {
      title: 'How It Works - BiasBuster'
    }
  },
  {
    path: '/analytics-dashboard',
    name: 'AnalyticsDashboard',
    component: () => import('@/views/AnalyticsDashboard.vue'),
    meta: {
      title: 'Analytics Dashboard - BiasBuster'
    }
  },
  {
    path: '/transparency-reports',
    name: 'TransparencyReports',
    component: () => import('@/views/TransparencyReports.vue'),
    meta: {
      title: 'Transparency Reports - BiasBuster'
    }
  },
  {
    path: '/ai-ethics-governance',
    name: 'AIEthicsGovernance',
    component: () => import('@/views/AIEthicsGovernance.vue'),
    meta: {
      title: 'AI Ethics & Governance - BiasBuster'
    }
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: () => import('@/views/KnowledgeBase.vue'),
    meta: {
      title: 'Knowledge Base - BiasBuster'
    }
  },
  {
    path: '/testimonials-partners',
    name: 'TestimonialsPartners',
    component: () => import('@/views/TestimonialsPartners.vue'),
    meta: {
      title: 'Testimonials & Partners - BiasBuster'
    }
  },
  {
    path: '/press-kit',
    name: 'PressKit',
    component: () => import('@/views/PressKit.vue'),
    meta: {
      title: 'Press Kit - BiasBuster'
    }
  },
  {
    path: '/careers',
    name: 'Careers',
    component: () => import('@/views/Careers.vue'),
    meta: {
      title: 'Careers - BiasBuster'
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
