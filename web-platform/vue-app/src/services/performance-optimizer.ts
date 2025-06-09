import {
  PERFORMANCE_METRICS,
  PERFORMANCE_CATEGORIES,
  PERFORMANCE_GOALS,
  PERFORMANCE_OPTIMIZATION
} from '@/config/performance-metrics';

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  metrics: string[];
  solution: string;
  codeExample: string;
  resources: string[];
}

class PerformanceOptimizer {
  private recommendations: OptimizationRecommendation[] = [];
  private lastOptimization: number = 0;

  constructor() {
    this.initializeRecommendations();
  }

  private initializeRecommendations() {
    this.recommendations = [
      {
        id: 'lazy-loading',
        title: 'Implement Lazy Loading',
        description: 'Load images and components only when they are about to enter the viewport',
        impact: 'high',
        category: 'loading',
        metrics: ['First Contentful Paint', 'Largest Contentful Paint'],
        solution: 'Use the Intersection Observer API to lazy load images and components',
        codeExample: `// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src || '';
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));`,
        resources: [
          'https://web.dev/lazy-loading-images/',
          'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API'
        ]
      },
      {
        id: 'code-splitting',
        title: 'Implement Code Splitting',
        description: 'Split your application code into smaller chunks that can be loaded on demand',
        impact: 'high',
        category: 'loading',
        metrics: ['Time to Interactive', 'First Input Delay'],
        solution: 'Use dynamic imports to split your code into chunks',
        codeExample: `// Instead of
import HeavyComponent from './HeavyComponent';

// Use
const HeavyComponent = () => import('./HeavyComponent');`,
        resources: [
          'https://web.dev/code-splitting/',
          'https://vitejs.dev/guide/code-splitting.html'
        ]
      },
      {
        id: 'resource-hints',
        title: 'Add Resource Hints',
        description: 'Use resource hints to optimize resource loading',
        impact: 'medium',
        category: 'loading',
        metrics: ['First Contentful Paint', 'Largest Contentful Paint'],
        solution: 'Add preload, prefetch, and preconnect hints to your HTML',
        codeExample: `<!-- Add to your HTML head -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">
<link rel="preconnect" href="https://api.example.com">`,
        resources: [
          'https://web.dev/resource-hints/',
          'https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types'
        ]
      },
      {
        id: 'virtual-scrolling',
        title: 'Implement Virtual Scrolling',
        description: 'Only render items that are currently visible in the viewport',
        impact: 'high',
        category: 'interactivity',
        metrics: ['Total Blocking Time', 'Time to Interactive'],
        solution: 'Use a virtual scrolling library or implement your own solution',
        codeExample: `// Using vue-virtual-scroller
import { RecycleScroller } from 'vue-virtual-scroller'

export default {
  components: {
    RecycleScroller
  },
  template: \`
    <RecycleScroller
      class="scroller"
      :items="items"
      :item-size="32"
      key-field="id"
    >
      <template #default="{ item }">
        <div class="item">
          {{ item.name }}
        </div>
      </template>
    </RecycleScroller>
  \`
}`,
        resources: [
          'https://github.com/Akryum/vue-virtual-scroller',
          'https://web.dev/virtualize-long-lists-react-window/'
        ]
      },
      {
        id: 'memoization',
        title: 'Implement Memoization',
        description: 'Cache expensive computations to avoid unnecessary recalculations',
        impact: 'medium',
        category: 'interactivity',
        metrics: ['First Input Delay', 'Total Blocking Time'],
        solution: 'Use memoization for expensive computations',
        codeExample: `// Using Vue's computed with memoization
import { computed } from 'vue'

const expensiveComputation = computed(() => {
  // Cache the result
  const cache = new Map()
  
  return (input) => {
    if (cache.has(input)) {
      return cache.get(input)
    }
    
    const result = // ... expensive computation
    cache.set(input, result)
    return result
  }
})`,
        resources: [
          'https://vuejs.org/guide/essentials/computed.html',
          'https://web.dev/optimize-long-tasks/'
        ]
      },
      {
        id: 'image-optimization',
        title: 'Optimize Images',
        description: 'Compress and serve images in modern formats',
        impact: 'high',
        category: 'loading',
        metrics: ['First Contentful Paint', 'Largest Contentful Paint'],
        solution: 'Use modern image formats and proper sizing',
        codeExample: `<!-- Use responsive images -->
<picture>
  <source
    srcset="image.webp"
    type="image/webp"
  >
  <source
    srcset="image.jpg"
    type="image/jpeg"
  >
  <img
    src="image.jpg"
    alt="Description"
    loading="lazy"
    width="800"
    height="600"
  >
</picture>`,
        resources: [
          'https://web.dev/uses-webp-images/',
          'https://web.dev/uses-responsive-images/'
        ]
      },
      {
        id: 'caching',
        title: 'Implement Caching',
        description: 'Cache static assets and API responses',
        impact: 'medium',
        category: 'loading',
        metrics: ['First Contentful Paint', 'Time to Interactive'],
        solution: 'Use service workers and HTTP caching',
        codeExample: `// Service worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});`,
        resources: [
          'https://web.dev/service-workers-cache-storage/',
          'https://developer.mozilla.org/en-US/docs/Web/API/Cache'
        ]
      },
      {
        id: 'debouncing',
        title: 'Implement Debouncing',
        description: 'Limit the rate at which functions are called',
        impact: 'medium',
        category: 'interactivity',
        metrics: ['First Input Delay', 'Total Blocking Time'],
        solution: 'Use debouncing for frequent events',
        codeExample: `// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  // Perform search
}, 300);`,
        resources: [
          'https://web.dev/optimize-long-tasks/',
          'https://lodash.com/docs/#debounce'
        ]
      }
    ];
  }

  public getRecommendations(metrics: Record<string, number>): OptimizationRecommendation[] {
    if (!PERFORMANCE_OPTIMIZATION.enabled) return [];

    const now = Date.now();
    if (now - this.lastOptimization < PERFORMANCE_OPTIMIZATION.optimizationInterval) {
      return this.recommendations;
    }

    this.lastOptimization = now;
    return this.recommendations.filter(recommendation => {
      const needsOptimization = recommendation.metrics.some(metric => {
        const currentValue = metrics[metric] || 0;
        const targetValue = PERFORMANCE_GOALS.targetMetrics[metric];
        return currentValue > targetValue;
      });

      return needsOptimization;
    });
  }

  public getRecommendationById(id: string): OptimizationRecommendation | null {
    return this.recommendations.find(rec => rec.id === id) || null;
  }

  public getRecommendationsByCategory(category: string): OptimizationRecommendation[] {
    return this.recommendations.filter(rec => rec.category === category);
  }

  public getRecommendationsByImpact(impact: 'high' | 'medium' | 'low'): OptimizationRecommendation[] {
    return this.recommendations.filter(rec => rec.impact === impact);
  }

  public addRecommendation(recommendation: OptimizationRecommendation) {
    this.recommendations.push(recommendation);
  }

  public removeRecommendation(id: string) {
    this.recommendations = this.recommendations.filter(rec => rec.id !== id);
  }

  public updateRecommendation(id: string, updates: Partial<OptimizationRecommendation>) {
    const index = this.recommendations.findIndex(rec => rec.id === id);
    if (index !== -1) {
      this.recommendations[index] = {
        ...this.recommendations[index],
        ...updates
      };
    }
  }
}

export const performanceOptimizer = new PerformanceOptimizer(); 