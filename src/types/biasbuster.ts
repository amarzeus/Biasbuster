export interface BiasInstance {
    Sentence: string;
    BiasType: string;
    Explanation: string;
    Severity: string;
    Justification: string;
    Mitigation: string;
}

export interface BiasBusterResponse {
    MainTopic: string;
    BiasDetected: string;
    BiasInstances: BiasInstance[];
    BiasSummary: string;
    TrustedSources: string[];
    EducationalContent: string;
}

export interface AnalysisOptions {
    detectPoliticalBias?: boolean;
    detectGenderBias?: boolean;
    detectRacialBias?: boolean;
    detectCulturalBias?: boolean;
    sensitivity?: 'low' | 'medium' | 'high';
    includeExplanations?: boolean;
    includeMitigations?: boolean;
    includeEducationalContent?: boolean;
}

export interface AnalysisResult {
    id: string;
    text: string;
    url?: string;
    analysis: BiasBusterResponse;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isAnalyst: boolean;
    preferences: {
        biasTypes: string[];
        sensitivity: 'low' | 'medium' | 'high';
        notifications: boolean;
    };
}

export interface BiasMetrics {
    totalAnalyses: number;
    biasDetectionRate: number;
    commonBiasTypes: {
        type: string;
        count: number;
    }[];
    averageSeverity: number;
    mitigationSuccessRate: number;
}

export interface EducationalResource {
    id: string;
    title: string;
    description: string;
    type: 'article' | 'video' | 'infographic';
    content: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    relatedBiasTypes: string[];
}
