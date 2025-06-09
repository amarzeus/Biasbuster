import { BiasType } from '../types/bias';
import { modelTrainingConfig } from '../config/modelTraining';
import * as tf from '@tensorflow/tfjs-node';
import * as cluster from 'cluster';
import * as os from 'os';

interface DistributedConfig {
  strategy: 'dataParallel' | 'modelParallel' | 'hybrid';
  numWorkers: number;
  batchSize: number;
  epochs: number;
  learningRate: number;
  optimizer: string;
  lossFunction: string;
  metrics: string[];
  callbacks: any[];
}

interface WorkerMessage {
  type: 'init' | 'train' | 'evaluate' | 'sync' | 'complete' | 'error';
  data?: any;
}

interface TrainingProgress {
  epoch: number;
  batch: number;
  loss: number;
  metrics: Record<string, number>;
  timePerBatch: number;
}

export class DistributedTrainingService {
  private readonly config: DistributedConfig;
  private readonly workers: Map<number, cluster.Worker> = new Map();
  private readonly model: tf.LayersModel;
  private readonly data: tf.data.Dataset<tf.TensorContainer>;
  private readonly progress: TrainingProgress[] = [];

  constructor(
    model: tf.LayersModel,
    data: tf.data.Dataset<tf.TensorContainer>,
    config: Partial<DistributedConfig> = {}
  ) {
    this.model = model;
    this.data = data;
    this.config = {
      strategy: 'dataParallel',
      numWorkers: Math.max(1, os.cpus().length - 1),
      batchSize: 32,
      epochs: 10,
      learningRate: 1e-4,
      optimizer: 'adam',
      lossFunction: 'categoricalCrossentropy',
      metrics: ['accuracy'],
      callbacks: [],
      ...config
    };
  }

  /**
   * Starts distributed training
   */
  async train(): Promise<{
    model: tf.LayersModel;
    history: TrainingProgress[];
  }> {
    try {
      if (cluster.isMaster) {
        return await this.masterProcess();
      } else {
        await this.workerProcess();
        return { model: this.model, history: this.progress };
      }
    } catch (error) {
      console.error('Error in distributed training:', error);
      throw new Error('Failed to perform distributed training');
    }
  }

  /**
   * Master process
   */
  private async masterProcess(): Promise<{
    model: tf.LayersModel;
    history: TrainingProgress[];
  }> {
    // Initialize workers
    await this.initializeWorkers();

    // Start training
    const numBatches = await this.data.size();
    const batchesPerWorker = Math.ceil(numBatches / this.config.numWorkers);

    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      // Distribute batches to workers
      for (let batch = 0; batch < numBatches; batch += batchesPerWorker) {
        const workerId = Math.floor(batch / batchesPerWorker);
        const worker = this.workers.get(workerId);

        if (worker) {
          worker.send({
            type: 'train',
            data: {
              epoch,
              batch,
              batchesPerWorker,
              config: this.config
            }
          });
        }
      }

      // Wait for all workers to complete
      await this.waitForWorkers();

      // Synchronize model weights
      await this.synchronizeWeights();

      // Evaluate model
      const evaluation = await this.evaluateModel();
      this.progress.push({
        epoch,
        batch: numBatches,
        loss: evaluation.loss,
        metrics: evaluation.metrics,
        timePerBatch: evaluation.timePerBatch
      });

      // Check early stopping
      if (this.shouldStopEarly()) {
        break;
      }
    }

    // Clean up workers
    await this.cleanupWorkers();

