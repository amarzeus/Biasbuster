import { GoogleGenAI } from "@google/genai";
import { BiasAnalysisResult, GroundingChunk, APIError, MediaAnalysis, EnhancedBiasFinding, AnalysisOptions, BiasSeverity } from '../types';

const SYSTEM_INSTRUCTION = `
Analyze the provided input for any form of bias (Framing, Omission, Spin, Unsubstantiated Claim, Stereotyping, Loaded Language, Confirmation Bias, Selection Bias, Statistical Bias).
For each instance of bias found, provide the following with enhanced details:
1. "biasedPhrase": The exact phrase from the original text that exhibits bias. Must be a substring of the original text.
2. "explanation": A clear, concise explanation of why this phrase is considered biased.
3. "biasType": The category of bias (use exact enum values).
4. "suggestion": A neutral, unbiased alternative to the phrase.
5. "severity": Object with level (low/medium/high/critical), confidence (0-1), impact (minor/moderate/significant).
6. "context": Surrounding context where the bias appears.
7. "alternatives": Array of alternative neutral phrases.
8. "sources": Array of grounding chunks for verification.
9. "tags": Array of relevant tags for categorization.

Respond with ONLY a valid JSON object in the following format. Do not include any other text, explanations, or markdown formatting outside of the JSON object.

{
  "findings": [
    {
      "biasedPhrase": "string",
      "explanation": "string",
      "biasType": "framing",
      "suggestion": "string",
      "severity": {"level": "medium", "confidence": 0.85, "impact": "moderate"},
      "context": "string",
      "alternatives": ["string"],
      "sources": [{"web": {"uri": "string", "title": "string"}}],
      "tags": ["string"]
    }
  ]
}
`;

const MULTI_MODAL_SYSTEM_INSTRUCTION = `
Analyze the provided media content for bias. Extract text from images/videos/audio if necessary, then analyze for bias types.
Provide detailed findings with severity scoring and confidence levels.
`;

export class EnhancedGeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey.trim()) {
      throw new Error("API_KEY is required to initialize EnhancedGeminiService.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeImage(imageFile: File): Promise<{ analysis: BiasAnalysisResult | null, sources: GroundingChunk[] }> {
    try {
      const imageData = await this.fileToBase64(imageFile);
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { text: "Analyze this image for bias content. Extract any text and analyze for bias patterns." },
          { inlineData: { mimeType: imageFile.type, data: imageData } }
        ],
        config: {
          systemInstruction: MULTI_MODAL_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!text) {
        return { analysis: { findings: [] }, sources };
      }

      const analysis: BiasAnalysisResult = JSON.parse(text);
      return { analysis, sources };
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeVideo(videoFile: File): Promise<{ analysis: BiasAnalysisResult | null, sources: GroundingChunk[] }> {
    // For now, extract frames or use basic analysis
    // In full implementation, would use video processing libraries
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze this video file for bias content. File: ${videoFile.name}, Size: ${videoFile.size} bytes`,
        config: {
          systemInstruction: MULTI_MODAL_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!text) {
        return { analysis: { findings: [] }, sources };
      }

      const analysis: BiasAnalysisResult = JSON.parse(text);
      return { analysis, sources };
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeAudio(audioFile: File): Promise<{ analysis: BiasAnalysisResult | null, sources: GroundingChunk[] }> {
    // For now, basic analysis - in full implementation would transcribe first
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze this audio file for bias content. File: ${audioFile.name}, Size: ${audioFile.size} bytes`,
        config: {
          systemInstruction: MULTI_MODAL_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!text) {
        return { analysis: { findings: [] }, sources };
      }

      const analysis: BiasAnalysisResult = JSON.parse(text);
      return { analysis, sources };
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw new Error(`Failed to analyze audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeWithContext(text: string, context: AnalysisOptions): Promise<{ analysis: BiasAnalysisResult | null, sources: GroundingChunk[] }> {
    try {
      if (!text) {
        throw new Error("Text to analyze must be a non-empty string.");
      }

      let userPrompt = `Text to analyze:\n"${text}"`;

      if (context.customKeywords && context.customKeywords.trim().length > 0) {
        userPrompt = `Pay special attention to the following user-defined keywords and phrases for potential bias: "${context.customKeywords}".\n\n${userPrompt}`;
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const textResponse = response.text;
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      if (!textResponse) {
        return { analysis: { findings: [] }, sources };
      }

      const analysis: BiasAnalysisResult = JSON.parse(textResponse);
      return { analysis, sources };
    } catch (error) {
      console.error("Error in enhanced analysis:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the analysis from the AI. The response was not valid JSON.");
      }
      if (error instanceof Error) {
        throw new Error(`Failed to analyze text: ${error.message}`);
      }
      throw new Error("Failed to analyze text due to an unknown error.");
    }
  }

  async submitFeedback(feedback: { findingId: string; vote: 'up' | 'down'; userId?: string }): Promise<void> {
    // In a real implementation, this would send feedback to improve the model
    // For now, just log it
    console.log("Feedback submitted:", feedback);
    // Could store in local storage or send to analytics service
  }

  async batchAnalyze(texts: string[]): Promise<BiasAnalysisResult[]> {
    const results: BiasAnalysisResult[] = [];

    for (const text of texts) {
      try {
        const { analysis } = await this.analyzeWithContext(text, {});
        results.push(analysis || { findings: [] });
      } catch (error) {
        console.error(`Error analyzing text in batch: ${text.substring(0, 50)}...`, error);
        results.push({ findings: [] });
      }
    }

    return results;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
