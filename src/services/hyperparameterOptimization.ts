import { BiasType } from '../types/bias';
import { modelTrainingConfig } from '../config/modelTraining';
import * as tf from '@tensorflow/tfjs-node';
import * as bayes from 'bayes-opt';

interface HyperparameterConfig {
  method: 'grid' | 'random' | 'bayesian';
  parameters: {
    learningRate: { min: number; max: number; step?: number };
    batchSize: number[];
    dropout: { min: number; max: number; step?: number };
    hiddenSize: number[];
    layers: number[];
    attentionHeads: number[];
  };
  maxTrials: number;
  metric: 'accuracy' | 'f1' | 'fairness';
  earlyStopping?: {
    patience: number;
    minDelta: number;
  };
}

interface TrialResult {
  trialId: number;
  parameters: Record<string, any>;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    fairness: number;
    loss: number;
  };
  status: 'success' | 'failed';
  duration: number;
}

interface OptimizationResult {
  bestTrial: TrialResult;
  allTrials: TrialResult[];
  history: {
    trialId: number;
    parameters: Record<string, any>;
    metrics: Record<string, number>;
  }[];
  statistics: {
    totalTrials: number;
    successfulTrials: number;
    failedTrials: number;
    averageDuration: number;
    bestMetric: number;
  };
}

export class HyperparameterOptimizationService {
  private readonly config: HyperparameterConfig;
  private readonly trials: TrialResult[] = [];
  private readonly optimizer: any;

  constructor(config: Partial<HyperparameterConfig> = {}) {
    this.config = {
      method: 'bayesian',
      parameters: {
        learningRate: { min: 1e-5, max: 1e-3 },
        batchSize: [16, 32, 64, 128],
        dropout: { min: 0.1, max: 0.5 },
        hiddenSize: [256, 512, 768, 1024],
        layers: [2, 4, 6, 8],
        attentionHeads: [4, 8, 12, 16]
      },
      maxTrials: 10,
      metric: 'f1',
      ...config
    };

    // Initialize optimizer based on method
    this.optimizer = this.initializeOptimizer();
  }

  /**
   * Optimizes hyperparameters
   */
  async optimize(
    modelFn: (params: Record<string, any>) => Promise<tf.LayersModel>,
    trainFn: (model: tf.LayersModel, params: Record<string, any>) => Promise<{
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
      fairness: number;
      loss: number;
    }>
  ): Promise<OptimizationResult> {
    try {
      for (let trialId = 0; trialId < this.config.maxTrials; trialId++) {
        // Generate parameters
        const parameters = this.generateParameters();

        // Create and train model
        const startTime = Date.now();
        let metrics;
        let status: 'success' | 'failed' = 'success';

        try {
          const model = await modelFn(parameters);
          metrics = await trainFn(model, parameters);
        } catch (error) {
          console.error(`Trial ${trialId} failed:`, error);
          metrics = {
            accuracy: 0,
            precision: 0,
            recall: 0,
            f1Score: 0,
            fairness: 0,
            loss: Infinity
          };
          status = 'failed';
        }

        // Record trial
        const trial: TrialResult = {
          trialId,
          parameters,
          metrics,
          status,
          duration: Date.now() - startTime
        };
        this.trials.push(trial);

        // Update optimizer
        this.updateOptimizer(trial);

        // Check early stopping
        if (this.shouldStopEarly()) {
          break;
        }
      }

      return this.getOptimizationResult();
    } catch (error) {
      console.error('Error in hyperparameter optimization:', error);
      throw new Error('Failed to optimize hyperparameters');
    }
  }

  /**
   * Initializes optimizer
   */
  private initializeOptimizer(): any {
    switch (this.config.method) {
      case 'grid':
        return this.initializeGridSearch();
      case 'random':
        return this.initializeRandomSearch();
      case 'bayesian':
        return this.initializeBayesianOptimization();
      default:
        throw new Error(`Unsupported optimization method: ${this.config.method}`);
    }
  }

