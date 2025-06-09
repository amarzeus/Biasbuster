import { BiasInstance, SentimentAnalysis, SourceCredibility } from '../types/bias';
import { callAI } from './aiService';

export interface ExplanationResult {
  explanation: string;
  confidence: number;
  evidence: string[];
  recommendations: string[];
  relatedConcepts: string[];
  visualizations?: {
    type: string;
    data: any;
  }[];
}

export class ExplainableAIService {
  /**
   * Generate a detailed explanation for a bias instance
   */
  async explainBiasInstance(biasInstance: BiasInstance): Promise<ExplanationResult> {
    const prompt = this.constructBiasExplanationPrompt(biasInstance);
    const response = await callAI(prompt, {
      includeSentiment: true,
      includeCredibility: true
    });

    return {
      explanation: response.BiasSummary,
      confidence: this.calculateConfidence(response),
      evidence: response.TrustedSources,
      recommendations: response.BiasInstances.map(instance => instance.Mitigation),
      relatedConcepts: this.extractRelatedConcepts(response),
      visualizations: this.generateVisualizations(response)
    };
  }

  /**
   * Generate a detailed explanation for sentiment analysis
   */
  async explainSentiment(sentiment: SentimentAnalysis): Promise<ExplanationResult> {
    const prompt = this.constructSentimentExplanationPrompt(sentiment);
    const response = await callAI(prompt, {
      includeSentiment: true
    });

    return {
      explanation: response.BiasSummary,
      confidence: this.calculateConfidence(response),
      evidence: response.TrustedSources,
      recommendations: response.BiasInstances.map(instance => instance.Mitigation),
      relatedConcepts: this.extractRelatedConcepts(response),
      visualizations: this.generateVisualizations(response)
    };
  }

  /**
   * Generate a detailed explanation for source credibility
   */
  async explainCredibility(credibility: SourceCredibility): Promise<ExplanationResult> {
    const prompt = this.constructCredibilityExplanationPrompt(credibility);
    const response = await callAI(prompt, {
      includeCredibility: true
    });

    return {
      explanation: response.BiasSummary,
      confidence: this.calculateConfidence(response),
      evidence: response.TrustedSources,
      recommendations: response.BiasInstances.map(instance => instance.Mitigation),
      relatedConcepts: this.extractRelatedConcepts(response),
      visualizations: this.generateVisualizations(response)
    };
  }

  /**
   * Construct a prompt for explaining bias instances
   */
  private constructBiasExplanationPrompt(biasInstance: BiasInstance): string {
    return `
SYSTEM: You are an expert in bias detection and explanation. Provide a detailed explanation for the following bias instance.

BIAS INSTANCE:
- Type: ${biasInstance.type}
- Severity: ${biasInstance.severity}
- Sentence: ${biasInstance.sentence}
- Current Explanation: ${biasInstance.explanation}
- Justification: ${biasInstance.justification}
- Mitigation: ${biasInstance.mitigation}

Please provide:
1. A clear, detailed explanation of why this is considered bias
2. Evidence and examples supporting the bias detection
3. Specific recommendations for improvement
4. Related concepts and principles
5. Visual representations if applicable

Format your response as valid JSON.`;
  }

  /**
   * Construct a prompt for explaining sentiment analysis
   */
  private constructSentimentExplanationPrompt(sentiment: SentimentAnalysis): string {
    return `
SYSTEM: You are an expert in sentiment analysis and emotional intelligence. Explain the following sentiment analysis results.

SENTIMENT ANALYSIS:
- Overall: ${sentiment.overall}
- Score: ${sentiment.score}
- Emotional Tones: ${sentiment.emotionalTone.join(', ')}

Please provide:
1. A detailed explanation of the sentiment analysis
2. Evidence and examples supporting the analysis
3. Recommendations for balanced communication
4. Related emotional intelligence concepts
5. Visual representations if applicable

Format your response as valid JSON.`;
  }

  /**
   * Construct a prompt for explaining source credibility
   */
  private constructCredibilityExplanationPrompt(credibility: SourceCredibility): string {
    return `
SYSTEM: You are an expert in source credibility and media literacy. Explain the following credibility assessment.

CREDIBILITY ASSESSMENT:
- Score: ${credibility.score}
- Factors: ${credibility.factors.join(', ')}
- Recommendations: ${credibility.recommendations.join(', ')}

Please provide:
1. A detailed explanation of the credibility assessment
2. Evidence and examples supporting the assessment
3. Recommendations for improving credibility
4. Related media literacy concepts
5. Visual representations if applicable

Format your response as valid JSON.`;
  }

  /**
   * Calculate confidence score based on response quality
   */
  private calculateConfidence(response: any): number {
    let confidence = 0.5; // Base confidence

    // Adjust based on response quality
    if (response.BiasInstances?.length > 0) confidence += 0.1;
    if (response.TrustedSources?.length > 0) confidence += 0.1;
    if (response.BiasSummary?.length > 100) confidence += 0.1;
    if (response.EducationalContent?.length > 100) confidence += 0.1;

    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }

  /**
   * Extract related concepts from the response
   */
  private extractRelatedConcepts(response: any): string[] {
    const concepts = new Set<string>();

    // Extract from bias instances
    response.BiasInstances?.forEach((instance: any) => {
      if (instance.BiasType) concepts.add(instance.BiasType);
      if (instance.Explanation) {
        const words = instance.Explanation.split(' ');
        words.forEach((word: string) => {
          if (word.length > 5 && /^[A-Z]/.test(word)) {
            concepts.add(word);
          }
        });
      }
    });

    // Extract from summary
    if (response.BiasSummary) {
      const words = response.BiasSummary.split(' ');
      words.forEach((word: string) => {
        if (word.length > 5 && /^[A-Z]/.test(word)) {
          concepts.add(word);
        }
      });
    }

    return Array.from(concepts);
  }

  /**
   * Generate visualizations for the response
   */
  private generateVisualizations(response: any): { type: string; data: any }[] {
    const visualizations = [];

    // Bias type distribution
    if (response.BiasInstances?.length > 0) {
      const biasTypes = response.BiasInstances.reduce((acc: any, instance: any) => {
        acc[instance.BiasType] = (acc[instance.BiasType] || 0) + 1;
        return acc;
      }, {});

      visualizations.push({
        type: 'biasTypeDistribution',
        data: {
          labels: Object.keys(biasTypes),
          values: Object.values(biasTypes)
        }
      });
    }

    // Sentiment analysis visualization
    if (response.SentimentAnalysis) {
      visualizations.push({
        type: 'sentimentAnalysis',
        data: {
          overall: response.SentimentAnalysis.Overall,
          score: response.SentimentAnalysis.Score,
          emotionalTones: response.SentimentAnalysis.EmotionalTone
        }
      });
    }

    // Source credibility visualization
    if (response.SourceCredibility) {
      visualizations.push({
        type: 'sourceCredibility',
        data: {
          score: response.SourceCredibility.Score,
          factors: response.SourceCredibility.Factors,
          recommendations: response.SourceCredibility.Recommendations
        }
      });
    }

    return visualizations;
  }
}
