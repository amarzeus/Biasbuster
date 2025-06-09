import { v4 as uuidv4 } from 'uuid';

export interface MockAuditData {
  latestAudit: {
    id: string;
    timestamp: string;
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    biasDistribution: Record<string, number>;
    performance: Record<string, {
      accuracy: number;
      precision: number;
      recall: number;
    }>;
    recommendations: string[];
  };
  auditHistory: Array<{
    id: string;
    timestamp: string;
    riskLevel: 'low' | 'medium' | 'high';
    biasCount: number;
    fairnessScore: number;
    recommendations: string[];
  }>;
}

const generateMockAuditData = (): MockAuditData => {
  const biasTypes = ['Gender', 'Race', 'Age', 'Socioeconomic', 'Political', 'Cultural'];
  const categories = ['News', 'Social Media', 'Academic', 'Business', 'Entertainment'];
  
  const generateBiasDistribution = () => {
    const distribution: Record<string, number> = {};
    biasTypes.forEach(type => {
      distribution[type] = Math.random();
    });
    return distribution;
  };

  const generatePerformance = () => {
    const performance: Record<string, { accuracy: number; precision: number; recall: number }> = {};
    categories.forEach(category => {
      performance[category] = {
        accuracy: Math.random(),
        precision: Math.random(),
        recall: Math.random(),
      };
    });
    return performance;
  };

  const generateRecommendations = () => {
    const recommendations = [
      'Review content for gender-neutral language',
      'Ensure balanced representation across demographic groups',
      'Implement additional fact-checking procedures',
      'Update training data to include more diverse sources',
      'Consider using alternative phrasing for sensitive topics',
    ];
    return recommendations.slice(0, Math.floor(Math.random() * recommendations.length) + 1);
  };

  const latestAudit = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    riskScore: Math.random(),
    biasDistribution: generateBiasDistribution(),
    performance: generatePerformance(),
    recommendations: generateRecommendations(),
  };

  const auditHistory = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    biasCount: Math.floor(Math.random() * 20),
    fairnessScore: Math.random(),
    recommendations: generateRecommendations(),
  }));

  return {
    latestAudit,
    auditHistory,
  };
};

export const mockDataService = {
  getMockAuditData: (): MockAuditData => {
    return generateMockAuditData();
  },
}; 