  /**
   * Initializes grid search
   */
  private initializeGridSearch(): any {
    const grid = {
      learningRate: this.generateGridValues(
        this.config.parameters.learningRate.min,
        this.config.parameters.learningRate.max,
        this.config.parameters.learningRate.step || 0.1
      ),
      batchSize: this.config.parameters.batchSize,
      dropout: this.generateGridValues(
        this.config.parameters.dropout.min,
        this.config.parameters.dropout.max,
        this.config.parameters.dropout.step || 0.1
      ),
      hiddenSize: this.config.parameters.hiddenSize,
      layers: this.config.parameters.layers,
      attentionHeads: this.config.parameters.attentionHeads
    };

    return {
      grid,
      currentIndex: 0,
      combinations: this.generateGridCombinations(grid)
    };
  }

  /**
   * Initializes random search
   */
  private initializeRandomSearch(): any {
    return {
      bounds: {
        learningRate: [this.config.parameters.learningRate.min, this.config.parameters.learningRate.max],
        dropout: [this.config.parameters.dropout.min, this.config.parameters.dropout.max]
      },
      discrete: {
        batchSize: this.config.parameters.batchSize,
        hiddenSize: this.config.parameters.hiddenSize,
        layers: this.config.parameters.layers,
        attentionHeads: this.config.parameters.attentionHeads
      }
    };
  }

  /**
   * Initializes Bayesian optimization
   */
  private initializeBayesianOptimization(): any {
    const bounds = {
      learningRate: [this.config.parameters.learningRate.min, this.config.parameters.learningRate.max],
      dropout: [this.config.parameters.dropout.min, this.config.parameters.dropout.max]
    };

    return new bayes.BayesianOptimization(
      bounds,
      {
        randomState: 42,
        verbose: 1,
        nInitialPoints: 5
      }
    );
  }

  /**
   * Generates parameters for next trial
   */
  private generateParameters(): Record<string, any> {
    switch (this.config.method) {
      case 'grid':
        return this.generateGridParameters();
      case 'random':
        return this.generateRandomParameters();
      case 'bayesian':
        return this.generateBayesianParameters();
      default:
        throw new Error(`Unsupported optimization method: ${this.config.method}`);
    }
  }

  /**
   * Generates grid search parameters
   */
  private generateGridParameters(): Record<string, any> {
    const combination = this.optimizer.combinations[this.optimizer.currentIndex];
    this.optimizer.currentIndex++;
    return combination;
  }

  /**
   * Generates random search parameters
   */
  private generateRandomParameters(): Record<string, any> {
    const parameters: Record<string, any> = {};

    // Continuous parameters
    for (const [param, [min, max]] of Object.entries(this.optimizer.bounds)) {
      parameters[param] = min + Math.random() * (max - min);
    }

    // Discrete parameters
    for (const [param, values] of Object.entries(this.optimizer.discrete)) {
      parameters[param] = values[Math.floor(Math.random() * values.length)];
    }

    return parameters;
  }

  /**
   * Generates Bayesian optimization parameters
   */
  private generateBayesianParameters(): Record<string, any> {
    const suggestion = this.optimizer.suggest();
    return {
      ...suggestion,
      batchSize: this.config.parameters.batchSize[
        Math.floor(Math.random() * this.config.parameters.batchSize.length)
      ],
      hiddenSize: this.config.parameters.hiddenSize[
        Math.floor(Math.random() * this.config.parameters.hiddenSize.length)
      ],
      layers: this.config.parameters.layers[
        Math.floor(Math.random() * this.config.parameters.layers.length)
      ],
      attentionHeads: this.config.parameters.attentionHeads[
        Math.floor(Math.random() * this.config.parameters.attentionHeads.length)
      ]
    };
  }