    return {
      model: this.model,
      history: this.progress
    };
  }

  /**
   * Worker process
   */
  private async workerProcess(): Promise<void> {
    process.on('message', async (message: WorkerMessage) => {
      try {
        switch (message.type) {
          case 'init':
            await this.initializeWorker(message.data);
            break;
          case 'train':
            await this.trainWorker(message.data);
            break;
          case 'evaluate':
            await this.evaluateWorker(message.data);
            break;
          case 'sync':
            await this.syncWorker(message.data);
            break;
          case 'complete':
            await this.completeWorker(message.data);
            break;
        }
      } catch (error) {
        process.send!({
          type: 'error',
          data: error.message
        });
      }
    });
  }

  /**
   * Initializes workers
   */
  private async initializeWorkers(): Promise<void> {
    for (let i = 0; i < this.config.numWorkers; i++) {
      const worker = cluster.fork();
      this.workers.set(i, worker);

      worker.on('message', (message: WorkerMessage) => {
        if (message.type === 'error') {
          console.error(`Worker ${i} error:`, message.data);
        }
      });

      // Wait for worker initialization
      await new Promise<void>((resolve) => {
        worker.once('message', (message: WorkerMessage) => {
          if (message.type === 'init') {
            resolve();
          }
        });
      });
    }
  }

  /**
   * Initializes a worker
   */
  private async initializeWorker(data: any): Promise<void> {
    // Initialize model
    const model = await this.createModel();
    const optimizer = this.createOptimizer();

    // Initialize training
    const batches = await this.data
      .batch(this.config.batchSize)
      .take(data.batchesPerWorker)
      .toArray();

    process.send!({
      type: 'init',
      data: {
        model: model.toJSON(),
        optimizer: optimizer.getConfig(),
        batches: batches.length
      }
    });
  }

  /**
   * Trains a worker
   */
  private async trainWorker(data: any): Promise<void> {
    const { epoch, batch, batchesPerWorker } = data;
    const startTime = Date.now();

    // Get batches for this worker
    const workerBatches = await this.data
      .batch(this.config.batchSize)
      .skip(batch)
      .take(batchesPerWorker)
      .toArray();

    // Train on batches
    for (let i = 0; i < workerBatches.length; i++) {
      const [inputs, targets] = workerBatches[i];
      const { loss, metrics } = await this.trainStep(inputs, targets);

      process.send!({
        type: 'train',
        data: {
          epoch,
          batch: batch + i,
          loss,
          metrics,
          timePerBatch: Date.now() - startTime
        }
      });
    }
  }

  /**
   * Evaluates a worker
   */
  private async evaluateWorker(data: any): Promise<void> {
    const { epoch, batch } = data;
    const startTime = Date.now();

    // Evaluate model
    const evaluation = await this.model.evaluate(this.data, {
      batchSize: this.config.batchSize,
      verbose: 0
    });

    process.send!({
      type: 'evaluate',
      data: {
        epoch,
        batch,
        loss: evaluation[0],
        metrics: this.config.metrics.reduce((acc, metric, i) => {
          acc[metric] = evaluation[i + 1];
          return acc;
        }, {} as Record<string, number>),
        timePerBatch: Date.now() - startTime
      }
    });
  }

  /**
   * Synchronizes worker weights
   */
  private async syncWorker(data: any): Promise<void> {
    // Update model weights
    await this.model.setWeights(data.weights);

    process.send!({
      type: 'sync',
      data: {
        status: 'success'
      }
    });
  }

  /**
   * Completes a worker
   */
  private async completeWorker(data: any): Promise<void> {
    process.send!({
      type: 'complete',
      data: {
        status: 'success'
      }
    });
  }

  /**
   * Waits for all workers to complete
   */
  private async waitForWorkers(): Promise<void> {
    return new Promise<void>((resolve) => {
      let completedWorkers = 0;
      const totalWorkers = this.workers.size;

      for (const worker of this.workers.values()) {
        worker.once('message', (message: WorkerMessage) => {
          if (message.type === 'complete') {
            completedWorkers++;
            if (completedWorkers === totalWorkers) {
              resolve();
            }
          }
        });
      }
    });
  }

  /**
   * Synchronizes model weights
   */
  private async synchronizeWeights(): Promise<void> {
    const weights = this.model.getWeights();
    const weightTensors = await Promise.all(
      weights.map(weight => weight.array())
    );

    for (const worker of this.workers.values()) {
      worker.send({
        type: 'sync',
        data: {
          weights: weightTensors
        }
      });
    }

    await this.waitForWorkers();
  }

  /**
   * Evaluates model
   */
  private async evaluateModel(): Promise<{
    loss: number;
    metrics: Record<string, number>;
    timePerBatch: number;
  }> {
    const startTime = Date.now();
    const evaluation = await this.model.evaluate(this.data, {
      batchSize: this.config.batchSize,
      verbose: 0
    });

    return {
      loss: evaluation[0],
      metrics: this.config.metrics.reduce((acc, metric, i) => {
        acc[metric] = evaluation[i + 1];
        return acc;
      }, {} as Record<string, number>),
      timePerBatch: Date.now() - startTime
    };
  }

  /**
   * Creates model
   */
  private async createModel(): Promise<tf.LayersModel> {
    // TODO: Implement model creation based on strategy
    return this.model;
  }

  /**
   * Creates optimizer
   */
  private createOptimizer(): tf.Optimizer {
    switch (this.config.optimizer) {
      case 'adam':
        return tf.train.adam(this.config.learningRate);
      case 'sgd':
        return tf.train.sgd(this.config.learningRate);
      case 'adamw':
        return tf.train.adamax(this.config.learningRate);
      default:
        throw new Error(`Unsupported optimizer: ${this.config.optimizer}`);
    }
  }

  /**
   * Performs training step
   */
  private async trainStep(
    inputs: tf.Tensor,
    targets: tf.Tensor
  ): Promise<{
    loss: number;
    metrics: Record<string, number>;
  }> {
    const optimizer = this.createOptimizer();

    const { value, grads } = tf.tidy(() => {
      const predictions = this.model.apply(inputs) as tf.Tensor;
      const loss = tf.losses[this.config.lossFunction](targets, predictions);
      const grads = tf.grads(() => loss)(this.model.trainableWeights);
      return { value: loss, grads };
    });

    optimizer.applyGradients(
      grads.map((grad, i) => ({
        grads: grad,
        vars: this.model.trainableWeights[i]
      }))
    );

    const metrics = this.config.metrics.reduce((acc, metric) => {
      acc[metric] = 0; // TODO: Calculate metric
      return acc;
    }, {} as Record<string, number>);

    return {
      loss: value.dataSync()[0],
      metrics
    };
  }

  /**
   * Checks if training should stop early
   */
  private shouldStopEarly(): boolean {
    if (this.progress.length < 3) return false;

    const recentProgress = this.progress.slice(-3);
    const bestLoss = Math.min(...recentProgress.map(p => p.loss));
    const currentLoss = recentProgress[recentProgress.length - 1].loss;

    return bestLoss - currentLoss < 1e-4;
  }

  /**
   * Cleans up workers
   */
  private async cleanupWorkers(): Promise<void> {
    for (const worker of this.workers.values()) {
      worker.kill();
    }
    this.workers.clear();
  }

  /**
   * Gets training report
   */
  getTrainingReport(): string {
    return `
Distributed Training Report
=========================
Strategy: ${this.config.strategy}
Workers: ${this.config.numWorkers}
Batch Size: ${this.config.batchSize}
Epochs: ${this.config.epochs}
Learning Rate: ${this.config.learningRate}
Optimizer: ${this.config.optimizer}
Loss Function: ${this.config.lossFunction}

Progress:
${this.progress.map(p => `
Epoch ${p.epoch}:
- Batch: ${p.batch}
- Loss: ${p.loss.toFixed(4)}
- Metrics:
${Object.entries(p.metrics)
  .map(([key, value]) => `  - ${key}: ${value.toFixed(4)}`)
  .join('\n')}
- Time per Batch: ${p.timePerBatch}ms
`).join('\n')}

Statistics:
- Total Epochs: ${this.progress.length}
- Average Time per Batch: ${
  this.progress.reduce((sum, p) => sum + p.timePerBatch, 0) / this.progress.length
}ms
- Best Loss: ${Math.min(...this.progress.map(p => p.loss)).toFixed(4)}
- Best Metrics:
${Object.keys(this.progress[0].metrics)
  .map(metric => `  - ${metric}: ${
    Math.max(...this.progress.map(p => p.metrics[metric])).toFixed(4)
  }`)
  .join('\n')}
    `;
  }
} 