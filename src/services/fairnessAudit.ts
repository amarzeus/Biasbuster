import { BiasAnalysisResult } from '../types/bias';
import { callAI } from './aiService';

export interface FairnessMetrics {
  statisticalParity: number;
  equalOpportunity: number;
  equalizedOdds: number;
  demographicParity: number;
  disparateImpact: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface FairnessAuditResult {
  metrics: FairnessMetrics;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  auditDate: string;
  modelVersion: string;
  datasetInfo: {
    size: number;
    demographics: Record<string, number>;
    categories: Record<string, number>;
  };
  biasDistribution: Record<string, number>;
  performanceByCategory: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
  }>;
}

export class FairnessAuditService {
  private readonly modelVersion: string;
  private readonly auditHistory: FairnessAuditResult[] = [];

  constructor(modelVersion: string) {
    this.modelVersion = modelVersion;
  }

  /**
   * Perform a comprehensive fairness audit
   */
  async performAudit(
    results: BiasAnalysisResult[],
    datasetInfo: {
      size: number;
      demographics: Record<string, number>;
      categories: Record<string, number>;
    }
  ): Promise<FairnessAuditResult> {
    // Calculate fairness metrics
    const metrics = await this.calculateFairnessMetrics(results);

    // Analyze bias distribution
    const biasDistribution = this.analyzeBiasDistribution(results);

    // Calculate performance by category
    const performanceByCategory = this.calculatePerformanceByCategory(results);

    // Determine risk level
    const riskLevel = this.determineRiskLevel(metrics);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(metrics, riskLevel);

    // Create audit result
    const auditResult: FairnessAuditResult = {
      metrics,
      recommendations,
      riskLevel,
      auditDate: new Date().toISOString(),
      modelVersion: this.modelVersion,
      datasetInfo,
      biasDistribution,
      performanceByCategory
    };

    // Store in audit history
    this.auditHistory.push(auditResult);

    return auditResult;
  }

  /**
   * Calculate comprehensive fairness metrics
   */
  private async calculateFairnessMetrics(results: BiasAnalysisResult[]): Promise<FairnessMetrics> {
    // Calculate basic metrics
    const total = results.length;
    const truePositives = results.filter(r => r.biasDetected === 'yes').length;
    const falsePositives = results.filter(r => r.biasDetected === 'yes' && !r.biasInstances.length).length;
    const falseNegatives = results.filter(r => r.biasDetected === 'no' && r.biasInstances.length > 0).length;

    // Calculate derived metrics
    const accuracy = (truePositives + (total - falsePositives - falseNegatives)) / total;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    // Calculate fairness metrics
    const statisticalParity = this.calculateStatisticalParity(results);
    const equalOpportunity = this.calculateEqualOpportunity(results);
    const equalizedOdds = this.calculateEqualizedOdds(results);
    const demographicParity = this.calculateDemographicParity(results);
    const disparateImpact = this.calculateDisparateImpact(results);

    return {
      statisticalParity,
      equalOpportunity,
      equalizedOdds,
      demographicParity,
      disparateImpact,
      falsePositiveRate: falsePositives / total,
      falseNegativeRate: falseNegatives / total,
      accuracy,
      precision,
      recall,
      f1Score
    };
  }

  /**
   * Calculate statistical parity
   */
  private calculateStatisticalParity(results: BiasAnalysisResult[]): number {
    // Implementation depends on your specific fairness definition
    // This is a simplified version
    const positiveRates = this.calculatePositiveRatesByCategory(results);
    const maxRate = Math.max(...Object.values(positiveRates));
    const minRate = Math.min(...Object.values(positiveRates));
    return 1 - (maxRate - minRate);
  }

  /**
   * Calculate equal opportunity
   */
  private calculateEqualOpportunity(results: BiasAnalysisResult[]): number {
    // Implementation depends on your specific fairness definition
    // This is a simplified version
    const truePositiveRates = this.calculateTruePositiveRatesByCategory(results);
    const maxRate = Math.max(...Object.values(truePositiveRates));
    const minRate = Math.min(...Object.values(truePositiveRates));
    return 1 - (maxRate - minRate);
  }

  /**
   * Calculate equalized odds
   */
  private calculateEqualizedOdds(results: BiasAnalysisResult[]): number {
    // Implementation depends on your specific fairness definition
    // This is a simplified version
    const truePositiveRates = this.calculateTruePositiveRatesByCategory(results);
    const falsePositiveRates = this.calculateFalsePositiveRatesByCategory(results);
    
    const maxTPR = Math.max(...Object.values(truePositiveRates));
    const minTPR = Math.min(...Object.values(truePositiveRates));
    const maxFPR = Math.max(...Object.values(falsePositiveRates));
    const minFPR = Math.min(...Object.values(falsePositiveRates));
    
    return 1 - ((maxTPR - minTPR + maxFPR - minFPR) / 2);
  }

  /**
   * Calculate demographic parity
   */
  private calculateDemographicParity(results: BiasAnalysisResult[]): number {
    // Implementation depends on your specific fairness definition
    // This is a simplified version
    const positiveRates = this.calculatePositiveRatesByCategory(results);
    const maxRate = Math.max(...Object.values(positiveRates));
    const minRate = Math.min(...Object.values(positiveRates));
    return 1 - (maxRate - minRate);
  }

  /**
   * Calculate disparate impact
   */
  private calculateDisparateImpact(results: BiasAnalysisResult[]): number {
    // Implementation depends on your specific fairness definition
    // This is a simplified version
    const positiveRates = this.calculatePositiveRatesByCategory(results);
    const maxRate = Math.max(...Object.values(positiveRates));
    const minRate = Math.min(...Object.values(positiveRates));
    return minRate / maxRate;
  }

