export const biasDetectionConfig = {
  // API Configuration
  api: {
    endpoint: process.env.BIAS_DETECTION_API_ENDPOINT || 'https://api.biasbuster.ai/v1',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Model Configuration
  model: {
    version: '1.0.0',
    minConfidence: 0.7,
    maxTokens: 2048,
  },

  // Bias Detection Settings
  detection: {
    defaultSensitivity: 'balanced',
    severityThresholds: {
      strict: 0.3,
      balanced: 0.5,
      lenient: 0.7,
    },
    maxInstancesPerAnalysis: 10,
  },

  // Sentiment Analysis
  sentiment: {
    minConfidence: 0.6,
    maxEmotionalTones: 5,
  },

  // Source Credibility
  credibility: {
    minScore: 0,
    maxScore: 100,
    weightFactors: {
      transparency: 0.3,
      balance: 0.3,
      logicalFallacies: 0.2,
      historicalReliability: 0.2,
    },
  },

  // Language Detection
  language: {
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'],
    defaultLanguage: 'en',
  },

  // Cache Settings
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000, // Maximum number of cached results
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    saveAnalysis: true,
    saveErrors: true,
  },
}; 