import { BiasDetector } from '../../src/core/bias/detector';
import { DetectionOptions, BiasResult } from '../../src/types/bias';

describe('BiasDetector', () => {
    let detector: BiasDetector;
    const defaultOptions: DetectionOptions = {
        sensitivity: 'balanced',
        customKeywords: [],
        highlightColor: '#FF0000'
    };

    beforeEach(() => {
        detector = new BiasDetector(defaultOptions);
    });

    describe('analyzeText', () => {
        it('should return a valid BiasResult object', async () => {
            const text = 'This is a test text';
            const result = await detector.analyzeText(text);

            expect(result).toHaveProperty('mainTopic');
            expect(result).toHaveProperty('biasDetected');
            expect(result).toHaveProperty('biasInstances');
            expect(result).toHaveProperty('biasSummary');
            expect(result).toHaveProperty('alternativePerspectives');
            expect(result).toHaveProperty('educationalContent');
            expect(result).toHaveProperty('userCustomKeywordsFound');
            expect(result).toHaveProperty('sentimentAnalysis');
            expect(result).toHaveProperty('sourceCredibility');
            expect(result).toHaveProperty('languageDetected');
            expect(result).toHaveProperty('fairnessSelfCheck');
        });

        it('should detect bias in biased text', async () => {
            const biasedText = 'Women are not as good at programming as men.';
            const result = await detector.analyzeText(biasedText);

            expect(result.biasDetected).toBe(true);
            expect(result.biasInstances.length).toBeGreaterThan(0);
            expect(result.biasInstances[0].biasType).toContain('Gender Bias');
        });

        it('should not detect bias in neutral text', async () => {
            const neutralText = 'The weather is sunny today.';
            const result = await detector.analyzeText(neutralText);

            expect(result.biasDetected).toBe(false);
            expect(result.biasInstances.length).toBe(0);
        });

        it('should respect custom keywords', async () => {
            const options: DetectionOptions = {
                ...defaultOptions,
                customKeywords: ['test-bias']
            };
            detector = new BiasDetector(options);

            const text = 'This contains test-bias keyword';
            const result = await detector.analyzeText(text);

            expect(result.userCustomKeywordsFound).toContain('test-bias');
        });
    });

    describe('updateOptions', () => {
        it('should update detection options', () => {
            const newOptions: Partial<DetectionOptions> = {
                sensitivity: 'strict',
                customKeywords: ['new-keyword']
            };

            detector.updateOptions(newOptions);
            const result = detector['options'];

            expect(result.sensitivity).toBe('strict');
            expect(result.customKeywords).toContain('new-keyword');
        });

        it('should preserve existing options when partially updating', () => {
            const newOptions: Partial<DetectionOptions> = {
                sensitivity: 'strict'
            };

            detector.updateOptions(newOptions);
            const result = detector['options'];

            expect(result.sensitivity).toBe('strict');
            expect(result.highlightColor).toBe(defaultOptions.highlightColor);
        });
    });
}); 