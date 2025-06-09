import { DashboardData } from '../types/dashboard';

export const mockDashboardData = async (): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
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
    auditHistory: [
      {
        id: '1',
        timestamp: new Date('2024-01-01T10:00:00'),
        riskLevel: 'high',
        riskScore: 0.85,
        biasCount: 5,
        fairnessScore: 0.75,
        category: 'gender',
        details: {
          detectedBiases: [
            {
              type: 'gender',
              description: 'Gender bias detected in hiring decisions',
              impact: 'high',
              confidence: 0.95,
            },
          ],
          metrics: {
            accuracy: 0.89,
            f1Score: 0.88,
            falsePositiveRate: 0.12,
            falseNegativeRate: 0.11,
          },
        },
        recommendations: [
          'Review hiring criteria for gender bias',
          'Implement blind resume screening',
          'Conduct regular bias audits',
        ],
      },
      {
        id: '2',
        timestamp: new Date('2024-01-02T11:00:00'),
        riskLevel: 'medium',
        riskScore: 0.65,
        biasCount: 3,
        fairnessScore: 0.82,
        category: 'age',
        details: {
          detectedBiases: [
            {
              type: 'age',
              description: 'Age bias detected in promotion decisions',
              impact: 'medium',
              confidence: 0.85,
            },
          ],
          metrics: {
            accuracy: 0.87,
            f1Score: 0.86,
            falsePositiveRate: 0.14,
            falseNegativeRate: 0.13,
          },
        },
        recommendations: [
          'Review promotion criteria for age bias',
          'Implement age-diverse interview panels',
          'Monitor promotion rates by age group',
        ],
      },
      {
        id: '3',
        timestamp: new Date('2024-01-03T12:00:00'),
        riskLevel: 'low',
        riskScore: 0.35,
        biasCount: 1,
        fairnessScore: 0.92,
        category: 'race',
        details: {
          detectedBiases: [
            {
              type: 'race',
              description: 'Minor racial bias detected in loan approvals',
              impact: 'low',
              confidence: 0.75,
            },
          ],
          metrics: {
            accuracy: 0.86,
            f1Score: 0.85,
            falsePositiveRate: 0.15,
            falseNegativeRate: 0.14,
          },
        },
        recommendations: [
          'Review loan approval criteria',
          'Implement regular bias monitoring',
          'Train staff on racial bias awareness',
        ],
      },
    ],
    recommendations: [
      {
        id: '1',
        priority: 'high',
        category: 'gender',
        description: 'Implement gender-neutral language in job descriptions',
        impact: 'high',
        effort: 'low',
        status: 'pending',
      },
      {
        id: '2',
        priority: 'medium',
        category: 'age',
        description: 'Review promotion criteria for age bias',
        impact: 'medium',
        effort: 'medium',
        status: 'in-progress',
      },
      {
        id: '3',
        priority: 'low',
        category: 'race',
        description: 'Conduct regular bias awareness training',
        impact: 'high',
        effort: 'high',
        status: 'planned',
      },
    ],
  };
}; 