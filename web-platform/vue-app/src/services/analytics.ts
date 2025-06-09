interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
}

class Analytics {
  private static instance: Analytics
  private isInitialized = false

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  init(): void {
    if (this.isInitialized) return

    // Initialize analytics providers
    this.initializeGoogleAnalytics()
    this.initializeErrorTracking()
    this.initializePerformanceMonitoring()

    this.isInitialized = true
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized')
      return
    }

    // Track event in Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      })
    }

    // Log event for debugging
    console.debug('Analytics Event:', event)
  }

  trackPageView(path: string): void {
    if (!this.isInitialized) return

    // Track page view in Google Analytics
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_ID, {
        page_path: path
      })
    }

    // Log page view for debugging
    console.debug('Page View:', path)
  }

  trackError(error: Error): void {
    if (!this.isInitialized) return

    // Track error in error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error)
    }

    // Log error for debugging
    console.error('Analytics Error:', error)
  }

  private initializeGoogleAnalytics(): void {
    // Initialize Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', import.meta.env.VITE_GA_ID)
  }

  private initializeErrorTracking(): void {
    // Initialize error tracking service
    if (import.meta.env.VITE_SENTRY_DSN) {
      import('@sentry/vue').then(({ init }) => {
        init({
          app: window.app,
          dsn: import.meta.env.VITE_SENTRY_DSN,
          environment: import.meta.env.MODE,
          integrations: [
            new window.Sentry.BrowserTracing(),
            new window.Sentry.Replay()
          ],
          tracesSampleRate: 1.0
        })
      })
    }
  }

  private initializePerformanceMonitoring(): void {
    // Initialize performance monitoring
    if ('performance' in window) {
      window.performance.mark('analytics-initialized')
    }
  }
}

export const analytics = Analytics.getInstance() 