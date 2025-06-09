const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  url: process.env.BASE_URL || 'http://localhost:4173',
  metrics: [
    'first-contentful-paint',
    'largest-contentful-paint',
    'cumulative-layout-shift',
    'total-blocking-time',
    'speed-index'
  ],
  thresholds: {
    'first-contentful-paint': 2000,
    'largest-contentful-paint': 2500,
    'cumulative-layout-shift': 0.1,
    'total-blocking-time': 300,
    'speed-index': 3000
  }
};

// Run Lighthouse
function runLighthouse() {
  console.log('Running Lighthouse audit...');
  
  const command = `lighthouse ${CONFIG.url} --output json --output-path lighthouse-report.json --chrome-flags="--headless --no-sandbox"`;
  
  try {
    execSync(command);
    return JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
    process.exit(1);
  }
}

// Run Web Vitals
function runWebVitals() {
  console.log('Running Web Vitals test...');
  
  const command = `playwright test tests/performance/web-vitals.spec.ts --headed`;
  
  try {
    execSync(command);
    return JSON.parse(fs.readFileSync('web-vitals-report.json', 'utf8'));
  } catch (error) {
    console.error('Web Vitals test failed:', error);
    process.exit(1);
  }
}

// Analyze results
function analyzeResults(lighthouseResults, webVitalsResults) {
  const results = {
    timestamp: new Date().toISOString(),
    lighthouse: {},
    webVitals: {},
    passed: true,
    issues: []
  };

  // Analyze Lighthouse metrics
  CONFIG.metrics.forEach(metric => {
    const value = lighthouseResults.audits[metric].numericValue;
    results.lighthouse[metric] = value;
    
    if (value > CONFIG.thresholds[metric]) {
      results.passed = false;
      results.issues.push({
        metric,
        value,
        threshold: CONFIG.thresholds[metric],
        source: 'lighthouse'
      });
    }
  });

  // Analyze Web Vitals
  Object.entries(webVitalsResults).forEach(([metric, value]) => {
    results.webVitals[metric] = value;
    
    if (CONFIG.thresholds[metric] && value > CONFIG.thresholds[metric]) {
      results.passed = false;
      results.issues.push({
        metric,
        value,
        threshold: CONFIG.thresholds[metric],
        source: 'web-vitals'
      });
    }
  });

  return results;
}

// Generate report
function generateReport(results) {
  const reportPath = path.join(__dirname, '../performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log('\n=== Performance Report ===\n');
  
  console.log('Lighthouse Metrics:');
  Object.entries(results.lighthouse).forEach(([metric, value]) => {
    console.log(`  ${metric}: ${value}ms`);
  });
  
  console.log('\nWeb Vitals:');
  Object.entries(results.webVitals).forEach(([metric, value]) => {
    console.log(`  ${metric}: ${value}ms`);
  });
  
  if (results.issues.length > 0) {
    console.log('\nIssues Found:');
    results.issues.forEach(issue => {
      console.log(`  ${issue.metric} (${issue.source}): ${issue.value}ms > ${issue.threshold}ms`);
    });
  } else {
    console.log('\n✅ All metrics within thresholds');
  }
  
  console.log(`\nFull report saved to: ${reportPath}`);
}

// Main function
function testPerformance() {
  console.log('Starting performance tests...\n');
  
  const lighthouseResults = runLighthouse();
  const webVitalsResults = runWebVitals();
  const results = analyzeResults(lighthouseResults, webVitalsResults);
  generateReport(results);
  
  if (!results.passed) {
    process.exit(1);
  }
}

// Run the tests
testPerformance(); 