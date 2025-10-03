import { GoogleGenAI } from "@google/genai";
import { BiasAnalysisResult, GroundingChunk, APIError, GeminiAPIResponse, AnalysisOptions } from '../types';

const SYSTEM_INSTRUCTION = `
Analyze the provided text for any form of bias (Framing, Omission, Spin, Unsubstantiated Claim, Stereotyping, Loaded Language).
For each instance of bias found, provide the following:
1.  "biasedPhrase": The exact phrase from the original text that exhibits bias. Must be a substring of the original text.
2.  "explanation": A clear, concise explanation of why this phrase is considered biased.
3.  "biasType": The category of bias.
4.  "suggestion": A neutral, unbiased alternative to the phrase.

Respond with ONLY a valid JSON object in the following format. Do not include any other text, explanations, or markdown formatting outside of the JSON object.

{
  "findings": [
    {
      "biasedPhrase": "string",
      "explanation": "string",
      "biasType": "string",
      "suggestion": "string"
    }
  ]
}
`;

const KB_SYSTEM_INSTRUCTION = `You are a friendly and helpful AI assistant for Biasbuster, a platform that helps users detect and understand bias in text. Your role is to answer user questions about the platform, its features, and the concepts of bias it addresses.

Your knowledge base includes:
- **What Biasbuster is**: An AI-powered tool to analyze text for biases like Framing, Omission, Spin, Unsubstantiated Claim, Stereotyping, and Loaded Language.
- **How to use it**: Users paste text, click analyze, and get highlighted findings with explanations and suggestions. It also has a Chrome extension.
- **Bias Types**:
  - Framing: Presenting info to influence interpretation.
  - Omission: Leaving out key facts.
  - Spin: Using sensational or vague language.
  - Unsubstantiated Claim: Making statements without evidence.
  - Stereotyping: Oversimplified generalization about a group.
  - Loaded Language: Using emotionally charged words.
- **Features**: Text analysis, Chrome extension, education hub with a quiz, analytics dashboard.
- **Creator**: The app was created by Amar.

When answering, be clear, concise, and friendly. Use simple markdown for formatting, like using asterisks for bullet points (e.g., "* item one"). Do not make up information. If you don't know the answer, say so politely.`;


export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey.trim()) {
      throw new Error("API_KEY is required to initialize GeminiService.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getKnowledgeBaseAnswer(question: string): Promise<string> {
    try {
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
              systemInstruction: KB_SYSTEM_INSTRUCTION,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting knowledge base answer:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get answer: ${error.message}`);
        }
        throw new Error("Failed to get answer due to an unknown error.");
    }
  }

  async streamAnalysisForBias(
    text: string, 
    customKeywords: string | undefined, 
    onStream: (chunk: string) => void
  ): Promise<{ analysis: BiasAnalysisResult | null, sources: GroundingChunk[] }> {
    try {
      if (!text) {
        throw new Error("Text to analyze must be a non-empty string.");
      }
      let userPrompt = `Text to analyze:\n"${text}"`;

      if (customKeywords && customKeywords.trim().length > 0) {
          userPrompt = `Pay special attention to the following user-defined keywords and phrases for potential bias: "${customKeywords}".\n\n${userPrompt}`;
      }

      const responseStream = await this.ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{googleSearch: {}}],
          },
      });

      let fullResponseText = "";
      let finalResponse;

      for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if (chunkText) {
              fullResponseText += chunkText;
              onStream(fullResponseText);
          }
          finalResponse = chunk; // The last chunk contains the full metadata
      }
      
      const sources = finalResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!fullResponseText) {
          console.error("API returned an empty text response.");
          return { analysis: { findings: [] }, sources };
      }
      
      let jsonString = fullResponseText;
      
      // Regex to find JSON within a markdown code block
      const jsonRegex = /```(json)?\s*([\s\S]*?)\s*```/;
      const match = jsonRegex.exec(jsonString);
      
      if (match && match[2]) {
          jsonString = match[2].trim();
      } else {
          // If no code block, find the first '{' and last '}'
          const firstBrace = jsonString.indexOf('{');
          const lastBrace = jsonString.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
              jsonString = jsonString.substring(firstBrace, lastBrace + 1).trim();
          }
      }
      
      try {
        const analysis: BiasAnalysisResult = JSON.parse(jsonString);
        return { analysis, sources };
      } catch (parseError) {
        console.error("Failed to parse JSON response after cleaning:", jsonString, parseError);
        throw new Error("Failed to parse the analysis from the AI. The response was not valid JSON.");
      }

    } catch (error) {
      console.error("Error streaming analysis for bias:", error);
      if (error instanceof SyntaxError) {
          throw new Error("Failed to parse the analysis from the AI. The response was not valid JSON.");
      }
      if (error instanceof Error) {
        throw new Error(`Failed to analyze text: ${error.message}`);
      }
      throw new Error("Failed to analyze text due to an unknown error.");
    }
  }
      // Regex to find JSON within a markdown code block
}