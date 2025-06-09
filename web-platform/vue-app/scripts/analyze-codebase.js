const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Paths
const SRC_DIR = path.join(__dirname, '../src')
const REPORT_PATH = path.join(__dirname, '../analysis-report.json')

// Analysis categories
const CATEGORIES = {
  components: {
    pattern: '**/*.vue',
    metrics: {
      total: 0,
      withProps: 0,
      withEmits: 0,
      withTests: 0,
      withDocs: 0,
      withAria: 0
    }
  },
  stores: {
    pattern: '**/stores/*.ts',
    metrics: {
      total: 0,
      withActions: 0,
      withGetters: 0,
      withState: 0
    }
  },
  composables: {
    pattern: '**/composables/*.ts',
    metrics: {
      total: 0,
      withTests: 0,
      withDocs: 0
    }
  },
  tests: {
    pattern: '**/*.spec.ts',
    metrics: {
      total: 0,
      componentTests: 0,
      storeTests: 0,
      composableTests: 0
    }
  }
}

// Analyze a file
function analyzeFile(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf8')
  const metrics = CATEGORIES[category].metrics

  metrics.total++

  switch (category) {
    case 'components':
      if (content.includes('defineProps')) metrics.withProps++
      if (content.includes('defineEmits')) metrics.withEmits++
      if (content.includes('aria-')) metrics.withAria++
      if (content.includes('/**')) metrics.withDocs++
      if (fs.existsSync(filePath.replace('.vue', '.spec.ts'))) metrics.withTests++
      break

    case 'stores':
      if (content.includes('actions:')) metrics.withActions++
      if (content.includes('getters:')) metrics.withGetters++
      if (content.includes('state:')) metrics.withState++
      break

    case 'composables':
      if (content.includes('/**')) metrics.withDocs++
      if (fs.existsSync(filePath.replace('.ts', '.spec.ts'))) metrics.withTests++
      break

    case 'tests':
      if (filePath.includes('/components/')) metrics.componentTests++
      if (filePath.includes('/stores/')) metrics.storeTests++
      if (filePath.includes('/composables/')) metrics.composableTests++
      break
  }
}

// Generate report
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    details: {}
  }

  // Calculate summary
  Object.entries(CATEGORIES).forEach(([category, data]) => {
    report.summary[category] = {
      total: data.metrics.total,
      coverage: calculateCoverage(data.metrics)
    }
  })

  // Add details
  report.details = CATEGORIES

  // Save report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  return report
}

// Calculate coverage percentage
function calculateCoverage(metrics) {
  const total = metrics.total
  if (total === 0) return 0

  const covered = Object.entries(metrics)
    .filter(([key]) => key !== 'total')
    .reduce((sum, [_, value]) => sum + value, 0)

  return Math.round((covered / (Object.keys(metrics).length - 1) / total) * 100)
}

// Main function
function analyzeCodebase() {
  console.log('Analyzing codebase...\n')

  // Analyze each category
  Object.entries(CATEGORIES).forEach(([category, data]) => {
    const files = glob.sync(data.pattern, {
      cwd: SRC_DIR,
      absolute: true
    })

    files.forEach(file => analyzeFile(file, category))
  })

  // Generate report
  const report = generateReport()

  // Print summary
  console.log('=== Analysis Summary ===\n')
  Object.entries(report.summary).forEach(([category, data]) => {
    console.log(`${category}:`)
    console.log(`  Total: ${data.total}`)
    console.log(`  Coverage: ${data.coverage}%\n`)
  })

  // Print details
  console.log('=== Detailed Metrics ===\n')
  Object.entries(report.details).forEach(([category, data]) => {
    console.log(`${category}:`)
    Object.entries(data.metrics).forEach(([metric, value]) => {
      console.log(`  ${metric}: ${value}`)
    })
    console.log('')
  })

  console.log(`Detailed report saved to: ${REPORT_PATH}`)
}

// Run the analyzer
analyzeCodebase() 