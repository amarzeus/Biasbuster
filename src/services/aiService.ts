import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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
}

const AI_MODELS: AIModelConfig[] = [
  {
    name: 'llama3-8b-8192',
    provider: 'groq',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite'],
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.0000002,
    strengths: ['fast', 'good-value', 'balanced-analysis']
  },
  {
    name: 'llama3-70b-8192',
    provider: 'groq',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual'],
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.0000009,
    strengths: ['high-accuracy', 'nuanced-analysis', 'better-explanations']
  },
  {
    name: 'claude-3-opus-20240229',
    provider: 'anthropic',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual', 'citation-analysis'],
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    contextWindow: 200000,
    costPerToken: 0.000015,
    strengths: ['highest-accuracy', 'deep-analysis', 'best-for-long-content']
  },
  {
    name: 'gpt-4',
    provider: 'openai',
    capabilities: ['bias-detection', 'sentiment-analysis', 'content-rewrite', 'source-credibility', 'multi-lingual'],
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    contextWindow: 8192,
    costPerToken: 0.00006,
    strengths: ['highest-accuracy', 'nuanced-analysis', 'wide-knowledge']
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
  } = {}
): Promise<BiasBusterResponse> {
  const aiService = process.env.AI_SERVICE || 'mock'; 
  
  // Auto-select model based on text length, capabilities needed, and user preferences
  const selectedModel = selectBestModel(prompt.length, options);
  console.log(`Selected AI model: ${selectedModel.name} (${selectedModel.provider})`);

  switch(selectedModel.provider.toLowerCase()) {
    case 'groq':
      return await callGroqAI(prompt, selectedModel, options);
    case 'anthropic':
      return await callAnthropicAI(prompt, selectedModel, options);
    case 'openai':
      return await callOpenAI(prompt, selectedModel, options);
    case 'google':
      return await callGoogleAI(prompt, options);
    default:
      return await callMockAI(prompt, options);
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
      strengths: ['testing']
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
      strengths: ['testing']
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
  
  // Add language detection and instructions
  if (options.language && options.language !== 'en') {
    const languageInstructions = `
LANGUAGE NOTE: The article may contain content in ${options.language}. Please process it accordingly and include:
"LanguageDetected": "detected_language_code"
`;
    
    enhancedPrompt = enhancedPrompt.replace('ARTICLE TO ANALYZE:', languageInstructions + '\n\nARTICLE TO ANALYZE:');
  }
  
  return enhancedPrompt;
}

/**
 * Call Groq AI with given prompt
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
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable not set');
  }

  try {
    console.log('Calling Groq AI with enhanced prompt...');
    
    // Enhance the prompt with additional instructions
    const enhancedPrompt = enhancePrompt(prompt, options);
    
    // Split prompt into system part and user part
    const parts = enhancedPrompt.split('[Insert article text here]');
    const systemContent = parts[0].trim();
    const userContent = parts.length > 1 ? parts[1].trim() : '';

    const requestBody = {
      model: model.name,
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        {
          role: 'user',
          content: `Please analyze the following article based on the instructions you have been given:\n\n${userContent}`
        }
      ],
      temperature: 0.2, // Lower temperature for more deterministic outputs
      max_tokens: options.maxTokens || 4096,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" }
    };

    const response = await axios.post(
      model.apiEndpoint,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the JSON from the response
    const responseContent = response.data.choices[0].message.content;
    
    // Parse the response
    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('Successfully parsed AI JSON response.');
      return validateAndFormatResponse(parsedResponse);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Failed to parse AI response as JSON');
    }
    
  } catch (error: any) {
    console.error('Error calling Groq AI:', error.response?.data || error.message);
    throw new Error(`Groq AI call failed: ${error.message}`);
  }
}

/**
 * Call Anthropic Claude AI with given prompt
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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  try {
    console.log('Calling Anthropic Claude AI with enhanced prompt...');
    
    // Enhance the prompt with additional instructions
    const enhancedPrompt = enhancePrompt(prompt, options);
    
    // For Anthropic, we combine system and user content
    const parts = enhancedPrompt.split('[Insert article text here]');
    const systemContent = parts[0].trim();
    const userContent = parts.length > 1 ? parts[1].trim() : '';
    
    const combinedContent = `${systemContent}\n\nARTICLE TO ANALYZE:\n${userContent}`;

    const requestBody = {
      model: model.name,
      messages: [
        {
          role: 'user',
          content: combinedContent
        }
      ],
      temperature: 0.2,
      max_tokens: options.maxTokens || 4000,
      system: "You are Biasbuster, an expert AI system specializing in detecting bias and misinformation in news articles. You analyze content carefully and provide structured, accurate feedback.",
      response_format: { type: "json_object" }
    };

    const response = await axios.post(
      model.apiEndpoint,
      requestBody,
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the content from Anthropic's response format
    const responseContent = response.data.content[0].text;
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('Successfully parsed Anthropic Claude response.');
      return validateAndFormatResponse(parsedResponse);
    } catch (e) {
      console.error('Error parsing Anthropic response:', e);
      throw new Error('Failed to parse Anthropic response as JSON');
    }
    
  } catch (error: any) {
    console.error('Error calling Anthropic Claude:', error.response?.data || error.message);
    throw new Error(`Anthropic Claude call failed: ${error.message}`);
  }
}

/**
 * Call OpenAI with given prompt
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
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  try {
    console.log('Calling OpenAI with enhanced prompt...');
    
    // Enhance the prompt with additional instructions
    const enhancedPrompt = enhancePrompt(prompt, options);
    
    // Split prompt into system part and user part
    const parts = enhancedPrompt.split('[Insert article text here]');
    const systemContent = parts[0].trim();
    const userContent = parts.length > 1 ? parts[1].trim() : '';

    const requestBody = {
      model: model.name,
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        {
          role: 'user',
          content: `Please analyze the following article based on the instructions you have been given:\n\n${userContent}`
        }
      ],
      temperature: 0.2,
      max_tokens: options.maxTokens || 4000,
      response_format: { type: "json_object" }
    };

    const response = await axios.post(
      model.apiEndpoint,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the JSON from the response
    const responseContent = response.data.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('Successfully parsed OpenAI response.');
      return validateAndFormatResponse(parsedResponse);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
    
  } catch (error: any) {
    console.error('Error calling OpenAI:', error.response?.data || error.message);
    throw new Error(`OpenAI call failed: ${error.message}`);
  }
}

/**
 * Call Google AI with given prompt - implementation stub
 */
async function callGoogleAI(
  prompt: string,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
  } = {}
): Promise<BiasBusterResponse> {
  throw new Error('Google AI integration not implemented yet');
}

