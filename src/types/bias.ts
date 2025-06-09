/**
 * Types for the Biasbuster bias detection engine
 */

export type SensitivityLevel = 'strict' | 'balanced' | 'lenient';

export interface DetectionOptions {
    sensitivity: SensitivityLevel;
    customKeywords: string[];
    highlightColor: string;
    language?: string;
    includeExplanations?: boolean;
    includeRewrites?: boolean;
    includeFairnessCheck?: boolean;
}

export interface BiasInstance {
    sentence: string;
    biasType: BiasType[];
    severity: number;
    explanation: string;
    justification: string;
    mitigation: string;
    biasPrinciple: string;
    trustedSources: string[];
}

export enum BiasType {
  GENDER = 'gender',
  RACIAL = 'racial',
  POLITICAL = 'political',
  RELIGIOUS = 'religious',
  ECONOMIC = 'economic',
  CULTURAL = 'cultural',
  LANGUAGE = 'language',
  FRAMING = 'framing',
  OMISSION = 'omission',
  OTHER = 'other'
}

export interface SentimentAnalysis {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
    emotionalTone: string[];
}

export interface SourceCredibility {
    score: number;
    factors: string[];
    recommendations: string[];
}

export interface TextAnalysis {
  biasTypes: BiasType[];
  severity: number; // 0-1 scale
  explanation: string;
  highlightedText: string;
  context?: string;
  metadata?: Record<string, any>;
}

export interface BiasAnalysisResult {
  text: string;
  analysis: TextAnalysis;
  timestamp: string;
  confidence: number;
  suggestions: string[];
  metadata?: Record<string, any>;
}

export interface BiasDetectionConfig {
  sensitivity: number; // 0-1 scale
  enabledBiasTypes: BiasType[];
  customKeywords?: string[];
  language?: string;
  context?: string;
}

export interface BiasResult {
    mainTopic: string;
    biasDetected: boolean;
    biasInstances: BiasInstance[];
    biasSummary: string;
    alternativePerspectives: string[];
    educationalContent: string;
    userCustomKeywordsFound: string[];
    sentimentAnalysis: SentimentAnalysis;
    sourceCredibility: SourceCredibility;
    languageDetected: string;
    fairnessSelfCheck: string;
} 