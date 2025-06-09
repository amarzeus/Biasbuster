export interface ModelConfig {
  modelType: 'bert' | 'gpt' | 'custom';
  modelPath: string;
  version: string;
  parameters: {
    maxLength: number;
    batchSize: number;
    threshold: number;
    [key: string]: any;
  };
  features: {
    useContext: boolean;
    useSentiment: boolean;
    useEntityRecognition: boolean;
    [key: string]: boolean;
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  biasMetrics: {
    [key: string]: number;
  };
}

export interface ModelEvaluation {
  metrics: ModelMetrics;
  timestamp: string;
  dataset: string;
  version: string;
  notes?: string;
}

export interface ModelTrainingConfig {
  epochs: number;
  learningRate: number;
  validationSplit: number;
  earlyStopping: boolean;
  augmentation: boolean;
  customParameters?: Record<string, any>;
} 