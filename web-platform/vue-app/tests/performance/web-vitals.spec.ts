import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

test.describe('Web Vitals', () => {
  test('measure Core Web Vitals', async ({ page }) => {
    // Navigate to the application
    await page.goto(process.env.BASE_URL || 'http://localhost:4173');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Collect Web Vitals metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          FCP: 0,
          LCP: 0,
          CLS: 0,
          FID: 0,
          TTFB: 0
        };

        // First Contentful Paint
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          vitals.FCP = entries[entries.length - 1].startTime;
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          vitals.LCP = entries[entries.length - 1].startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
          let cls = 0;
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
          vitals.CLS = cls;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          vitals.FID = entries[0].duration;
        }).observe({ entryTypes: ['first-input'] });

        // Time to First Byte
        vitals.TTFB = performance.timing.responseStart - performance.timing.requestStart;

        // Wait for all metrics to be collected
        setTimeout(() => resolve(vitals), 5000);
      });
    });

    // Save metrics to file
    writeFileSync('web-vitals-report.json', JSON.stringify(metrics, null, 2));

    // Assert metrics are within acceptable ranges
    expect(metrics.FCP).toBeLessThan(2000);
    expect(metrics.LCP).toBeLessThan(2500);
    expect(metrics.CLS).toBeLessThan(0.1);
    expect(metrics.FID).toBeLessThan(100);
    expect(metrics.TTFB).toBeLessThan(600);
  });

  test('measure interaction performance', async ({ page }) => {
    // Navigate to the application
    await page.goto(process.env.BASE_URL || 'http://localhost:4173');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Measure button click performance
    const clickMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const button = document.querySelector('button');
        if (!button) {
          resolve({ error: 'No button found' });
          return;
        }

        const start = performance.now();
        button.click();
        const end = performance.now();

        resolve({
          clickTime: end - start
        });
      });
    });

    // Assert click performance
    expect(clickMetrics.clickTime).toBeLessThan(100);
  });

  test('measure scroll performance', async ({ page }) => {
    // Navigate to the application
    await page.goto(process.env.BASE_URL || 'http://localhost:4173');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Measure scroll performance
    const scrollMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const start = performance.now();
        window.scrollTo(0, document.body.scrollHeight);
        const end = performance.now();

        resolve({
          scrollTime: end - start
        });
      });
    });

    // Assert scroll performance
    expect(scrollMetrics.scrollTime).toBeLessThan(100);
  });

  test('measure animation performance', async ({ page }) => {
    // Navigate to the application
    await page.goto(process.env.BASE_URL || 'http://localhost:4173');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Measure animation performance
    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const element = document.querySelector('.animated-element');
        if (!element) {
          resolve({ error: 'No animated element found' });
          return;
        }

        const start = performance.now();
        element.classList.add('animate');
        const end = performance.now();

        resolve({
          animationTime: end - start
        });
      });
    });

    // Assert animation performance
    expect(animationMetrics.animationTime).toBeLessThan(100);
  });
}); 