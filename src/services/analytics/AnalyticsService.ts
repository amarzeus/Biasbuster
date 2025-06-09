import { BiasAnalysisResult } from '../../types/bias';
import { ModelMetrics } from '../../types/ml';

export interface AnalyticsEvent {
  type: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  endpoint: string;
  batchSize: number;
  flushInterval: number;
  debug: boolean;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      enabled: true,
      endpoint: process.env.ANALYTICS_ENDPOINT || 'https://api.biasbuster.com/analytics',
      batchSize: 100,
      flushInterval: 60000, // 1 minute
      debug: process.env.NODE_ENV === 'development'
    };
    this.initialize();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initialize(): void {
    if (this.config.enabled) {
      this.startFlushTimer();
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => this.flushEvents(), this.config.flushInterval);
  }

  public trackBiasAnalysis(result: BiasAnalysisResult): void {
    if (!this.config.enabled) return;

    this.eventQueue.push({
      type: 'bias_analysis',
      timestamp: new Date().toISOString(),
      data: {
        textLength: result.text.length,
        biasTypes: result.analysis.biasTypes,
        confidence: result.confidence,
        severity: result.analysis.severity
      }
    });

    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  public trackModelMetrics(metrics: ModelMetrics): void {
    if (!this.config.enabled) return;

    this.eventQueue.push({
      type: 'model_metrics',
      timestamp: new Date().toISOString(),
      data: metrics
    });
  }

  public trackError(error: Error, context: string): void {
    if (!this.config.enabled) return;

    this.eventQueue.push({
      type: 'error',
      timestamp: new Date().toISOString(),
      data: {
        message: error.message,
        stack: error.stack,
        context
      }
    });
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        throw new Error(`Failed to send analytics: ${response.statusText}`);
      }

      if (this.config.debug) {
        console.log(`Successfully sent ${events.length} analytics events`);
      }
    } catch (error) {
      console.error('Error sending analytics:', error);
      // Put events back in queue
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  public updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.config.enabled) {
      this.startFlushTimer();
    } else if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  public async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flushEvents();
  }
} 