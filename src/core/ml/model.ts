import { BiasType, BiasInstance } from '../../types/bias';

/**
 * Interface for ML models used in bias detection
 */
export interface BiasDetectionModel {
    /**
     * Initialize the model
     */
    initialize(): Promise<void>;

    /**
     * Detect bias in text
     */
    detectBias(text: string): Promise<BiasInstance[]>;

    /**
     * Get model metadata
     */
    getMetadata(): ModelMetadata;

    /**
     * Update model with new training data
     */
    update(trainingData: TrainingData): Promise<void>;

    /**
     * Perform fairness audit
     */
    auditFairness(): Promise<FairnessMetrics>;
}

export interface ModelMetadata {
    name: string;
    version: string;
    description: string;
    supportedBiasTypes: BiasType[];
    lastUpdated: Date;
    performance: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
}

export interface TrainingData {
    text: string;
    biasTypes: BiasType[];
    severity: number;
    explanation: string;
}

export interface FairnessMetrics {
    demographicParity: number;
    equalOpportunity: number;
    equalizedOdds: number;
    disparateImpact: number;
    biasMetrics: {
        [key in BiasType]?: number;
    };
}

/**
 * Base class for bias detection models
 */
export abstract class BaseBiasDetectionModel implements BiasDetectionModel {
    protected metadata: ModelMetadata;

    constructor(metadata: ModelMetadata) {
        this.metadata = metadata;
    }

    abstract initialize(): Promise<void>;
    abstract detectBias(text: string): Promise<BiasInstance[]>;
    abstract update(trainingData: TrainingData): Promise<void>;
    abstract auditFairness(): Promise<FairnessMetrics>;

    getMetadata(): ModelMetadata {
        return this.metadata;
    }
} 