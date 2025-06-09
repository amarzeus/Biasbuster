import axios from 'axios';
import dotenv from 'dotenv';
import { BiasAnalysisResult, BiasInstance, SentimentAnalysis, SourceCredibility } from '../types/bias';

// Load environment variables
dotenv.config();

// Define types for AI responses
export interface BiasBusterResponse {
  MainTopic: string;
  BiasDetected: 'yes' | 'no';
  BiasInstances: Array<{
    Sentence: string;
    BiasType: string;
    Explanation: string;
    Severity: string;
    Justification: string;
    Mitigation: string;
  }>;
  BiasSummary: string;
  TrustedSources: string[];
  EducationalContent: string;
  // Advanced features
  SentimentAnalysis?: {
    Overall: string; // positive, negative, neutral
    Score: number; // -1 to 1
    EmotionalTone: string[];
  };
  SourceCredibility?: {
    Score: number; // 0 to 100
    Factors: string[];
    Recommendations: string[];
  };
  LanguageDetected?: string;
}

// Supported AI models configuration
interface AIModelConfig {
  name: string;
  provider: string;
  capabilities: string[];
  apiEndpoint: string;
  contextWindow: number;
  costPerToken: number;
  strengths: string[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

const AI_MODELS: AIModelConfig[] = [
  {
    name: 'llama3-8b-8192',
    provider: 'groq',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite'],
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.0000002,
    strengths: ['fast', 'good-value', 'balanced-analysis'],
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1
  },
  {
    name: 'llama3-70b-8192',
    provider: 'groq',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual'],
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.0000009,
    strengths: ['high-accuracy', 'nuanced-analysis', 'better-explanations'],
    temperature: 0.5,
    topP: 0.95,
    frequencyPenalty: 0.2,
    presencePenalty: 0.2
  },
  {
    name: 'claude-3-opus-20240229',
    provider: 'anthropic',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual', 'citation-analysis'],
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    contextWindow: 200000,
    costPerToken: 0.000015,
    strengths: ['highest-accuracy', 'deep-analysis', 'best-for-long-content'],
    temperature: 0.3,
    topP: 0.98,
    frequencyPenalty: 0.3,
    presencePenalty: 0.3
  },
  {
    name: 'gpt-4',
    provider: 'openai',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual'],
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.00006,
    strengths: ['highest-accuracy', 'nuanced-analysis', 'wide-knowledge'],
    temperature: 0.4,
    topP: 0.97,
    frequencyPenalty: 0.25,
    presencePenalty: 0.25
  }
];

/**
 * Call the selected AI service to analyze text for bias
 * @param prompt - Full prompt containing system instructions and user text
 * @param options - Optional configuration for analysis
 * @returns Structured analysis of bias in the text
 */
export async function callAI(
  prompt: string, 
  options: { 
    preferredModel?: string;
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  } = {}
): Promise<BiasBusterResponse> {
  // Auto-select model based on text length, capabilities needed, and user preferences
  const selectedModel = selectBestModel(prompt.length, options);
  console.log(`Selected AI model: ${selectedModel.name} (${selectedModel.provider})`);

  // Enhance the prompt with additional instructions
  const enhancedPrompt = enhancePrompt(prompt, options);

  // Add system instructions for better response structure
  const systemInstructions = `
You are an expert bias detection AI. Your task is to analyze text for bias and provide a structured response.
Follow these guidelines:
1. Be objective and evidence-based
2. Provide clear explanations for detected bias
3. Include specific examples and context
4. Suggest practical ways to mitigate bias
5. Format your response as valid JSON
6. Include all required fields in the response structure
7. Use precise language and avoid ambiguity
8. Consider multiple perspectives
9. Be sensitive to cultural context
10. Maintain professional tone`;

  const fullPrompt = `${systemInstructions}\n\n${enhancedPrompt}`;

  try {
    let response: BiasBusterResponse;
    
    switch(selectedModel.provider.toLowerCase()) {
      case 'groq':
        response = await callGroqAI(fullPrompt, selectedModel, options);
        break;
      case 'anthropic':
        response = await callAnthropicAI(fullPrompt, selectedModel, options);
        break;
      case 'openai':
        response = await callOpenAI(fullPrompt, selectedModel, options);
        break;
      case 'google':
        response = await callGoogleAI(fullPrompt, options);
        break;
      default:
        response = await callMockAI(fullPrompt, options);
    }

    // Validate and format the response
    return validateAndFormatResponse(response);
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw new Error('Failed to analyze text for bias');
  }
}

/**
 * Select the best model based on content, requirements, and environment
 */
function selectBestModel(
  contentLength: number,
  options: { 
    preferredModel?: string;
    language?: string; 
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    maxTokens?: number;
  } = {}
): AIModelConfig {
  // If user specified a model and we have it, use that
  if (options.preferredModel) {
    const userModel = AI_MODELS.find(m => m.name === options.preferredModel);
    if (userModel) return userModel;
  }

  // Use mock if specified in environment
  if (process.env.AI_SERVICE === 'mock') {
    return {
      name: 'mock',
      provider: 'mock',
      capabilities: ['bias-detection'],
      apiEndpoint: '',
      contextWindow: 10000,
      costPerToken: 0,
      strengths: ['testing'],
      temperature: 0.7
    };
  }
  
  // Check which API keys we have available
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY;
  
  // Filter to models we can actually use
  const availableModels = AI_MODELS.filter(model => {
    if (model.provider === 'groq' && !hasGroqKey) return false;
    if (model.provider === 'openai' && !hasOpenAIKey) return false;
    if (model.provider === 'anthropic' && !hasAnthropicKey) return false;
    if (model.provider === 'google' && !hasGoogleKey) return false;
    
    // Check if content length fits in context window
    // Rough estimate: 1 character = 0.25 tokens
    const estimatedTokens = contentLength * 0.25;
    if (estimatedTokens > model.contextWindow * 0.8) return false;
    
    // Check model capabilities against requirements
    if (options.language && options.language !== 'en' && 
        !model.capabilities.includes('multi-lingual')) return false;
    if (options.includeCredibility && !model.capabilities.includes('source-credibility')) return false;
    
    return true;
  });
  
  // If no models are available, fall back to mock
  if (availableModels.length === 0) {
    console.log("No suitable AI models available with current API keys. Using mock service.");
    return {
      name: 'mock',
      provider: 'mock',
      capabilities: ['bias-detection'],
      apiEndpoint: '',
      contextWindow: 10000,
      costPerToken: 0,
      strengths: ['testing'],
      temperature: 0.7
    };
  }
  
  // Prioritize based on requirements:
  // 1. Long content -> models with larger context windows
  // 2. Special features needed -> models with those capabilities  
  // 3. Default to cheapest adequate option
  
  // Sort by appropriate criteria
  if (contentLength > 10000) {
    // For very long content, prioritize context window
    availableModels.sort((a, b) => b.contextWindow - a.contextWindow);
  } else {
    // Otherwise, prioritize cost-efficiency
    availableModels.sort((a, b) => a.costPerToken - b.costPerToken);
  }
  
  return availableModels[0];
}

/**
 * Enhance the prompt with additional instructions based on options
 */
function enhancePrompt(
  prompt: string, 
  options: { 
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
  } = {}
): string {
  let enhancedPrompt = prompt;
  
  // Add sentiment analysis instructions
  if (options.includeSentiment) {
    const sentimentInstructions = `
8. SENTIMENT ANALYSIS
   - Analyze the overall sentiment and emotional tone of the article.
   - Rate the sentiment on a scale from -1 (extremely negative) to 1 (extremely positive).
   - Identify the primary emotional tones present (e.g., anger, fear, hope, etc.).
   - Include this in your output as:
     "SentimentAnalysis": {
       "Overall": "positive/negative/neutral",
       "Score": number,
       "EmotionalTone": ["emotion1", "emotion2", ...]
     }`;
    
    enhancedPrompt = enhancedPrompt.replace('ARTICLE TO ANALYZE:', sentimentInstructions + '\n\nARTICLE TO ANALYZE:');
  }
  
  // Add source credibility instructions
  if (options.includeCredibility) {
    const credibilityInstructions = `
9. SOURCE CREDIBILITY ASSESSMENT
   - Evaluate the credibility and reliability of the article based on:
     - Use of facts vs. opinions
     - Citation of sources
     - Transparency of methods
     - Balance in perspectives
     - Presence of logical fallacies
   - Rate overall credibility on a scale from 0 (extremely unreliable) to 100 (highly credible).
   - Include this in your output as:
     "SourceCredibility": {
       "Score": number,
       "Factors": ["factor1", "factor2", ...],
       "Recommendations": ["recommendation1", "recommendation2", ...]
     }`;
    
    enhancedPrompt = enhancedPrompt.replace('ARTICLE TO ANALYZE:', credibilityInstructions + '\n\nARTICLE TO ANALYZE:');
  }
  
  return enhancedPrompt;
}

/**
 * Call Groq AI API
 */
async function callGroqAI(
  prompt: string, 
  model: AIModelConfig,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    maxTokens?: number;
  } = {}
): Promise<BiasBusterResponse> {
  const response = await axios.post(
    model.apiEndpoint,
    {
      model: model.name,
      messages: [
        { role: 'system', content: 'You are an expert bias detection AI.' },
        { role: 'user', content: prompt }
      ],
      temperature: model.temperature,
      top_p: model.topP,
      frequency_penalty: model.frequencyPenalty,
      presence_penalty: model.presencePenalty,
      max_tokens: options.maxTokens || 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return parseAIResponse(response.data);
}

/**
 * Call Anthropic AI API
 */
async function callAnthropicAI(
  prompt: string,
  model: AIModelConfig,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    maxTokens?: number;
  } = {}
): Promise<BiasBusterResponse> {
  const response = await axios.post(
    model.apiEndpoint,
    {
      model: model.name,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: model.temperature,
      top_p: model.topP,
      max_tokens: options.maxTokens || 4000
    },
    {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    }
  );

  return parseAIResponse(response.data);
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  prompt: string,
  model: AIModelConfig,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    maxTokens?: number;
  } = {}
): Promise<BiasBusterResponse> {
  const response = await axios.post(
    model.apiEndpoint,
    {
      model: model.name,
      messages: [
        { role: 'system', content: 'You are an expert bias detection AI.' },
        { role: 'user', content: prompt }
      ],
      temperature: model.temperature,
      top_p: model.topP,
      frequency_penalty: model.frequencyPenalty,
      presence_penalty: model.presencePenalty,
      max_tokens: options.maxTokens || 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return parseAIResponse(response.data);
}

/**
 * Call Google AI API (placeholder)
 */
async function callGoogleAI(
  _prompt: string,
  _options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
  } = {}
): Promise<BiasBusterResponse> {
  // TODO: Implement Google AI API call
  throw new Error('Google AI API not implemented yet');
}

/**
 * Call mock AI for testing
 */
async function callMockAI(
  prompt: string,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
  } = {}
): Promise<BiasBusterResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock response
  return {
    MainTopic: 'Mock Analysis',
    BiasDetected: 'no',
    BiasInstances: [],
    BiasSummary: 'This is a mock response for testing purposes.',
    TrustedSources: [],
    EducationalContent: 'Mock educational content.',
    SentimentAnalysis: options.includeSentiment ? {
      Overall: 'neutral',
      Score: 0,
      EmotionalTone: ['neutral']
    } : undefined,
    SourceCredibility: options.includeCredibility ? {
      Score: 50,
      Factors: ['Mock factor 1', 'Mock factor 2'],
      Recommendations: ['Mock recommendation 1', 'Mock recommendation 2']
    } : undefined,
    LanguageDetected: options.language || 'en'
  };
}

