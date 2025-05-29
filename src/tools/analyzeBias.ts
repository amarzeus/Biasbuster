import fs from 'fs';
import path from 'path';
import { callAI, BiasBusterResponse } from '../services/aiService';

/**
 * Analyze article text for bias using the configured AI service.
 * @param text - The article text to analyze.
 * @returns Structured analysis of bias in the article.
 */
export async function analyzeBias(text: string): Promise<BiasBusterResponse> {
  try {
    console.log(`Analyzing text for bias (length: ${text.length} characters)`);
    
    // Read prompt template
    const promptTemplate = await loadPromptTemplate();
    
    // Insert the article text into the prompt template
    const fullPrompt = insertArticleIntoPrompt(promptTemplate, text);
    
    // Call the AI service with the full prompt
    const analysisResult = await callAI(fullPrompt);
    
    return analysisResult;
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
    const promptPath = path.join(__dirname, '../../prompts/biasbusterPrompt.txt');
    
    // Check if the file exists
    if (!fs.existsSync(promptPath)) {
      console.log('Prompt file not found at:', promptPath);
      console.log('Attempting to find prompt.txt in root directory...');
      
      // Fallback to root prompt.txt
      const rootPromptPath = path.join(__dirname, '../../prompt.txt');
      if (fs.existsSync(rootPromptPath)) {
        return fs.readFileSync(rootPromptPath, 'utf8');
      }
      
      throw new Error('Could not find prompt file');
    }
    
    return fs.readFileSync(promptPath, 'utf8');
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
  // Replace the placeholder with the article text
  return template.replace('[Insert article text here]', articleText);
} 