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

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Bias analysis endpoint
app.post('/api/v1/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }
    
    console.log(`Received analysis request with text length: ${text.length} characters`);
    const result = await analyzeBias(text);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during analysis'
    });
  }
});

// Feedback endpoint (placeholder)
app.post('/api/v1/feedback', (req, res) => {
  // Future implementation: store feedback in database
  const { feedback } = req.body;
  console.log('Received feedback:', feedback);
  res.json({ success: true, message: 'Feedback received' });
});

// Start server
app.listen(port, () => {
  console.log(`Biasbuster MCP server running on port ${port}`);
  console.log(`Health check available at: http://localhost:${port}/api/v1/health`);
}); 