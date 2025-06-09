import {
  PERFORMANCE_METRICS,
  PERFORMANCE_CATEGORIES,
  PERFORMANCE_THRESHOLDS,
  PERFORMANCE_MONITORING_INTERVAL,
  PERFORMANCE_HISTORY_LENGTH,
  PERFORMANCE_ALERT_THRESHOLDS,
  PERFORMANCE_REPORTING
} from '@/config/performance-metrics';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface PerformanceMeasurement {
  metrics: Record<string, number>;
  overall: number;
  timestamp: number;
}

interface PerformanceAlert {
  type: 'degradation' | 'improvement' | 'critical';
  metric: string;
  oldValue: number;
  newValue: number;
  change: number;
  timestamp: number;
}

class PerformanceMonitor {
  private measurements: PerformanceMeasurement[] = [];
  private alerts: PerformanceAlert[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: number | null = null;
  private observers: Set<(measurement: PerformanceMeasurement) => void> = new Set();
  private alertObservers: Set<(alert: PerformanceAlert) => void> = new Set();

  constructor() {
    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const metric = this.findMetricByName(entry.name);
    if (metric) {
      this.recordMetric(metric.name, entry.startTime);
    }
  }

  private findMetricByName(name: string) {
    return PERFORMANCE_METRICS.find(metric => 
      metric.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  private calculateOverallScore(metrics: Record<string, number>): number {
    let totalScore = 0;
    let totalWeight = 0;

    PERFORMANCE_METRICS.forEach(metric => {
      const value = metrics[metric.name] || 0;
      const score = this.calculateMetricScore(value, metric.threshold);
      totalScore += score * metric.weight;
      totalWeight += metric.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateMetricScore(value: number, threshold: number): number {
    if (value <= threshold) {
      return 100;
    }
    return Math.max(0, 100 - ((value - threshold) / threshold) * 100);
  }

  private recordMetric(name: string, value: number) {
    const timestamp = Date.now();
    const metric: PerformanceMetric = { name, value, timestamp };
    
    // Update latest measurement or create new one
    const latestMeasurement = this.measurements[this.measurements.length - 1];
    if (latestMeasurement && timestamp - latestMeasurement.timestamp < PERFORMANCE_MONITORING_INTERVAL) {
      latestMeasurement.metrics[name] = value;
      latestMeasurement.overall = this.calculateOverallScore(latestMeasurement.metrics);
    } else {
      const newMeasurement: PerformanceMeasurement = {
        metrics: { [name]: value },
        overall: this.calculateOverallScore({ [name]: value }),
        timestamp
      };
      this.measurements.push(newMeasurement);
      this.trimMeasurements();
      this.notifyObservers(newMeasurement);
    }

    this.checkForAlerts(name, value);
  }

  private trimMeasurements() {
    if (this.measurements.length > PERFORMANCE_HISTORY_LENGTH) {
      this.measurements = this.measurements.slice(-PERFORMANCE_HISTORY_LENGTH);
    }
  }

  private checkForAlerts(metricName: string, newValue: number) {
    const previousMeasurement = this.measurements[this.measurements.length - 2];
    if (!previousMeasurement) return;

    const oldValue = previousMeasurement.metrics[metricName];
    if (oldValue === undefined) return;

    const change = ((newValue - oldValue) / oldValue) * 100;
    let alertType: 'degradation' | 'improvement' | 'critical' | null = null;

    if (change <= -PERFORMANCE_ALERT_THRESHOLDS.critical) {
      alertType = 'critical';
    } else if (change <= -PERFORMANCE_ALERT_THRESHOLDS.degradation) {
      alertType = 'degradation';
    } else if (change >= PERFORMANCE_ALERT_THRESHOLDS.improvement) {
      alertType = 'improvement';
    }

    if (alertType) {
      const alert: PerformanceAlert = {
        type: alertType,
        metric: metricName,
        oldValue,
        newValue,
        change,
        timestamp: Date.now()
      };
      this.alerts.push(alert);
      this.notifyAlertObservers(alert);
    }
  }

  public startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = window.setInterval(() => {
      this.measurePerformance();
    }, PERFORMANCE_MONITORING_INTERVAL);
  }

  public stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async measurePerformance() {
    if (!PERFORMANCE_REPORTING.enabled) return;

    try {
      const metrics = await this.gatherMetrics();
      const measurement: PerformanceMeasurement = {
        metrics,
        overall: this.calculateOverallScore(metrics),
        timestamp: Date.now()
      };

      this.measurements.push(measurement);
      this.trimMeasurements();
      this.notifyObservers(measurement);
      await this.reportPerformance(measurement);
    } catch (error) {
      console.error('Error measuring performance:', error);
    }
  }

  private async gatherMetrics(): Promise<Record<string, number>> {
    const metrics: Record<string, number> = {};

    // Gather Web Vitals
    if ('web-vital' in window) {
      const { getCLS, getFID, getLCP } = (window as any)['web-vital'];
      const [cls, fid, lcp] = await Promise.all([
        getCLS(),
        getFID(),
        getLCP()
      ]);

      metrics['Cumulative Layout Shift'] = cls.value;
      metrics['First Input Delay'] = fid.value;
      metrics['Largest Contentful Paint'] = lcp.value;
    }

    // Gather additional metrics
    const paintMetrics = performance.getEntriesByType('paint');
    paintMetrics.forEach(metric => {
      if (metric.name === 'first-contentful-paint') {
        metrics['First Contentful Paint'] = metric.startTime;
      }
    });

    return metrics;
  }

  private async reportPerformance(measurement: PerformanceMeasurement) {
    if (!PERFORMANCE_REPORTING.enabled) return;

    try {
      const response = await fetch(PERFORMANCE_REPORTING.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(measurement)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error reporting performance:', error);
    }
  }

  public subscribe(callback: (measurement: PerformanceMeasurement) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  public subscribeToAlerts(callback: (alert: PerformanceAlert) => void) {
    this.alertObservers.add(callback);
    return () => this.alertObservers.delete(callback);
  }

  private notifyObservers(measurement: PerformanceMeasurement) {
    this.observers.forEach(callback => callback(measurement));
  }

  private notifyAlertObservers(alert: PerformanceAlert) {
    this.alertObservers.forEach(callback => callback(alert));
  }

  public getLatestMeasurement(): PerformanceMeasurement | null {
    return this.measurements[this.measurements.length - 1] || null;
  }

  public getMeasurements(): PerformanceMeasurement[] {
    return [...this.measurements];
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getCategoryScores(): Record<string, number> {
    const latest = this.getLatestMeasurement();
    if (!latest) return {};

    const scores: Record<string, number> = {};
    Object.entries(PERFORMANCE_CATEGORIES).forEach(([category, { metrics }]) => {
      const categoryMetrics = metrics.map(name => latest.metrics[name] || 0);
      scores[category] = categoryMetrics.reduce((sum, value) => sum + value, 0) / categoryMetrics.length;
    });

    return scores;
  }
}

export const performanceMonitor = new PerformanceMonitor(); 