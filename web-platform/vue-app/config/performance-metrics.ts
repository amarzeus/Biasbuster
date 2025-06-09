export interface PerformanceMetric {
  name: string;
  description: string;
  threshold: number;
  unit: 'ms' | 's' | '%' | 'score';
  weight: number;
  category: 'loading' | 'interaction' | 'visual' | 'resource';
}

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  // Core Web Vitals
  {
    name: 'First Contentful Paint (FCP)',
    description: 'Time until the browser renders the first piece of content',
    threshold: 2000,
    unit: 'ms',
    weight: 1.0,
    category: 'loading'
  },
  {
    name: 'Largest Contentful Paint (LCP)',
    description: 'Time until the largest content element is rendered',
    threshold: 2500,
    unit: 'ms',
    weight: 1.0,
    category: 'loading'
  },
  {
    name: 'Cumulative Layout Shift (CLS)',
    description: 'Measures visual stability of the page',
    threshold: 0.1,
    unit: 'score',
    weight: 1.0,
    category: 'visual'
  },
  {
    name: 'First Input Delay (FID)',
    description: 'Time until the browser can respond to user interactions',
    threshold: 100,
    unit: 'ms',
    weight: 1.0,
    category: 'interaction'
  },
  {
    name: 'Time to First Byte (TTFB)',
    description: 'Time until the first byte of the response is received',
    threshold: 600,
    unit: 'ms',
    weight: 0.8,
    category: 'loading'
  },

  // Additional Loading Metrics
  {
    name: 'Speed Index',
    description: 'How quickly content is visually displayed',
    threshold: 3000,
    unit: 'ms',
    weight: 0.8,
    category: 'loading'
  },
  {
    name: 'Total Blocking Time (TBT)',
    description: 'Total time when the main thread was blocked',
    threshold: 300,
    unit: 'ms',
    weight: 0.8,
    category: 'interaction'
  },
  {
    name: 'Time to Interactive (TTI)',
    description: 'Time until the page is fully interactive',
    threshold: 3500,
    unit: 'ms',
    weight: 0.8,
    category: 'interaction'
  },

  // Resource Metrics
  {
    name: 'Total Resource Size',
    description: 'Total size of all resources loaded',
    threshold: 5000,
    unit: 'kb',
    weight: 0.6,
    category: 'resource'
  },
  {
    name: 'Number of Requests',
    description: 'Total number of HTTP requests',
    threshold: 50,
    unit: 'score',
    weight: 0.6,
    category: 'resource'
  },
  {
    name: 'Cache Hit Ratio',
    description: 'Percentage of resources served from cache',
    threshold: 80,
    unit: '%',
    weight: 0.6,
    category: 'resource'
  },

  // Interaction Metrics
  {
    name: 'Click Response Time',
    description: 'Time to respond to click events',
    threshold: 100,
    unit: 'ms',
    weight: 0.8,
    category: 'interaction'
  },
  {
    name: 'Scroll Performance',
    description: 'Time to complete scroll operations',
    threshold: 100,
    unit: 'ms',
    weight: 0.7,
    category: 'interaction'
  },
  {
    name: 'Animation Frame Rate',
    description: 'Frames per second during animations',
    threshold: 60,
    unit: 'fps',
    weight: 0.7,
    category: 'visual'
  },

  // Visual Metrics
  {
    name: 'First Meaningful Paint',
    description: 'Time until the primary content is visible',
    threshold: 2000,
    unit: 'ms',
    weight: 0.8,
    category: 'visual'
  },
  {
    name: 'Hero Element Time',
    description: 'Time until the main hero element is visible',
    threshold: 1500,
    unit: 'ms',
    weight: 0.7,
    category: 'visual'
  },
  {
    name: 'Image Load Time',
    description: 'Average time to load images',
    threshold: 1000,
    unit: 'ms',
    weight: 0.6,
    category: 'resource'
  }
];

export const PERFORMANCE_CATEGORIES = {
  loading: {
    name: 'Loading Performance',
    description: 'Metrics related to initial page load and resource loading',
    weight: 1.0
  },
  interaction: {
    name: 'Interaction Performance',
    description: 'Metrics related to user interactions and responsiveness',
    weight: 0.9
  },
  visual: {
    name: 'Visual Performance',
    description: 'Metrics related to visual stability and rendering',
    weight: 0.8
  },
  resource: {
    name: 'Resource Performance',
    description: 'Metrics related to resource loading and optimization',
    weight: 0.7
  }
};

export const PERFORMANCE_GRADES = {
  A: { min: 90, color: '#4CAF50' },
  B: { min: 80, color: '#8BC34A' },
  C: { min: 70, color: '#FFC107' },
  D: { min: 60, color: '#FF9800' },
  F: { min: 0, color: '#F44336' }
}; 