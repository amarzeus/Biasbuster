import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EducationHub from '../views/EducationHub.vue'
import CourseDetail from '../views/CourseDetail.vue'
import ResourceDetail from '../views/ResourceDetail.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Pricing from '../views/Pricing.vue'
import Auth from '../views/Auth.vue'
import Documentation from '../views/Documentation.vue'
import MediaLiteracy from '../views/MediaLiteracy.vue'
import AILiteracy from '../views/AILiteracy.vue'
import JudgeDashboard from '../views/JudgeDashboard.vue'
import EthicsCommittee from '../views/EthicsCommittee.vue'
import Dashboard from '../views/Dashboard.vue'
import Privacy from '../views/Privacy.vue'
import Terms from '../views/Terms.vue'
import Features from '../views/Features.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/education',
    name: 'EducationHub',
    component: EducationHub
  },
  {
    path: '/education/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    props: true
  },
  {
    path: '/resources/:id',
    name: 'ResourceDetail',
    component: ResourceDetail,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/docs',
    name: 'Documentation',
    component: Documentation
  },
  {
    path: '/media-literacy',
    name: 'MediaLiteracy',
    component: MediaLiteracy
  },
  {
    path: '/ai-literacy',
    name: 'AILiteracy',
    component: AILiteracy
  },
  {
    path: '/judge-dashboard',
    name: 'JudgeDashboard',
    component: JudgeDashboard
  },
  {
    path: '/ethics-committee',
    name: 'EthicsCommittee',
    component: EthicsCommittee
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/features',
    name: 'Features',
    component: Features
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
