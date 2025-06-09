export type RiskLevel = 'low' | 'medium' | 'high';

export type BiasType = 'gender' | 'age' | 'race' | 'socioeconomic' | 'other';

export type Priority = 'low' | 'medium' | 'high';

export type Impact = 'low' | 'medium' | 'high';

export type Effort = 'low' | 'medium' | 'high';

export type Status = 'planned' | 'in-progress' | 'completed' | 'pending';

export interface Metrics {
  accuracy: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

export interface DetectedBias {
  type: BiasType;
  description: string;
  impact: Impact;
  confidence: number;
}

export interface AuditDetails {
  detectedBiases: DetectedBias[];
  metrics: Metrics;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  riskLevel: RiskLevel;
  riskScore: number;
  biasCount: number;
  fairnessScore: number;
  category: BiasType;
  details: AuditDetails;
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  priority: Priority;
  category: BiasType;
  description: string;
  impact: Impact;
  effort: Effort;
  status: Status;
}

export interface DashboardMetrics {
  statisticalParity: number;
  equalOpportunity: number;
  accuracy: number;
  f1Score: number;
}

export interface DashboardData {
  riskLevel: RiskLevel;
  metrics: DashboardMetrics;
  biasDistribution: Record<BiasType, number>;
  performanceByCategory: Record<BiasType, Metrics>;
  auditHistory: AuditEntry[];
  recommendations: Recommendation[];
} 