/**
 * Parse and validate AI response
 */
function parseAIResponse(response: any): BiasBusterResponse {
  try {
    // Extract the content from the response based on the provider
    let content: string;
    if (response.choices?.[0]?.message?.content) {
      content = response.choices[0].message.content;
    } else if (response.content) {
      content = response.content;
    } else {
      throw new Error('Invalid response format');
    }

    // Parse the JSON content
    const parsed = JSON.parse(content);

    // Validate required fields
    if (!parsed.MainTopic || !parsed.BiasDetected || !parsed.BiasInstances || !parsed.BiasSummary) {
      throw new Error('Missing required fields in response');
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}

/**
 * Validate and format the response
 */
function validateAndFormatResponse(response: any): BiasBusterResponse {
  // Ensure all required fields are present
  const validated: BiasBusterResponse = {
    MainTopic: response.MainTopic || 'Unknown Topic',
    BiasDetected: response.BiasDetected || 'no',
    BiasInstances: Array.isArray(response.BiasInstances) ? response.BiasInstances : [],
    BiasSummary: response.BiasSummary || 'No bias analysis available.',
    TrustedSources: Array.isArray(response.TrustedSources) ? response.TrustedSources : [],
    EducationalContent: response.EducationalContent || 'No educational content available.',
    LanguageDetected: response.LanguageDetected || 'en'
  };

  // Add optional fields if present
  if (response.SentimentAnalysis) {
    validated.SentimentAnalysis = {
      Overall: response.SentimentAnalysis.Overall || 'neutral',
      Score: typeof response.SentimentAnalysis.Score === 'number' ? response.SentimentAnalysis.Score : 0,
      EmotionalTone: Array.isArray(response.SentimentAnalysis.EmotionalTone) ? response.SentimentAnalysis.EmotionalTone : []
    };
  }

  if (response.SourceCredibility) {
    validated.SourceCredibility = {
      Score: typeof response.SourceCredibility.Score === 'number' ? response.SourceCredibility.Score : 0,
      Factors: Array.isArray(response.SourceCredibility.Factors) ? response.SourceCredibility.Factors : [],
      Recommendations: Array.isArray(response.SourceCredibility.Recommendations) ? response.SourceCredibility.Recommendations : []
    };
  }

  return validated;
} 