import fs from 'fs';
import path from 'path';
import { callAI, BiasBusterResponse } from '../services/aiService';
import biasAnalysisService from '../services/biasAnalysisService';

/**
 * Interface for bias analysis options
 */
interface BiasAnalysisOptions {
  includeSentiment?: boolean;
  includeCredibility?: boolean;
  preferredModel?: string;
  language?: string;
  maxTokens?: number;
  useLocalAnalysis?: boolean;  // Renamed from usePythonService
  customBiasPatterns?: Array<{
    id: string;
    pattern: string;
    biasType: string;
    severity: string;
    explanation: string;
  }>;
}

/**
 * Analyze article text for bias using the configured AI service.
 * @param text - The article text to analyze.
 * @param options - Optional configuration options for analysis.
 * @returns Structured analysis of bias in the article.
 */
export async function analyzeBias(
  text: string, 
  options: BiasAnalysisOptions = {}
): Promise<BiasBusterResponse> {
  try {
    console.log(`Analyzing text for bias (length: ${text.length} characters)`);
    
    // Set default options
    const analysisOptions: BiasAnalysisOptions = {
      includeSentiment: true,
      includeCredibility: true,
      language: detectLanguage(text),
      useLocalAnalysis: true, // Default to using local analysis
      ...options
    };
    
    // Apply any custom bias patterns provided
    if (analysisOptions.customBiasPatterns && analysisOptions.customBiasPatterns.length > 0) {
      // First, reset to defaults to ensure clean state
      biasAnalysisService.resetToDefaultPatterns();
      
      // Add each custom pattern
      analysisOptions.customBiasPatterns.forEach(pattern => {
        try {
          const regex = new RegExp(pattern.pattern, 'i');
          biasAnalysisService.addBiasPattern(
            pattern.id,
            regex,
            pattern.biasType,
            pattern.severity,
            pattern.explanation
          );
        } catch (error) {
          console.error(`Invalid regex pattern: ${pattern.pattern}`, error);
        }
      });
    }
    
    // Use local analysis service first if enabled
    if (analysisOptions.useLocalAnalysis) {
      try {
        const isHealthy = await biasAnalysisService.checkHealth();
        if (isHealthy) {
          console.log('Using local bias analysis service');
          const analysisResult = await biasAnalysisService.analyzeBias(text);
          
          // Convert string BiasDetected to "yes" | "no" format
          const normalizedResult = {
            ...analysisResult,
            BiasDetected: analysisResult.BiasDetected.toLowerCase() === 'yes' ? 'yes' as const : 'no' as const
          };
          
          // Apply post-processing to enhance results
          const enhancedResult = enhanceResults(normalizedResult, text);
          return enhancedResult;
        } else {
          console.log('Local analysis service is not available, falling back to AI service');
        }
      } catch (error) {
        console.error('Error using local analysis service:', error);
        console.log('Falling back to AI service');
      }
    }
    
    // Fall back to AI service
    // Read prompt template
    const promptTemplate = await loadPromptTemplate();
    
    // Insert the article text into the prompt template
    const fullPrompt = insertArticleIntoPrompt(promptTemplate, text);
    
    // Log analysis options
    console.log('Analysis options:', {
      includeSentiment: analysisOptions.includeSentiment,
      includeCredibility: analysisOptions.includeCredibility,
      language: analysisOptions.language,
      preferredModel: analysisOptions.preferredModel || 'auto'
    });
    
    // Call the AI service with the full prompt and options
    const analysisResult = await callAI(fullPrompt, analysisOptions);
    
    // Apply post-processing to enhance results
    const enhancedResult = enhanceResults(analysisResult, text);
    
    return enhancedResult;
  } catch (error: any) {
    console.error('Error analyzing bias:', error);
    throw new Error(`Bias analysis failed: ${error.message}`);
  }
}

/**
 * Load the prompt template from file.
 * @returns The prompt template as a string.
 */
async function loadPromptTemplate(): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), 'prompts', 'biasbusterPrompt.txt');
    return await fs.promises.readFile(promptPath, 'utf8');
  } catch (error: any) {
    console.error('Error loading prompt template:', error);
    throw new Error(`Failed to load prompt template: ${error.message}`);
  }
}

/**
 * Insert article text into the prompt template.
 * @param template - The prompt template.
 * @param articleText - The article text to analyze.
 * @returns The complete prompt with the article inserted.
 */
function insertArticleIntoPrompt(template: string, articleText: string): string {
  return template.replace('{{ARTICLE_TEXT}}', articleText);
}

/**
 * Simple language detection based on character frequency patterns
 * This is just a basic implementation - in production, you'd use a proper language detection library
 */
function detectLanguage(text: string): string {
  // Simple character frequency-based heuristic
  // Count characters that are unique to specific languages
  const sampleText = text.slice(0, 1000).toLowerCase();
  
  // Spanish characters
  const spanishChars = 'áéíóúüñ¿¡';
  let spanishCount = 0;
  for (const char of spanishChars) {
    spanishCount += (sampleText.match(new RegExp(char, 'g')) || []).length;
  }
  
  // French characters
  const frenchChars = 'àâæçèéêëîïôùûüÿœ';
  let frenchCount = 0;
  for (const char of frenchChars) {
    frenchCount += (sampleText.match(new RegExp(char, 'g')) || []).length;
  }
  
  // German characters
  const germanChars = 'äöüß';
  let germanCount = 0;
  for (const char of germanChars) {
    germanCount += (sampleText.match(new RegExp(char, 'g')) || []).length;
  }
  
  const counts = [
    { lang: 'es', count: spanishCount },
    { lang: 'fr', count: frenchCount },
    { lang: 'de', count: germanCount }
  ];
  
  // Detect language with most special characters
  const highestCount = Math.max(...counts.map(c => c.count));
  
  // If we have a clear non-English language detection
  if (highestCount > 5) {
    const detectedLang = counts.find(c => c.count === highestCount)?.lang;
    return detectedLang || 'en';
  }
  
  // Default to English
  return 'en';
}

/**
 * Enhance the analysis results with additional meta-information or post-processing
 */
function enhanceResults(result: BiasBusterResponse, originalText: string): BiasBusterResponse {
  // Add timestamp and visualization data if not present
  const enhancedResult = {
    ...result,
    _meta: {
      timestamp: new Date().toISOString(),
      textLength: originalText.length,
      processedAt: 'Biasbuster Analysis Server'
    }
  };
  
  return enhancedResult;
} 