  /**
   * Calculate positive rates by category
   */
  private calculatePositiveRatesByCategory(results: BiasAnalysisResult[]): Record<string, number> {
    const rates: Record<string, number> = {};
    const categories = this.extractCategories(results);

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.biasInstances.some(bi => bi.type === category));
      rates[category] = categoryResults.filter(r => r.biasDetected === 'yes').length / categoryResults.length;
    });

    return rates;
  }

  /**
   * Calculate true positive rates by category
   */
  private calculateTruePositiveRatesByCategory(results: BiasAnalysisResult[]): Record<string, number> {
    const rates: Record<string, number> = {};
    const categories = this.extractCategories(results);

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.biasInstances.some(bi => bi.type === category));
      const truePositives = categoryResults.filter(r => 
        r.biasDetected === 'yes' && r.biasInstances.some(bi => bi.type === category)
      ).length;
      rates[category] = truePositives / categoryResults.length;
    });

    return rates;
  }

  /**
   * Calculate false positive rates by category
   */
  private calculateFalsePositiveRatesByCategory(results: BiasAnalysisResult[]): Record<string, number> {
    const rates: Record<string, number> = {};
    const categories = this.extractCategories(results);

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.biasInstances.some(bi => bi.type === category));
      const falsePositives = categoryResults.filter(r => 
        r.biasDetected === 'yes' && !r.biasInstances.some(bi => bi.type === category)
      ).length;
      rates[category] = falsePositives / categoryResults.length;
    });

    return rates;
  }

  /**
   * Extract unique categories from results
   */
  private extractCategories(results: BiasAnalysisResult[]): string[] {
    const categories = new Set<string>();
    results.forEach(result => {
      result.biasInstances.forEach(instance => {
        categories.add(instance.type);
      });
    });
    return Array.from(categories);
  }

  /**
   * Analyze bias distribution across categories
   */
  private analyzeBiasDistribution(results: BiasAnalysisResult[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    const total = results.length;

    results.forEach(result => {
      result.biasInstances.forEach(instance => {
        distribution[instance.type] = (distribution[instance.type] || 0) + 1;
      });
    });

    // Convert to percentages
    Object.keys(distribution).forEach(category => {
      distribution[category] = distribution[category] / total;
    });

    return distribution;
  }

  /**
   * Calculate performance metrics by category
   */
  private calculatePerformanceByCategory(results: BiasAnalysisResult[]): Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
  }> {
    const performance: Record<string, {
      accuracy: number;
      precision: number;
      recall: number;
    }> = {};

    const categories = this.extractCategories(results);

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.biasInstances.some(bi => bi.type === category));
      const truePositives = categoryResults.filter(r => 
        r.biasDetected === 'yes' && r.biasInstances.some(bi => bi.type === category)
      ).length;
      const falsePositives = categoryResults.filter(r => 
        r.biasDetected === 'yes' && !r.biasInstances.some(bi => bi.type === category)
      ).length;
      const falseNegatives = categoryResults.filter(r => 
        r.biasDetected === 'no' && r.biasInstances.some(bi => bi.type === category)
      ).length;

      const accuracy = (truePositives + (categoryResults.length - falsePositives - falseNegatives)) / categoryResults.length;
      const precision = truePositives / (truePositives + falsePositives) || 0;
      const recall = truePositives / (truePositives + falseNegatives) || 0;

      performance[category] = { accuracy, precision, recall };
    });

    return performance;
  }

  /**
   * Determine risk level based on metrics
   */
  private determineRiskLevel(metrics: FairnessMetrics): 'low' | 'medium' | 'high' {
    const riskFactors = [
      metrics.statisticalParity < 0.8,
      metrics.equalOpportunity < 0.8,
      metrics.equalizedOdds < 0.8,
      metrics.demographicParity < 0.8,
      metrics.disparateImpact < 0.8,
      metrics.falsePositiveRate > 0.2,
      metrics.falseNegativeRate > 0.2,
      metrics.accuracy < 0.8,
      metrics.precision < 0.8,
      metrics.recall < 0.8
    ];

    const riskScore = riskFactors.filter(factor => factor).length;

    if (riskScore <= 3) return 'low';
    if (riskScore <= 7) return 'medium';
    return 'high';
  }

  /**
   * Generate recommendations based on metrics and risk level
   */
  private async generateRecommendations(
    metrics: FairnessMetrics,
    riskLevel: 'low' | 'medium' | 'high'
  ): Promise<string[]> {
    const prompt = `
SYSTEM: You are an expert in AI fairness and bias mitigation. Generate specific recommendations based on the following metrics and risk level.

METRICS:
${JSON.stringify(metrics, null, 2)}

RISK LEVEL: ${riskLevel}

Please provide:
1. Specific, actionable recommendations for improving fairness
2. Focus on the most critical issues first
3. Include both short-term and long-term solutions
4. Consider technical and process improvements
5. Suggest monitoring and evaluation strategies

Format your response as a JSON array of strings.`;

    const response = await callAI(prompt);
    return response.BiasInstances.map(instance => instance.Mitigation);
  }

  /**
   * Get audit history
   */
  getAuditHistory(): FairnessAuditResult[] {
    return this.auditHistory;
  }

  /**
   * Get latest audit result
   */
  getLatestAudit(): FairnessAuditResult | null {
    return this.auditHistory[this.auditHistory.length - 1] || null;
  }
}
