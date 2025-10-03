import { AnalyticsData, PerformanceMetrics } from '../types';

class AnalyticsService {
  private events: AnalyticsData[] = [];
  private userId: string;
  private sessionId: string;

  constructor() {
    this.userId = this.generateUserId();
    this.sessionId = this.generateSessionId();
    this.loadStoredEvents();
  }

  private generateUserId(): string {
    let userId = localStorage.getItem('biasbuster_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('biasbuster_user_id', userId);
    }
    return userId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredEvents(): void {
    const stored = localStorage.getItem('biasbuster_analytics');
    if (stored) {
      try {
        this.events = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load stored analytics:', e);
        this.events = [];
      }
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('biasbuster_analytics', JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }

  trackEvent(action: string, metadata: Record<string, any> = {}, performance?: Partial<PerformanceMetrics>): void {
    const event: AnalyticsData = {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      action,
      metadata,
      performance: {
        responseTime: performance?.responseTime || 0,
        accuracy: performance?.accuracy || 0,
        userSatisfaction: performance?.userSatisfaction || 0,
      },
    };

    this.events.push(event);
    this.saveEvents();

    // In a real app, send to analytics server
    console.log('Analytics Event:', event);
  }

  trackAnalysis(textLength: number, findingsCount: number, responseTime: number): void {
    this.trackEvent('analysis_completed', {
      textLength,
      findingsCount,
    }, {
      responseTime,
    });
  }

  trackFeedback(findingIndex: number, vote: 'up' | 'down'): void {
    this.trackEvent('feedback_submitted', {
      findingIndex,
      vote,
    });
  }

  trackMediaUpload(mediaType: string, fileSize: number): void {
    this.trackEvent('media_uploaded', {
      mediaType,
      fileSize,
    });
  }

  getEvents(): AnalyticsData[] {
    return [...this.events];
  }

  getUserStats(): { totalAnalyses: number; totalFeedback: number; averageResponseTime: number } {
    const analyses = this.events.filter(e => e.action === 'analysis_completed');
    const feedbacks = this.events.filter(e => e.action === 'feedback_submitted');
    const avgResponseTime = analyses.length > 0
      ? analyses.reduce((sum, e) => sum + e.performance.responseTime, 0) / analyses.length
      : 0;

    return {
      totalAnalyses: analyses.length,
      totalFeedback: feedbacks.length,
      averageResponseTime: avgResponseTime,
    };
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('biasbuster_analytics');
  }
}

export const analyticsService = new AnalyticsService();