  /**
   * Updates optimizer with trial results
   */
  private updateOptimizer(trial: TrialResult): void {
    if (trial.status === 'failed') return;

    switch (this.config.method) {
      case 'grid':
        // No update needed for grid search
        break;
      case 'random':
        // No update needed for random search
        break;
      case 'bayesian':
        this.optimizer.update(
          trial.parameters,
          trial.metrics[this.config.metric]
        );
        break;
    }
  }

  /**
   * Checks if optimization should stop early
   */
  private shouldStopEarly(): boolean {
    if (!this.config.earlyStopping) return false;

    const recentTrials = this.trials.slice(-this.config.earlyStopping.patience);
    if (recentTrials.length < this.config.earlyStopping.patience) return false;

    const bestMetric = Math.max(
      ...recentTrials.map(trial => trial.metrics[this.config.metric])
    );
    const currentMetric = recentTrials[recentTrials.length - 1].metrics[this.config.metric];

    return bestMetric - currentMetric > this.config.earlyStopping.minDelta;
  }

  /**
   * Generates grid values
   */
  private generateGridValues(min: number, max: number, step: number): number[] {
    const values: number[] = [];
    for (let value = min; value <= max; value += step) {
      values.push(Number(value.toFixed(6)));
    }
    return values;
  }

  /**
   * Generates grid combinations
   */
  private generateGridCombinations(grid: Record<string, any[]>): Record<string, any>[] {
    const keys = Object.keys(grid);
    const combinations: Record<string, any>[] = [];

    const generate = (current: Record<string, any>, index: number) => {
      if (index === keys.length) {
        combinations.push({ ...current });
        return;
      }

      const key = keys[index];
      for (const value of grid[key]) {
        current[key] = value;
        generate(current, index + 1);
      }
    };

    generate({}, 0);
    return combinations;
  }

  /**
   * Gets optimization result
   */
  private getOptimizationResult(): OptimizationResult {
    const successfulTrials = this.trials.filter(trial => trial.status === 'success');
    const bestTrial = successfulTrials.reduce((best, current) => {
      return current.metrics[this.config.metric] > best.metrics[this.config.metric]
        ? current
        : best;
    }, successfulTrials[0]);

    return {
      bestTrial,
      allTrials: this.trials,
      history: this.trials.map(trial => ({
        trialId: trial.trialId,
        parameters: trial.parameters,
        metrics: trial.metrics
      })),
      statistics: {
        totalTrials: this.trials.length,
        successfulTrials: successfulTrials.length,
        failedTrials: this.trials.length - successfulTrials.length,
        averageDuration: this.trials.reduce((sum, trial) => sum + trial.duration, 0) / this.trials.length,
        bestMetric: bestTrial.metrics[this.config.metric]
      }
    };
  }

  /**
   * Gets optimization report
   */
  getOptimizationReport(result: OptimizationResult): string {
    return `
Hyperparameter Optimization Report
================================
Method: ${this.config.method}
Metric: ${this.config.metric}
Total Trials: ${result.statistics.totalTrials}
Successful Trials: ${result.statistics.successfulTrials}
Failed Trials: ${result.statistics.failedTrials}
Average Duration: ${result.statistics.averageDuration.toFixed(2)}ms
Best Metric: ${result.statistics.bestMetric.toFixed(4)}

Best Trial:
----------
Trial ID: ${result.bestTrial.trialId}
Parameters:
${Object.entries(result.bestTrial.parameters)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
Metrics:
${Object.entries(result.bestTrial.metrics)
  .map(([key, value]) => `- ${key}: ${value.toFixed(4)}`)
  .join('\n')}
Duration: ${result.bestTrial.duration}ms

Trial History:
------------
${result.history
  .map(trial => `
Trial ${trial.trialId}:
- Parameters: ${JSON.stringify(trial.parameters)}
- Metrics: ${JSON.stringify(trial.metrics)}
`)
  .join('\n')}
    `;
  }
} 