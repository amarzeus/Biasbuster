import { BiasDetector } from '../BiasDetector';
import { ModelConfig } from '../../../types/ml';
import { BiasAnalysisResult, BiasType } from '../../../types/bias';

describe('BiasDetector', () => {
  let biasDetector: BiasDetector;
  let modelConfig: ModelConfig;

  beforeEach(() => {
    modelConfig = {
      modelType: 'bert',
      modelPath: 'models/bias-detector',
      version: '1.0.0',
      parameters: {
        maxLength: 512,
        batchSize: 32,
        threshold: 0.7
      },
      features: {
        useContext: true,
        useSentiment: true,
        useEntityRecognition: true
      }
    };

    biasDetector = new BiasDetector(modelConfig);
  });

  describe('analyzeText', () => {
    it('should analyze text and return bias analysis result', async () => {
      const text = 'This is a biased text that needs analysis';
      const result = await biasDetector.analyzeText(text);

      expect(result).toBeDefined();
      expect(result.text).toBe(text);
      expect(result.timestamp).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should handle empty text', async () => {
      const result = await biasDetector.analyzeText('');
      expect(result.text).toBe('');
      expect(result.analysis.biasTypes).toHaveLength(0);
    });

    it('should handle text with no bias', async () => {
      const text = 'This is a neutral text without any bias';
      const result = await biasDetector.analyzeText(text);
      expect(result.analysis.biasTypes).toHaveLength(0);
      expect(result.analysis.severity).toBe(0);
    });

    it('should detect multiple types of bias', async () => {
      const text = 'This text contains both gender and racial bias';
      const result = await biasDetector.analyzeText(text);
      expect(result.analysis.biasTypes).toContain(BiasType.GENDER);
      expect(result.analysis.biasTypes).toContain(BiasType.RACIAL);
    });
  });

  describe('updateModel', () => {
    it('should update model configuration', async () => {
      const newConfig: ModelConfig = {
        ...modelConfig,
        parameters: {
          ...modelConfig.parameters,
          threshold: 0.8
        }
      };

      await biasDetector.updateModel(newConfig);
      const result = await biasDetector.analyzeText('Test text');
      expect(result).toBeDefined();
    });

    it('should handle invalid model configuration', async () => {
      const invalidConfig = {
        ...modelConfig,
        modelType: 'invalid' as any
      };

      await expect(biasDetector.updateModel(invalidConfig)).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle analysis errors gracefully', async () => {
      const text = 'This text will cause an error';
      // Mock an error in the analysis
      jest.spyOn(biasDetector as any, 'detectBias').mockRejectedValue(new Error('Analysis failed'));

      await expect(biasDetector.analyzeText(text)).rejects.toThrow('Failed to analyze text for bias');
    });

    it('should handle model initialization errors', async () => {
      const invalidConfig = {
        ...modelConfig,
        modelPath: 'invalid/path'
      };

      await expect(new BiasDetector(invalidConfig)).rejects.toThrow();
    });
  });

  describe('performance', () => {
    it('should analyze text within acceptable time limit', async () => {
      const text = 'This is a test text for performance analysis';
      const startTime = Date.now();
      
      await biasDetector.analyzeText(text);
      
      const endTime = Date.now();
      const analysisTime = endTime - startTime;
      
      expect(analysisTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle long text efficiently', async () => {
      const longText = 'Test '.repeat(1000); // 5000 characters
      const startTime = Date.now();
      
      await biasDetector.analyzeText(longText);
      
      const endTime = Date.now();
      const analysisTime = endTime - startTime;
      
      expect(analysisTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });
}); 