import * as tf from '@tensorflow/tfjs-node';
import { DistributedTrainingService } from '../distributedTraining';

describe('DistributedTrainingService', () => {
  let model: tf.LayersModel;
  let data: tf.data.Dataset<tf.TensorContainer>;
  let service: DistributedTrainingService;

  beforeEach(async () => {
    // Create a simple model for testing
    model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 10, inputShape: [5] }),
        tf.layers.dense({ units: 1 })
      ]
    });

    // Create synthetic data
    const xs = tf.randomNormal([100, 5]);
    const ys = tf.randomNormal([100, 1]);
    data = tf.data.zip({ xs, ys }).batch(10);

    // Initialize service with test configuration
    service = new DistributedTrainingService(model, data, {
      numWorkers: 2,
      batchSize: 10,
      epochs: 2,
      learningRate: 0.01,
      optimizer: 'adam',
      lossFunction: 'meanSquaredError',
      metrics: ['mse']
    });
  });

  afterEach(async () => {
    // Clean up tensors
    tf.dispose([model]);
  });

  it('should initialize with correct configuration', () => {
    expect(service).toBeDefined();
    // Add more specific configuration checks
  });

  it('should train model in distributed manner', async () => {
    const result = await service.train();
    expect(result.model).toBeDefined();
    expect(result.history).toBeDefined();
    expect(result.history.length).toBeGreaterThan(0);
  });

  it('should handle worker errors gracefully', async () => {
    // Test error handling by simulating worker failure
    // Implementation depends on how we want to test error scenarios
  });

  it('should generate training report', () => {
    const report = service.getTrainingReport();
    expect(report).toContain('Distributed Training Report');
    expect(report).toContain('Strategy:');
    expect(report).toContain('Workers:');
  });

  it('should implement early stopping', async () => {
    // Test early stopping by configuring a scenario where it should trigger
    const earlyStoppingService = new DistributedTrainingService(model, data, {
      numWorkers: 2,
      batchSize: 10,
      epochs: 10,
      learningRate: 0.01,
      optimizer: 'adam',
      lossFunction: 'meanSquaredError',
      metrics: ['mse']
    });

    const result = await earlyStoppingService.train();
    // Verify that training stopped early if conditions were met
  });
}); 