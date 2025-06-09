import { BiasResult } from '../../types/bias';

/**
 * Analytics engine for tracking bias detection metrics and user engagement
 */
export class AnalyticsEngine {
    private metrics: AnalyticsMetrics;

    constructor() {
        this.metrics = {
            totalAnalyses: 0,
            biasDetections: 0,
            averageSeverity: 0,
            biasTypeDistribution: {},
            userEngagement: {
                activeUsers: 0,
                averageSessionDuration: 0,
                featureUsage: {}
            },
            performance: {
                averageResponseTime: 0,
                errorRate: 0
            }
        };
    }

    /**
     * Track a bias analysis result
     */
    public trackAnalysis(result: BiasResult): void {
        this.metrics.totalAnalyses++;
        
        if (result.biasDetected) {
            this.metrics.biasDetections++;
            
            // Update bias type distribution
            result.biasInstances.forEach(instance => {
                instance.biasType.forEach(type => {
                    this.metrics.biasTypeDistribution[type] = 
                        (this.metrics.biasTypeDistribution[type] || 0) + 1;
                });
            });

            // Update average severity
            const totalSeverity = result.biasInstances.reduce(
                (sum, instance) => sum + instance.severity, 0
            );
            this.metrics.averageSeverity = 
                (this.metrics.averageSeverity * (this.metrics.biasDetections - 1) + totalSeverity) 
                / this.metrics.biasDetections;
        }
    }

    /**
     * Track user engagement
     */
    public trackUserEngagement(data: UserEngagementData): void {
        this.metrics.userEngagement.activeUsers = data.activeUsers;
        this.metrics.userEngagement.averageSessionDuration = data.averageSessionDuration;
        this.metrics.userEngagement.featureUsage = {
            ...this.metrics.userEngagement.featureUsage,
            ...data.featureUsage
        };
    }

    /**
     * Track performance metrics
     */
    public trackPerformance(data: PerformanceData): void {
        this.metrics.performance.averageResponseTime = data.averageResponseTime;
        this.metrics.performance.errorRate = data.errorRate;
    }

    /**
     * Get current analytics metrics
     */
    public getMetrics(): AnalyticsMetrics {
        return { ...this.metrics };
    }

    /**
     * Generate analytics report
     */
    public generateReport(): AnalyticsReport {
        return {
            timestamp: new Date(),
            metrics: this.metrics,
            insights: this.generateInsights()
        };
    }

    /**
     * Generate insights from metrics
     */
    private generateInsights(): string[] {
        const insights: string[] = [];

        // Add insights based on metrics
        if (this.metrics.biasDetections > 0) {
            const detectionRate = this.metrics.biasDetections / this.metrics.totalAnalyses;
            insights.push(`Bias detection rate: ${(detectionRate * 100).toFixed(1)}%`);
        }

        // Add more insights based on other metrics
        return insights;
    }
}

interface AnalyticsMetrics {
    totalAnalyses: number;
    biasDetections: number;
    averageSeverity: number;
    biasTypeDistribution: { [key: string]: number };
    userEngagement: {
        activeUsers: number;
        averageSessionDuration: number;
        featureUsage: { [key: string]: number };
    };
    performance: {
        averageResponseTime: number;
        errorRate: number;
    };
}

interface UserEngagementData {
    activeUsers: number;
    averageSessionDuration: number;
    featureUsage: { [key: string]: number };
}

interface PerformanceData {
    averageResponseTime: number;
    errorRate: number;
}

interface AnalyticsReport {
    timestamp: Date;
    metrics: AnalyticsMetrics;
    insights: string[];
} 