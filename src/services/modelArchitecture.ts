import { BiasType } from '../types/bias';
import { biasDetectionConfig } from '../config/biasDetection';

interface ModelArchitecture {
  type: 'transformer' | 'cnn' | 'rnn' | 'hybrid';
  config: {
    layers: number;
    hiddenSize: number;
    attentionHeads: number;
    dropout: number;
    activation: string;
    normalization: string;
    embeddingSize: number;
    maxSequenceLength: number;
    vocabularySize: number;
  };
}

interface ModelLayer {
  type: string;
  config: Record<string, any>;
  inputShape: number[];
  outputShape: number[];
}

export class ModelArchitectureService {
  private readonly architectures: Map<string, ModelArchitecture> = new Map();

  constructor() {
    this.initializeDefaultArchitectures();
  }

  /**
   * Initializes default model architectures
   */
  private initializeDefaultArchitectures(): void {
    // Transformer architecture
    this.architectures.set('transformer-base', {
      type: 'transformer',
      config: {
        layers: 6,
        hiddenSize: 768,
        attentionHeads: 12,
        dropout: 0.1,
        activation: 'gelu',
        normalization: 'layer',
        embeddingSize: 768,
        maxSequenceLength: 512,
        vocabularySize: 30000
      }
    });

    // CNN architecture
    this.architectures.set('cnn-base', {
      type: 'cnn',
      config: {
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
    });

    // RNN architecture
    this.architectures.set('rnn-base', {
      type: 'rnn',
      config: {
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
    });

    // Hybrid architecture
    this.architectures.set('hybrid-base', {
      type: 'hybrid',
      config: {
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
    });
  }

  /**
   * Gets model architecture
   */
  getArchitecture(type: string): ModelArchitecture {
    const architecture = this.architectures.get(type);
    if (!architecture) {
      throw new Error(`Architecture ${type} not found`);
    }
    return architecture;
  }

  /**
   * Creates custom architecture
   */
  createArchitecture(
    type: 'transformer' | 'cnn' | 'rnn' | 'hybrid',
    config: Partial<ModelArchitecture['config']>
  ): ModelArchitecture {
    const baseArchitecture = this.getArchitecture(`${type}-base`);
    const customArchitecture: ModelArchitecture = {
      type,
      config: {
        ...baseArchitecture.config,
        ...config
      }
    };

    const architectureId = `${type}-custom-${Date.now()}`;
    this.architectures.set(architectureId, customArchitecture);

    return customArchitecture;
  }

  /**
   * Generates model layers
   */
  generateLayers(architecture: ModelArchitecture): ModelLayer[] {
    const layers: ModelLayer[] = [];

    // Add embedding layer
    layers.push({
      type: 'embedding',
      config: {
        inputDim: architecture.config.vocabularySize,
        outputDim: architecture.config.embeddingSize,
        inputLength: architecture.config.maxSequenceLength
      },
      inputShape: [architecture.config.maxSequenceLength],
      outputShape: [architecture.config.maxSequenceLength, architecture.config.embeddingSize]
    });

    // Add architecture-specific layers
    switch (architecture.type) {
      case 'transformer':
        layers.push(...this.generateTransformerLayers(architecture));
        break;
      case 'cnn':
        layers.push(...this.generateCNNLayers(architecture));
        break;
      case 'rnn':
        layers.push(...this.generateRNNLayers(architecture));
        break;
      case 'hybrid':
        layers.push(...this.generateHybridLayers(architecture));
        break;
    }

    return layers;
  }

  /**
   * Generates transformer layers
   */
  private generateTransformerLayers(architecture: ModelArchitecture): ModelLayer[] {
    const layers: ModelLayer[] = [];

    for (let i = 0; i < architecture.config.layers; i++) {
      // Multi-head attention
      layers.push({
        type: 'multiHeadAttention',
        config: {
          numHeads: architecture.config.attentionHeads,
          keyDim: architecture.config.hiddenSize / architecture.config.attentionHeads,
          valueDim: architecture.config.hiddenSize / architecture.config.attentionHeads,
          dropout: architecture.config.dropout
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize],
        outputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
      });

      // Feed-forward network
      layers.push({
        type: 'feedForward',
        config: {
          units: architecture.config.hiddenSize * 4,
          activation: architecture.config.activation,
          dropout: architecture.config.dropout
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize],
        outputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
      });

      // Layer normalization
      layers.push({
        type: 'layerNormalization',
        config: {
          epsilon: 1e-6
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize],
        outputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
      });
    }

    return layers;
  }

  /**
   * Generates CNN layers
   */
  private generateCNNLayers(architecture: ModelArchitecture): ModelLayer[] {
    const layers: ModelLayer[] = [];

    for (let i = 0; i < architecture.config.layers; i++) {
      // Convolutional layer
      layers.push({
        type: 'conv1d',
        config: {
          filters: architecture.config.hiddenSize,
          kernelSize: 3,
          activation: architecture.config.activation,
          padding: 'same'
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.embeddingSize],
        outputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
      });

      // Pooling layer
      layers.push({
        type: 'maxPooling1d',
        config: {
          poolSize: 2,
          strides: 2
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize],
        outputShape: [architecture.config.maxSequenceLength / 2, architecture.config.hiddenSize]
      });

      // Batch normalization
      layers.push({
        type: 'batchNormalization',
        config: {
          epsilon: 1e-6
        },
        inputShape: [architecture.config.maxSequenceLength / 2, architecture.config.hiddenSize],
        outputShape: [architecture.config.maxSequenceLength / 2, architecture.config.hiddenSize]
      });
    }

    return layers;
  }

  /**
   * Generates RNN layers
   */
  private generateRNNLayers(architecture: ModelArchitecture): ModelLayer[] {
    const layers: ModelLayer[] = [];

    for (let i = 0; i < architecture.config.layers; i++) {
      // LSTM layer
      layers.push({
        type: 'lstm',
        config: {
          units: architecture.config.hiddenSize,
          returnSequences: i < architecture.config.layers - 1,
          dropout: architecture.config.dropout,
          recurrentDropout: architecture.config.dropout
        },
        inputShape: [architecture.config.maxSequenceLength, architecture.config.embeddingSize],
        outputShape: i < architecture.config.layers - 1
          ? [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
          : [architecture.config.hiddenSize]
      });

      // Layer normalization
      if (i < architecture.config.layers - 1) {
        layers.push({
          type: 'layerNormalization',
          config: {
            epsilon: 1e-6
          },
          inputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize],
          outputShape: [architecture.config.maxSequenceLength, architecture.config.hiddenSize]
        });
      }
    }

    return layers;
  }

  /**
   * Generates hybrid layers
   */
  private generateHybridLayers(architecture: ModelArchitecture): ModelLayer[] {
    const layers: ModelLayer[] = [];

    // Add CNN layers for local feature extraction
    layers.push(...this.generateCNNLayers({
      type: 'cnn',
      config: {
        ...architecture.config,
        layers: Math.floor(architecture.config.layers / 2)
      }
    }));

    // Add transformer layers for global context
    layers.push(...this.generateTransformerLayers({
      type: 'transformer',
      config: {
        ...architecture.config,
        layers: Math.ceil(architecture.config.layers / 2)
      }
    }));

    return layers;
  }

  /**
   * Validates architecture configuration
   */
  validateArchitecture(architecture: ModelArchitecture): boolean {
    // Validate basic parameters
    if (architecture.config.layers <= 0) return false;
    if (architecture.config.hiddenSize <= 0) return false;
    if (architecture.config.attentionHeads < 0) return false;
    if (architecture.config.dropout < 0 || architecture.config.dropout > 1) return false;
    if (architecture.config.embeddingSize <= 0) return false;
    if (architecture.config.maxSequenceLength <= 0) return false;
    if (architecture.config.vocabularySize <= 0) return false;

    // Validate architecture-specific parameters
    switch (architecture.type) {
      case 'transformer':
        if (architecture.config.hiddenSize % architecture.config.attentionHeads !== 0) return false;
        break;
      case 'cnn':
        if (architecture.config.attentionHeads !== 0) return false;
        break;
      case 'rnn':
        if (architecture.config.attentionHeads !== 0) return false;
        break;
      case 'hybrid':
        if (architecture.config.attentionHeads <= 0) return false;
        break;
      default:
        return false;
    }

    return true;
  }

  /**
   * Gets architecture summary
   */
  getArchitectureSummary(architecture: ModelArchitecture): string {
    const layers = this.generateLayers(architecture);
    const totalParams = layers.reduce((sum, layer) => {
      // Calculate parameters based on layer type
      switch (layer.type) {
        case 'embedding':
          return sum + layer.config.inputDim * layer.config.outputDim;
        case 'multiHeadAttention':
          return sum + 4 * layer.config.keyDim * layer.config.numHeads;
        case 'feedForward':
          return sum + layer.config.units * 2;
        case 'conv1d':
          return sum + layer.config.filters * layer.config.kernelSize;
        case 'lstm':
          return sum + 4 * layer.config.units * layer.config.units;
        default:
          return sum;
      }
    }, 0);

    return `
Architecture Summary
==================
Type: ${architecture.type}
Total Parameters: ${totalParams.toLocaleString()}

Configuration:
- Layers: ${architecture.config.layers}
- Hidden Size: ${architecture.config.hiddenSize}
- Attention Heads: ${architecture.config.attentionHeads}
- Dropout: ${architecture.config.dropout}
- Activation: ${architecture.config.activation}
- Normalization: ${architecture.config.normalization}
- Embedding Size: ${architecture.config.embeddingSize}
- Max Sequence Length: ${architecture.config.maxSequenceLength}
- Vocabulary Size: ${architecture.config.vocabularySize}

Layer Structure:
${layers.map((layer, i) => `
Layer ${i + 1}: ${layer.type}
- Input Shape: ${layer.inputShape.join('x')}
- Output Shape: ${layer.outputShape.join('x')}
- Config: ${JSON.stringify(layer.config, null, 2)}
`).join('\n')}
    `;
  }
} 