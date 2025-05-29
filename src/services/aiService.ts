import axios from 'axios';
import dotenv from 'dotenv';

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
}

/**
 * Call the selected AI service to analyze text for bias
 * @param prompt - Full prompt containing system instructions and user text
 * @returns Structured analysis of bias in the text
 */
export async function callAI(prompt: string): Promise<BiasBusterResponse> {
  const aiService = process.env.AI_SERVICE || 'mock'; // Default to mock for demo purposes

  switch(aiService.toLowerCase()) {
    case 'groq':
      return await callGroqAI(prompt);
    case 'openai':
      return await callOpenAI(prompt);
    case 'google':
      return await callGoogleAI(prompt);
    default:
      return await callMockAI(prompt); // Fallback mock implementation
  }
}

/**
 * Call Groq AI with given prompt
 */
async function callGroqAI(prompt: string): Promise<BiasBusterResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable not set');
  }

  try {
    console.log('Attempting to call Groq AI with a system prompt and user content...');
    
    // Split prompt into system part and user part
    // Assuming the prompt is formatted with instructions followed by article text
    const parts = prompt.split('[Insert article text here]');
    const systemContent = parts[0].trim();
    const userContent = parts.length > 1 ? parts[1].trim() : '';

    const requestBody = {
      model: 'llama3-8b-8192', // Using Llama 3 model
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
      max_tokens: 4096,
      top_p: 1,
      stream: false,
      // Uncomment to get guaranteed JSON:
      // response_format: { type: "json_object" }
    };

    console.log('Groq API Request Payload:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Groq API Raw Response Status: ${response.status}`);
    
    // Extract the JSON from the response
    const responseContent = response.data.choices[0].message.content;
    
    // Handle potential JSON formatting in a markdown block
    const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                     responseContent.match(/```\n([\s\S]*?)\n```/) ||
                     responseContent.match(/{[\s\S]*?}/);
    
    let parsedResponse;
    
    if (jsonMatch) {
      console.log('Extracted JSON from markdown block.');
      try {
        parsedResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error('Error parsing extracted JSON:', e);
        throw new Error('Failed to parse AI response as JSON');
      }
    } else {
      // Try to parse the entire response as JSON
      try {
        parsedResponse = JSON.parse(responseContent);
        console.log('Parsed entire response as JSON.');
      } catch (e) {
        console.error('Error parsing entire response as JSON:', e);
        throw new Error('AI response is not in the expected JSON format');
      }
    }
    
    console.log('Successfully parsed AI JSON response.');
    return validateAndFormatResponse(parsedResponse);
    
  } catch (error: any) {
    console.error('Error calling Groq AI:', error.response?.data || error.message);
    throw new Error(`Groq AI call failed: ${error.message}`);
  }
}

/**
 * Call OpenAI with given prompt - implementation stub
 */
async function callOpenAI(prompt: string): Promise<BiasBusterResponse> {
  throw new Error('OpenAI integration not implemented yet');
}

/**
 * Call Google AI with given prompt - implementation stub
 */
async function callGoogleAI(prompt: string): Promise<BiasBusterResponse> {
  throw new Error('Google AI integration not implemented yet');
}

/**
 * Provide a mock AI response for testing
 */
async function callMockAI(prompt: string): Promise<BiasBusterResponse> {
  console.log('Using mock AI service for testing');
  
  // Extract a sample sentence from the prompt for mock analysis
  const sampleText = prompt.split('\n').filter(line => line.length > 50)[0] || 
                    'This is a sample sentence for mock analysis.';
  
  // Mock response with the sample text
  return {
    MainTopic: 'Mock Analysis',
    BiasDetected: 'yes',
    BiasInstances: [
      {
        Sentence: sampleText,
        BiasType: 'Mock Bias Type',
        Explanation: 'This is a mock explanation of bias.',
        Severity: '1',
        Justification: 'Mock severity justification',
        Mitigation: 'This is a mock unbiased rewrite suggestion.'
      }
    ],
    BiasSummary: 'Mock bias summary.',
    TrustedSources: ['https://example.com/reliable-source-1', 'https://example.com/reliable-source-2'],
    EducationalContent: 'This is mock educational content about bias in media.'
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
  
  return validatedResponse;
} 