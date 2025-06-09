import {
  RiskLevel,
  BiasType,
  Priority,
  Impact,
  Effort,
  Status,
  Metrics,
  DetectedBias,
  AuditDetails,
  AuditEntry,
  Recommendation,
  DashboardMetrics,
  DashboardData,
} from '../dashboard';

describe('Dashboard Types', () => {
  describe('RiskLevel', () => {
    it('should accept valid risk levels', () => {
      const validLevels: RiskLevel[] = ['low', 'medium', 'high'];
      validLevels.forEach((level) => {
        expect(['low', 'medium', 'high']).toContain(level);
      });
    });
  });

  describe('BiasType', () => {
    it('should accept valid bias types', () => {
      const validTypes: BiasType[] = ['gender', 'age', 'race', 'socioeconomic', 'other'];
      validTypes.forEach((type) => {
        expect(['gender', 'age', 'race', 'socioeconomic', 'other']).toContain(type);
      });
    });
  });

  describe('Metrics', () => {
    it('should validate metrics structure', () => {
      const metrics: Metrics = {
        accuracy: 0.85,
        f1Score: 0.82,
        falsePositiveRate: 0.15,
        falseNegativeRate: 0.18,
      };

      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('f1Score');
      expect(metrics).toHaveProperty('falsePositiveRate');
      expect(metrics).toHaveProperty('falseNegativeRate');
      expect(typeof metrics.accuracy).toBe('number');
      expect(typeof metrics.f1Score).toBe('number');
      expect(typeof metrics.falsePositiveRate).toBe('number');
      expect(typeof metrics.falseNegativeRate).toBe('number');
    });
  });

  describe('DetectedBias', () => {
    it('should validate detected bias structure', () => {
      const bias: DetectedBias = {
        type: 'gender',
        description: 'Gender bias in hiring',
        impact: 'high',
        confidence: 0.95,
      };

      expect(bias).toHaveProperty('type');
      expect(bias).toHaveProperty('description');
      expect(bias).toHaveProperty('impact');
      expect(bias).toHaveProperty('confidence');
      expect(['gender', 'age', 'race', 'socioeconomic', 'other']).toContain(bias.type);
      expect(['low', 'medium', 'high']).toContain(bias.impact);
      expect(typeof bias.confidence).toBe('number');
      expect(bias.confidence).toBeGreaterThanOrEqual(0);
      expect(bias.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('AuditDetails', () => {
    it('should validate audit details structure', () => {
      const details: AuditDetails = {
        detectedBiases: [
          {
            type: 'gender',
            description: 'Gender bias in hiring',
            impact: 'high',
            confidence: 0.95,
          },
        ],
        metrics: {
          accuracy: 0.85,
          f1Score: 0.82,
          falsePositiveRate: 0.15,
          falseNegativeRate: 0.18,
        },
      };

      expect(details).toHaveProperty('detectedBiases');
      expect(details).toHaveProperty('metrics');
      expect(Array.isArray(details.detectedBiases)).toBe(true);
      expect(details.detectedBiases[0]).toHaveProperty('type');
      expect(details.metrics).toHaveProperty('accuracy');
    });
  });

  describe('AuditEntry', () => {
    it('should validate audit entry structure', () => {
      const entry: AuditEntry = {
        id: '1',
        timestamp: new Date(),
        riskLevel: 'high',
        riskScore: 0.85,
        biasCount: 5,
        fairnessScore: 0.75,
        category: 'gender',
        details: {
          detectedBiases: [
            {
              type: 'gender',
              description: 'Gender bias in hiring',
              impact: 'high',
              confidence: 0.95,
            },
          ],
          metrics: {
            accuracy: 0.85,
            f1Score: 0.82,
            falsePositiveRate: 0.15,
            falseNegativeRate: 0.18,
          },
        },
        recommendations: ['Review hiring criteria', 'Implement blind screening'],
      };

      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('riskLevel');
      expect(entry).toHaveProperty('riskScore');
      expect(entry).toHaveProperty('biasCount');
      expect(entry).toHaveProperty('fairnessScore');
      expect(entry).toHaveProperty('category');
      expect(entry).toHaveProperty('details');
      expect(entry).toHaveProperty('recommendations');
      expect(Array.isArray(entry.recommendations)).toBe(true);
    });
  });

  describe('Recommendation', () => {
    it('should validate recommendation structure', () => {
      const recommendation: Recommendation = {
        id: '1',
        priority: 'high',
        category: 'gender',
        description: 'Implement gender-neutral language',
        impact: 'high',
        effort: 'low',
        status: 'pending',
      };

      expect(recommendation).toHaveProperty('id');
      expect(recommendation).toHaveProperty('priority');
      expect(recommendation).toHaveProperty('category');
      expect(recommendation).toHaveProperty('description');
      expect(recommendation).toHaveProperty('impact');
      expect(recommendation).toHaveProperty('effort');
      expect(recommendation).toHaveProperty('status');
      expect(['low', 'medium', 'high']).toContain(recommendation.priority);
      expect(['low', 'medium', 'high']).toContain(recommendation.impact);
      expect(['low', 'medium', 'high']).toContain(recommendation.effort);
      expect(['planned', 'in-progress', 'completed', 'pending']).toContain(recommendation.status);
    });
  });

  describe('DashboardMetrics', () => {
    it('should validate dashboard metrics structure', () => {
      const metrics: DashboardMetrics = {
        statisticalParity: 0.85,
        equalOpportunity: 0.92,
        accuracy: 0.88,
        f1Score: 0.87,
      };

      expect(metrics).toHaveProperty('statisticalParity');
      expect(metrics).toHaveProperty('equalOpportunity');
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('f1Score');
      expect(typeof metrics.statisticalParity).toBe('number');
      expect(typeof metrics.equalOpportunity).toBe('number');
      expect(typeof metrics.accuracy).toBe('number');
      expect(typeof metrics.f1Score).toBe('number');
    });
  });

  describe('DashboardData', () => {
    it('should validate dashboard data structure', () => {
      const data: DashboardData = {
        riskLevel: 'medium',
        metrics: {
          statisticalParity: 0.85,
          equalOpportunity: 0.92,
          accuracy: 0.88,
          f1Score: 0.87,
        },
        biasDistribution: {
          gender: 0.3,
          age: 0.2,
          race: 0.25,
          socioeconomic: 0.15,
          other: 0.1,
        },
        performanceByCategory: {
          gender: {
            accuracy: 0.89,
            f1Score: 0.88,
            falsePositiveRate: 0.12,
            falseNegativeRate: 0.11,
          },
          age: {
            accuracy: 0.87,
            f1Score: 0.86,
            falsePositiveRate: 0.14,
            falseNegativeRate: 0.13,
          },
          race: {
            accuracy: 0.86,
            f1Score: 0.85,
            falsePositiveRate: 0.15,
            falseNegativeRate: 0.14,
          },
          socioeconomic: {
            accuracy: 0.88,
            f1Score: 0.87,
            falsePositiveRate: 0.13,
            falseNegativeRate: 0.12,
          },
        },
        auditHistory: [],
        recommendations: [],
      };

      expect(data).toHaveProperty('riskLevel');
      expect(data).toHaveProperty('metrics');
      expect(data).toHaveProperty('biasDistribution');
      expect(data).toHaveProperty('performanceByCategory');
      expect(data).toHaveProperty('auditHistory');
      expect(data).toHaveProperty('recommendations');
      expect(Array.isArray(data.auditHistory)).toBe(true);
      expect(Array.isArray(data.recommendations)).toBe(true);
    });
  });
}); 