import { EnhancedGeminiService } from '../../services/enhancedGeminiService';
import { cacheService } from '../../services/cacheService';

jest.setTimeout(30000); // Increase timeout for performance tests

describe('Performance tests for batchAnalyze and caching', () => {
  let service: EnhancedGeminiService;

  beforeEach(() => {
    service = new EnhancedGeminiService('test-api-key');
    cacheService.clear();
  });

  const generateTexts = (count: number): string[] => {
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(`This is test text number ${i}. It contains some sample content to analyze for bias.`);
    }
    return texts;
  };

  test('batchAnalyze performance with batch size 1', async () => {
    const texts = generateTexts(1);

    const start = performance.now();
    const results = await service.batchAnalyze(texts);
    const duration = performance.now() - start;

    expect(results.length).toBe(1);
    expect(duration).toBeLessThan(5000); // 5 seconds threshold
  });

  test('batchAnalyze performance with batch size 5', async () => {
    const texts = generateTexts(5);

    const start = performance.now();
    const results = await service.batchAnalyze(texts);
    const duration = performance.now() - start;

    expect(results.length).toBe(5);
    expect(duration).toBeLessThan(15000); // 15 seconds threshold
  });

  test('batchAnalyze performance with batch size 10', async () => {
    const texts = generateTexts(10);

    const start = performance.now();
    const results = await service.batchAnalyze(texts);
    const duration = performance.now() - start;

    expect(results.length).toBe(10);
    expect(duration).toBeLessThan(30000); // 30 seconds threshold
  });

  test('caching effectiveness: second run should be faster', async () => {
    const texts = generateTexts(5);

    // First run (uncached)
    const start1 = performance.now();
    const results1 = await service.batchAnalyze(texts);
    const duration1 = performance.now() - start1;

    // Second run (cached)
    const start2 = performance.now();
    const results2 = await service.batchAnalyze(texts);
    const duration2 = performance.now() - start2;

    expect(results1.length).toBe(5);
    expect(results2.length).toBe(5);
    expect(duration2).toBeLessThan(duration1);
  });
});
