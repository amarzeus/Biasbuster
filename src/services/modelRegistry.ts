import { BiasType } from '../types/bias';
import { biasDetectionConfig } from '../config/biasDetection';

interface ModelMetadata {
  version: string;
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'deprecated' | 'testing';
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    latency: number;
  };
  fairness: {
    demographicParity: number;
    equalOpportunity: number;
    equalizedOdds: number;
    disparateImpact: number;
  };
  trainingData: {
    size: number;
    sources: string[];
    demographics: Record<string, number>;
    biasDistribution: Record<BiasType, number>;
  };
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    optimizer: string;
    lossFunction: string;
  };
}

interface ModelArtifact {
  modelPath: string;
  tokenizerPath: string;
  configPath: string;
  metadata: ModelMetadata;
}

export class ModelRegistryService {
  private models: Map<string, ModelArtifact> = new Map();
  private activeModelVersion: string;

  constructor() {
    this.activeModelVersion = biasDetectionConfig.model.version;
  }

  /**
   * Registers a new model version
   */
  async registerModel(artifact: ModelArtifact): Promise<void> {
    try {
      // Validate model metadata
      this.validateModelMetadata(artifact.metadata);

      // Store model artifact
      this.models.set(artifact.metadata.version, artifact);

      // Update active version if this is the first model
      if (this.models.size === 1) {
        this.activeModelVersion = artifact.metadata.version;
      }

      // Save to persistent storage
      await this.persistModelRegistry();
    } catch (error) {
      console.error('Error registering model:', error);
      throw new Error('Failed to register model');
    }
  }

  /**
   * Updates model status
   */
  async updateModelStatus(version: string, status: ModelMetadata['status']): Promise<void> {
    const model = this.models.get(version);
    if (!model) {
      throw new Error(`Model version ${version} not found`);
    }

    model.metadata.status = status;
    model.metadata.lastUpdated = new Date().toISOString();

    await this.persistModelRegistry();
  }

  /**
   * Sets active model version
   */
  async setActiveModel(version: string): Promise<void> {
    const model = this.models.get(version);
    if (!model) {
      throw new Error(`Model version ${version} not found`);
    }

    if (model.metadata.status !== 'active') {
      throw new Error(`Cannot set inactive model ${version} as active`);
    }

    this.activeModelVersion = version;
    await this.persistModelRegistry();
  }

  /**
   * Gets active model artifact
   */
  getActiveModel(): ModelArtifact {
    const model = this.models.get(this.activeModelVersion);
    if (!model) {
      throw new Error('No active model found');
    }
    return model;
  }

  /**
   * Lists all registered models
   */
  listModels(): ModelMetadata[] {
    return Array.from(this.models.values()).map(artifact => artifact.metadata);
  }

  /**
   * Gets model performance history
   */
  async getModelPerformanceHistory(version: string): Promise<ModelMetadata['performance'][]> {
    // TODO: Implement performance history tracking
    return [];
  }

  /**
   * Validates model metadata
   */
  private validateModelMetadata(metadata: ModelMetadata): void {
    // Validate version format
    if (!/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      throw new Error('Invalid version format');
    }

    // Validate performance metrics
    const { accuracy, precision, recall, f1Score } = metadata.performance;
    if (!this.isValidMetric(accuracy) || !this.isValidMetric(precision) ||
        !this.isValidMetric(recall) || !this.isValidMetric(f1Score)) {
      throw new Error('Invalid performance metrics');
    }

    // Validate fairness metrics
    const { demographicParity, equalOpportunity, equalizedOdds, disparateImpact } = metadata.fairness;
    if (!this.isValidMetric(demographicParity) || !this.isValidMetric(equalOpportunity) ||
        !this.isValidMetric(equalizedOdds) || !this.isValidMetric(disparateImpact)) {
      throw new Error('Invalid fairness metrics');
    }
  }

  /**
   * Validates metric value
   */
  private isValidMetric(value: number): boolean {
    return value >= 0 && value <= 1;
  }

  /**
   * Persists model registry to storage
   */
  private async persistModelRegistry(): Promise<void> {
    // TODO: Implement persistence to database or file system
  }

  /**
   * Loads model registry from storage
   */
  async loadModelRegistry(): Promise<void> {
    // TODO: Implement loading from database or file system
  }
} 