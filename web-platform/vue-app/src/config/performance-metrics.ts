export const PERFORMANCE_METRICS = [
  {
    name: 'First Contentful Paint',
    description: 'Time until the browser renders the first piece of content',
    weight: 0.15,
    threshold: 1800,
    category: 'loading'
  },
  {
    name: 'Largest Contentful Paint',
    description: 'Time until the largest content element is rendered',
    weight: 0.25,
    threshold: 2500,
    category: 'loading'
  },
  {
    name: 'First Input Delay',
    description: 'Time until the page becomes interactive',
    weight: 0.15,
    threshold: 100,
    category: 'interactivity'
  },
  {
    name: 'Cumulative Layout Shift',
    description: 'Measures visual stability of the page',
    weight: 0.15,
    threshold: 0.1,
    category: 'visual'
  },
  {
    name: 'Time to Interactive',
    description: 'Time until the page is fully interactive',
    weight: 0.1,
    threshold: 3500,
    category: 'interactivity'
  },
  {
    name: 'Speed Index',
    description: 'How quickly content is visually displayed',
    weight: 0.1,
    threshold: 3400,
    category: 'loading'
  },
  {
    name: 'Total Blocking Time',
    description: 'Total time when the main thread was blocked',
    weight: 0.1,
    threshold: 300,
    category: 'interactivity'
  }
];

export const PERFORMANCE_CATEGORIES = {
  loading: {
    name: 'Loading Performance',
    description: 'Measures how quickly the page loads',
    metrics: ['First Contentful Paint', 'Largest Contentful Paint', 'Speed Index']
  },
  interactivity: {
    name: 'Interactivity',
    description: 'Measures how quickly the page becomes interactive',
    metrics: ['First Input Delay', 'Time to Interactive', 'Total Blocking Time']
  },
  visual: {
    name: 'Visual Stability',
    description: 'Measures how stable the page layout is',
    metrics: ['Cumulative Layout Shift']
  }
};

export const PERFORMANCE_THRESHOLDS = {
  good: {
    score: 90,
    color: '#28a745'
  },
  needsImprovement: {
    score: 50,
    color: '#ffc107'
  },
  poor: {
    score: 0,
    color: '#dc3545'
  }
};

export const PERFORMANCE_GOALS = {
  targetScore: 90,
  targetMetrics: {
    'First Contentful Paint': 1000,
    'Largest Contentful Paint': 2000,
    'First Input Delay': 50,
    'Cumulative Layout Shift': 0.05,
    'Time to Interactive': 3000,
    'Speed Index': 3000,
    'Total Blocking Time': 200
  }
};

export const PERFORMANCE_WEIGHTS = {
  loading: 0.4,
  interactivity: 0.4,
  visual: 0.2
};

export const PERFORMANCE_MONITORING_INTERVAL = 5000; // 5 seconds

export const PERFORMANCE_HISTORY_LENGTH = 100; // Store last 100 measurements

export const PERFORMANCE_ALERT_THRESHOLDS = {
  degradation: 10, // Alert if performance degrades by 10%
  improvement: 20, // Alert if performance improves by 20%
  critical: 30 // Alert if performance degrades by 30%
};

export const PERFORMANCE_REPORTING = {
  enabled: true,
  endpoint: '/api/performance',
  batchSize: 10,
  maxRetries: 3,
  retryDelay: 1000
};

export const PERFORMANCE_OPTIMIZATION = {
  enabled: true,
  autoOptimize: false,
  optimizationInterval: 3600000, // 1 hour
  maxOptimizations: 5
};

export const PERFORMANCE_VISUALIZATION = {
  chartColors: [
    '#3498db',
    '#2ecc71',
    '#e74c3c',
    '#f1c40f',
    '#9b59b6',
    '#1abc9c',
    '#e67e22'
  ],
  chartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    }
  }
}; 