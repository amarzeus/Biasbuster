import { BiasAnalysisResult, BiasInstance, SentimentAnalysis, SourceCredibility } from '../types/bias';
import { callAI } from './aiService';

export class BiasDetectionService {
  private readonly modelEndpoint: string;
  private readonly apiKey: string;

  constructor(modelEndpoint: string, apiKey: string) {
    this.modelEndpoint = modelEndpoint;
    this.apiKey = apiKey;
  }

  /**
   * Analyzes text for bias and returns comprehensive results
   */
  async analyzeText(text: string, options: {
    sensitivity?: 'strict' | 'balanced' | 'lenient';
    customKeywords?: string[];
    highlightColor?: string;
  } = {}): Promise<BiasAnalysisResult> {
    try {
      // Construct the prompt for bias analysis
      const prompt = this.constructBiasAnalysisPrompt(text, options);
      
      // Call the AI service with the prompt
      const response = await callAI(prompt, {
        includeSentiment: true,
        includeCredibility: true
      });

      // Process and validate the response
      const biasInstances = await this.detectBiasTypes(text);
      const sentimentAnalysis = await this.analyzeSentiment(text);
      const sourceCredibility = await this.evaluateCredibility(text);
      
      return {
        mainTopic: response.MainTopic,
        biasDetected: response.BiasDetected,
        biasInstances: [...response.BiasInstances, ...biasInstances],
        biasSummary: response.BiasSummary,
        alternativePerspectives: response.TrustedSources,
        educationalContent: response.EducationalContent,
        userCustomKeywordsFound: this.findCustomKeywords(text, options.customKeywords || []),
        sentimentAnalysis: {
          overall: response.SentimentAnalysis?.Overall || sentimentAnalysis.overall,
          score: response.SentimentAnalysis?.Score || sentimentAnalysis.score,
          emotionalTone: response.SentimentAnalysis?.EmotionalTone || sentimentAnalysis.emotionalTone
        },
        sourceCredibility: {
          score: response.SourceCredibility?.Score || sourceCredibility.score,
          factors: response.SourceCredibility?.Factors || sourceCredibility.factors,
          recommendations: response.SourceCredibility?.Recommendations || sourceCredibility.recommendations
        },
        languageDetected: response.LanguageDetected || 'en'
      };
    } catch (error) {
      console.error('Error in bias detection:', error);
      throw new Error('Failed to analyze text for bias');
    }
  }

  /**
   * Detects specific types of bias in text
   */
  private async detectBiasTypes(text: string): Promise<BiasInstance[]> {
    const biasTypes = [
      'framing',
      'omission',
      'selection',
      'confirmation',
      'anchoring',
      'availability',
      'hindsight',
      'negativity',
      'optimism',
      'status-quo',
      'sunk-cost',
      'bandwagon',
      'halo',
      'horn',
      'recency',
      'primacy',
      'stereotyping',
      'ingroup',
      'outgroup',
      'implicit'
    ];

    const biasInstances: BiasInstance[] = [];

    for (const biasType of biasTypes) {
      const prompt = this.constructBiasTypePrompt(text, biasType);
      const response = await callAI(prompt);
      
      if (response.BiasDetected === 'yes') {
        biasInstances.push(...response.BiasInstances.map(instance => ({
          ...instance,
          type: biasType
        })));
      }
    }

    return biasInstances;
  }

  /**
   * Analyzes sentiment and emotional tone
   */
  private async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const prompt = this.constructSentimentPrompt(text);
    const response = await callAI(prompt, { includeSentiment: true });
    
    return {
      overall: response.SentimentAnalysis?.Overall || 'neutral',
      score: response.SentimentAnalysis?.Score || 0,
      emotionalTone: response.SentimentAnalysis?.EmotionalTone || []
    };
  }

  /**
   * Evaluates source credibility
   */
  private async evaluateCredibility(text: string): Promise<SourceCredibility> {
    const prompt = this.constructCredibilityPrompt(text);
    const response = await callAI(prompt, { includeCredibility: true });
    
    return {
      score: response.SourceCredibility?.Score || 0,
      factors: response.SourceCredibility?.Factors || [],
      recommendations: response.SourceCredibility?.Recommendations || []
    };
  }

  /**
   * Constructs the main bias analysis prompt
   */
  private constructBiasAnalysisPrompt(text: string, options: any): string {
    return `
SYSTEM: You are an expert bias detection AI. Analyze the following text for bias, considering:
1. Main topic and context
2. Potential bias types (framing, omission, selection, etc.)
3. Severity and impact of detected bias
4. Alternative perspectives
5. Educational content for understanding the bias

ARTICLE TO ANALYZE:
${text}

ANALYSIS OPTIONS:
- Sensitivity: ${options.sensitivity || 'balanced'}
- Custom Keywords: ${options.customKeywords?.join(', ') || 'none'}
- Highlight Color: ${options.highlightColor || 'red'}

Provide a structured analysis in JSON format.`;
  }

  /**
   * Constructs a prompt for detecting specific bias types
   */
  private constructBiasTypePrompt(text: string, biasType: string): string {
    return `
SYSTEM: You are an expert bias detection AI. Analyze the following text specifically for ${biasType} bias.

ARTICLE TO ANALYZE:
${text}

Focus on:
1. Identifying instances of ${biasType} bias
2. Explaining how each instance demonstrates this bias type
3. Providing specific examples and context
4. Suggesting ways to mitigate this bias

Provide a structured analysis in JSON format.`;
  }

  /**
   * Constructs a prompt for sentiment analysis
   */
  private constructSentimentPrompt(text: string): string {
    return `
SYSTEM: You are an expert sentiment analysis AI. Analyze the emotional tone and sentiment of the following text.

ARTICLE TO ANALYZE:
${text}

Focus on:
1. Overall sentiment (positive/negative/neutral)
2. Sentiment score (-1 to 1)
3. Primary emotional tones
4. Changes in sentiment throughout the text

Provide a structured analysis in JSON format.`;
  }

  /**
   * Constructs a prompt for credibility evaluation
   */
  private constructCredibilityPrompt(text: string): string {
    return `
SYSTEM: You are an expert source credibility evaluator. Assess the credibility of the following text.

ARTICLE TO ANALYZE:
${text}

Focus on:
1. Use of facts vs. opinions
2. Citation of sources
3. Transparency of methods
4. Balance in perspectives
5. Presence of logical fallacies

Provide a structured analysis in JSON format.`;
  }

  /**
   * Finds custom keywords in the text
   */
  private findCustomKeywords(text: string, keywords: string[]): string[] {
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }
} 