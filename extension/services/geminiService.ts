
import { GoogleGenAI } from "@google/genai";
import { BiasAnalysisResult, GroundingChunk } from '../types';

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

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API_KEY is required to initialize GeminiService.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async streamAnalysisForBias(
    text: string, 
    customKeywords: string | undefined,
    onStream: (chunk: string) => void
  ): Promise<{ analysis: BiasAnalysisResult, sources: GroundingChunk[] }> {
    try {
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
          finalResponse = chunk;
      }
      
      const sources = finalResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!fullResponseText) {
          return { analysis: { findings: [] }, sources };
      }
      
      let jsonString = fullResponseText;
      const jsonRegex = /```(json)?\s*([\s\S]*?)\s*```/;
      const match = jsonRegex.exec(jsonString);
      
      if (match && match[2]) {
          jsonString = match[2].trim();
      } else {
          const firstBrace = jsonString.indexOf('{');
          const lastBrace = jsonString.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
              jsonString = jsonString.substring(firstBrace, lastBrace + 1).trim();
          }
      }
      
      const analysis: BiasAnalysisResult = JSON.parse(jsonString);
      return { analysis, sources };

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
}