/**
 * Provide a mock AI response for testing with enhanced features
 */
async function callMockAI(
  prompt: string,
  options: {
    language?: string;
    includeSentiment?: boolean;
    includeCredibility?: boolean;
  } = {}
): Promise<BiasBusterResponse> {
  console.log('Using mock AI service for testing');
  
  // Extract a sample sentence from the prompt for mock analysis
  const sampleText = prompt.split('\n').filter(line => line.length > 50)[0] || 
                    'This is a sample sentence for mock analysis.';
  
  // Get some mock bias instances by picking text from the prompt
  const mockBiasInstances = [];
  const lines = prompt.split('\n');
  let contentStarted = false;
  
  for (const line of lines) {
    if (line.includes('ARTICLE TO ANALYZE:')) {
      contentStarted = true;
      continue;
    }
    
    if (contentStarted && line.length > 30) {
      // Add some random instances
      if (Math.random() > 0.8) {
        mockBiasInstances.push({
          Sentence: line.substring(0, Math.min(line.length, 100)),
          BiasType: ['Framing Bias', 'Cognitive Bias', 'Sentiment Bias', 'Selection Bias'][Math.floor(Math.random() * 4)],
          Explanation: "This is a mock explanation of potential bias in the text.",
          Severity: String(Math.floor(Math.random() * 3)),
          Justification: "Mock justification for the severity rating.",
          Mitigation: "This is a mock suggestion for a more balanced phrasing."
        });
      }
    }
  }
  
  // Ensure we have at least one instance
  if (mockBiasInstances.length === 0) {
    mockBiasInstances.push({
      Sentence: sampleText,
      BiasType: "Mock Bias Type",
      Explanation: "This is a mock explanation of bias.",
      Severity: "1",
      Justification: "Mock severity justification",
      Mitigation: "This is a mock unbiased rewrite suggestion."
    });
  }
  
  // Add advanced features if requested
  let sentimentAnalysis;
  if (options.includeSentiment) {
    sentimentAnalysis = {
      Overall: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
      Score: parseFloat((Math.random() * 2 - 1).toFixed(2)), // Convert to number with parseFloat
      EmotionalTone: ["informative", "objective", "concerned", "alarming"].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }
  
  let sourceCredibility;
  if (options.includeCredibility) {
    sourceCredibility = {
      Score: Math.floor(Math.random() * 100),
      Factors: [
        "Limited citation of sources",
        "Some unsupported claims",
        "Presents multiple viewpoints"
      ],
      Recommendations: [
        "Include more specific citations",
        "Clearly separate opinion from fact"
      ]
    };
  }
  
  // Mock response with the sample text
  return {
    MainTopic: 'Mock Analysis',
    BiasDetected: mockBiasInstances.length > 0 ? 'yes' : 'no',
    BiasInstances: mockBiasInstances,
    BiasSummary: 'Mock bias summary.',
    TrustedSources: [
      'https://example.com/reliable-source-1', 
      'https://example.com/reliable-source-2'
    ],
    EducationalContent: 'This is mock educational content about bias in media.',
    SentimentAnalysis: sentimentAnalysis,
    SourceCredibility: sourceCredibility,
    LanguageDetected: options.language || "en"
  };
}

/**
 * Validate and format the AI response to ensure it matches the expected structure
 */
function validateAndFormatResponse(response: any): BiasBusterResponse {
  // Ensure the response has all required fields
  const validatedResponse: BiasBusterResponse = {
    MainTopic: response.MainTopic || 'Unknown Topic',
    BiasDetected: response.BiasDetected === 'yes' ? 'yes' : 'no',
    BiasInstances: Array.isArray(response.BiasInstances) ? response.BiasInstances : [],
    BiasSummary: response.BiasSummary || 'No summary provided.',
    TrustedSources: Array.isArray(response.TrustedSources) ? response.TrustedSources : [],
    EducationalContent: response.EducationalContent || 'No educational content provided.'
  };
  
  // Add advanced features if present
  if (response.SentimentAnalysis) {
    validatedResponse.SentimentAnalysis = {
      Overall: response.SentimentAnalysis.Overall || 'neutral',
      Score: parseFloat(response.SentimentAnalysis.Score) || 0,
      EmotionalTone: Array.isArray(response.SentimentAnalysis.EmotionalTone) ? 
        response.SentimentAnalysis.EmotionalTone : []
    };
  }
  
  if (response.SourceCredibility) {
    validatedResponse.SourceCredibility = {
      Score: parseInt(response.SourceCredibility.Score) || 50,
      Factors: Array.isArray(response.SourceCredibility.Factors) ? 
        response.SourceCredibility.Factors : [],
      Recommendations: Array.isArray(response.SourceCredibility.Recommendations) ? 
        response.SourceCredibility.Recommendations : []
    };
  }
  
  if (response.LanguageDetected) {
    validatedResponse.LanguageDetected = response.LanguageDetected;
  }
  
  return validatedResponse;
} 