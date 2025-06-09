import { BiasType } from '../types/bias';

export const modelTrainingConfig = {
  // Model architectures
  architectures: {
    transformer: {
      base: {
        layers: 6,
        hiddenSize: 768,
        attentionHeads: 12,
        dropout: 0.1,
        activation: 'gelu',
        normalization: 'layer',
        embeddingSize: 768,
        maxSequenceLength: 512,
        vocabularySize: 30000
      },
      large: {
        layers: 12,
        hiddenSize: 1024,
        attentionHeads: 16,
        dropout: 0.1,
        activation: 'gelu',
        normalization: 'layer',
        embeddingSize: 1024,
        maxSequenceLength: 512,
        vocabularySize: 30000
      }
    },
    cnn: {
      base: {
        layers: 4,
        hiddenSize: 512,
        attentionHeads: 0,
        dropout: 0.2,
        activation: 'relu',
        normalization: 'batch',
        embeddingSize: 300,
        maxSequenceLength: 256,
        vocabularySize: 30000
      }
    },
    rnn: {
      base: {
        layers: 3,
        hiddenSize: 512,
        attentionHeads: 0,
        dropout: 0.2,
        activation: 'tanh',
        normalization: 'layer',
        embeddingSize: 300,
        maxSequenceLength: 256,
        vocabularySize: 30000
      }
    },
    hybrid: {
      base: {
        layers: 4,
        hiddenSize: 768,
        attentionHeads: 8,
        dropout: 0.15,
        activation: 'gelu',
        normalization: 'layer',
        embeddingSize: 512,
        maxSequenceLength: 384,
        vocabularySize: 30000
      }
    }
  },

  // Training configurations
  training: {
    default: {
      batchSize: 32,
      epochs: 10,
      learningRate: 1e-4,
      optimizer: 'adamw',
      lossFunction: 'crossEntropy',
      earlyStopping: {
        patience: 3,
        minDelta: 0.001
      }
    },
    large: {
      batchSize: 16,
      epochs: 20,
      learningRate: 5e-5,
      optimizer: 'adamw',
      lossFunction: 'crossEntropy',
      earlyStopping: {
        patience: 5,
        minDelta: 0.0005
      }
    }
  },

  // Hyperparameter search configurations
  hyperparameterSearch: {
    default: {
      method: 'bayesian',
      parameters: {
        learningRate: { min: 1e-5, max: 1e-3 },
        batchSize: [16, 32, 64, 128],
        dropout: { min: 0.1, max: 0.5 },
        hiddenSize: [256, 512, 768, 1024]
      },
      maxTrials: 10,
      metric: 'f1'
    },
    extensive: {
      method: 'bayesian',
      parameters: {
        learningRate: { min: 1e-6, max: 1e-2 },
        batchSize: [8, 16, 32, 64, 128, 256],
        dropout: { min: 0.05, max: 0.7 },
        hiddenSize: [128, 256, 512, 768, 1024, 2048]
      },
      maxTrials: 20,
      metric: 'f1'
    }
  },

  // Distributed training configurations
  distributed: {
    default: {
      enabled: false,
      strategy: 'dataParallel',
      numWorkers: 1
    },
    large: {
      enabled: true,
      strategy: 'hybrid',
      numWorkers: 4
    }
  },

  // Model initialization configurations
  initialization: {
    default: {
      device: 'cpu',
      precision: 'float32',
      quantization: {
        enabled: false
      }
    },
    optimized: {
      device: 'gpu',
      precision: 'float16',
      quantization: {
        enabled: true,
        method: 'int8'
      }
    }
  },

  // Bias detection configurations
  biasDetection: {
    thresholds: {
      [BiasType.GENDER]: 0.7,
      [BiasType.RACE]: 0.7,
      [BiasType.AGE]: 0.7,
      [BiasType.RELIGION]: 0.7,
      [BiasType.NATIONALITY]: 0.7,
      [BiasType.DISABILITY]: 0.7,
      [BiasType.SEXUAL_ORIENTATION]: 0.7,
      [BiasType.SOCIOECONOMIC]: 0.7,
      [BiasType.POLITICAL]: 0.7,
      [BiasType.PROFESSIONAL]: 0.7
    },
    metrics: {
      accuracy: 0.85,
      precision: 0.8,
      recall: 0.8,
      f1Score: 0.8
    }
  },

  // Data preprocessing configurations
  preprocessing: {
    text: {
      maxLength: 512,
      minLength: 10,
      truncation: true,
      padding: true,
      lowercase: true,
      removePunctuation: true,
      removeNumbers: false,
      removeStopwords: false
    },
    image: {
      maxSize: 224,
      minSize: 32,
      channels: 3,
      normalize: true,
      augmentation: {
        enabled: true,
        rotation: 15,
        flip: true,
        brightness: 0.2,
        contrast: 0.2
      }
    }
  },

  // Model evaluation configurations
  evaluation: {
    metrics: ['accuracy', 'precision', 'recall', 'f1', 'fairness'],
    crossValidation: {
      folds: 5,
      stratified: true
    },
    biasMetrics: {
      demographicParity: true,
      equalOpportunity: true,
      equalizedOdds: true,
      disparateImpact: true
    }
  },

  // Model registry configurations
  registry: {
    storage: {
      type: 'local',
      path: './models'
    },
    versioning: {
      enabled: true,
      format: 'semantic'
    },
    metadata: {
      required: [
        'version',
        'createdAt',
        'lastUpdated',
        'status',
        'performance',
        'fairness',
        'trainingData',
        'hyperparameters'
      ]
    }
  }
}; 