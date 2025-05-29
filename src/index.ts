import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeBias } from './tools/analyzeBias';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN?.split(','),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic rate limiting middleware
const requestCounts = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  const record = requestCounts.get(ip)!;
  
  // Reset counter if time window has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_WINDOW;
    return next();
  }
  
  // Increment counter and check limit
  record.count++;
  if (record.count > RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: 'Too many requests, please try again later'
    });
  }
  
  next();
}

// Apply rate limiting to all API endpoints
app.use('/api', rateLimiter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const aiService = process.env.AI_SERVICE || 'mock';
  const availableModels = [];
  
  if (process.env.GROQ_API_KEY) availableModels.push('groq');
  if (process.env.OPENAI_API_KEY) availableModels.push('openai');
  if (process.env.ANTHROPIC_API_KEY) availableModels.push('anthropic');
  if (process.env.GOOGLE_API_KEY) availableModels.push('google');
  if (aiService === 'mock') availableModels.push('mock');
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    aiService,
    availableModels,
    features: {
      biasDetection: true,
      sentimentAnalysis: true,
      sourceCredibility: true,
      multilingualSupport: true
    }
  });
});

// AI models endpoint
app.get('/api/v1/models', (req, res) => {
  const models = [];
  
  if (process.env.GROQ_API_KEY) {
    models.push(
      { id: 'llama3-8b-8192', provider: 'groq', tier: 'standard', capabilities: ['bias', 'sentiment'] },
      { id: 'llama3-70b-8192', provider: 'groq', tier: 'premium', capabilities: ['bias', 'sentiment', 'credibility', 'multilingual'] }
    );
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    models.push(
      { id: 'claude-3-opus-20240229', provider: 'anthropic', tier: 'premium', capabilities: ['bias', 'sentiment', 'credibility', 'multilingual', 'citation'] }
    );
  }
  
  if (process.env.OPENAI_API_KEY) {
    models.push(
      { id: 'gpt-4', provider: 'openai', tier: 'premium', capabilities: ['bias', 'sentiment', 'credibility', 'multilingual'] }
    );
  }
  
  // Always include mock for testing
  models.push(
    { id: 'mock', provider: 'mock', tier: 'test', capabilities: ['bias', 'sentiment', 'credibility'] }
  );
  
  res.json({
    models,
    defaultModel: process.env.DEFAULT_AI_MODEL || 'auto'
  });
});

// Bias analysis endpoint
app.post('/api/v1/analyze', async (req, res) => {
  try {
    const { text, options } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }
    
    // Normalize options with defaults
    const analysisOptions = {
      includeSentiment: options?.includeSentiment !== false,
      includeCredibility: options?.includeCredibility !== false,
      preferredModel: options?.model || process.env.DEFAULT_AI_MODEL,
      language: options?.language || 'auto',
      maxTokens: options?.maxTokens || 4000
    };
    
    console.log(`Received analysis request with text length: ${text.length} characters`);
    const result = await analyzeBias(text, analysisOptions);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during analysis'
    });
  }
});

// Sentiment analysis endpoint
app.post('/api/v1/sentiment', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }
    
    // Use the bias analyzer with sentiment analysis only
    console.log(`Received sentiment analysis request with text length: ${text.length} characters`);
    const result = await analyzeBias(text, {
      includeSentiment: true,
      includeCredibility: false,
      preferredModel: 'auto'
    });
    
    // Return just the sentiment part
    res.json({
      sentiment: result.SentimentAnalysis || {
        Overall: 'neutral',
        Score: 0,
        EmotionalTone: []
      },
      topic: result.MainTopic
    });
  } catch (error: any) {
    console.error('Error in sentiment endpoint:', error);
    res.status(500).json({
      error: 'Sentiment analysis failed',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Source credibility endpoint
app.post('/api/v1/credibility', async (req, res) => {
  try {
    const { text, url } = req.body;
    
    if (!text && !url) {
      return res.status(400).json({ error: 'Missing required field: text or url' });
    }
    
    let contentToAnalyze = text;
    
    // If URL is provided but no text, we could fetch the URL content
    // Not implemented in this version, but would be here in production
    if (!text && url) {
      return res.status(400).json({ error: 'URL fetching not implemented. Please provide text directly.' });
    }
    
    // Use the bias analyzer with credibility analysis focus
    console.log(`Received credibility analysis request with text length: ${contentToAnalyze.length} characters`);
    const result = await analyzeBias(contentToAnalyze, {
      includeSentiment: false,
      includeCredibility: true,
      preferredModel: 'auto'
    });
    
    // Return just the credibility part
    res.json({
      credibility: result.SourceCredibility || {
        Score: 50,
        Factors: ["No specific credibility factors identified"],
        Recommendations: ["Insufficient information to provide recommendations"]
      },
      topic: result.MainTopic
    });
  } catch (error: any) {
    console.error('Error in credibility endpoint:', error);
    res.status(500).json({
      error: 'Credibility analysis failed',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Comprehensive analysis endpoint (includes all features)
app.post('/api/v1/comprehensive', async (req, res) => {
  try {
    const { text, options } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }
    
    // Include all analysis features
    const analysisOptions = {
      includeSentiment: true,
      includeCredibility: true,
      preferredModel: options?.model || process.env.DEFAULT_AI_MODEL || 'auto',
      language: options?.language || 'auto',
      maxTokens: options?.maxTokens || 4000
    };
    
    console.log(`Received comprehensive analysis request with text length: ${text.length} characters`);
    const result = await analyzeBias(text, analysisOptions);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error in comprehensive analysis endpoint:', error);
    res.status(500).json({
      error: 'Comprehensive analysis failed',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Feedback endpoint
app.post('/api/v1/feedback', (req, res) => {
  // Future implementation: store feedback in database
  const { feedback } = req.body;
  console.log('Received feedback:', feedback);
  res.json({ success: true, message: 'Feedback received' });
});

// Version endpoint
app.get('/api/v1/version', (req, res) => {
  res.json({
    version: '1.1.0',
    buildDate: '2024-06-15',
    features: [
      'Bias Detection',
      'Sentiment Analysis',
      'Source Credibility',
      'Multilingual Support',
      'Adaptive AI Model Selection'
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Biasbuster MCP server running on port ${port}`);
  console.log(`Health check available at: http://localhost:${port}/api/v1/health`);
}); 