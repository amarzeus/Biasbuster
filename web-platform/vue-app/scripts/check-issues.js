const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Paths
const SRC_DIR = path.join(__dirname, '../src')
const REPORT_PATH = path.join(__dirname, '../issues-report.json')

// Define checks
const CHECKS = [
  {
    name: 'Missing default export',
    pattern: /export default/,
    message: 'Component should have a default export'
  },
  {
    name: 'Missing props definition',
    pattern: /defineProps/,
    message: 'Component should define props'
  },
  {
    name: 'Missing TypeScript interface for props',
    pattern: /interface Props/,
    message: 'Component should have a TypeScript interface for props'
  },
  {
    name: 'Missing emits definition',
    pattern: /defineEmits/,
    message: 'Component should define emits'
  },
  {
    name: 'Missing ARIA labels',
    pattern: /aria-label/,
    message: 'Component should have ARIA labels for accessibility'
  },
  {
    name: 'Missing test file',
    pattern: /\.spec\.ts$/,
    message: 'Component should have a test file',
    checkFile: true
  },
  {
    name: 'Missing documentation',
    pattern: /\/\*\*[\s\S]*?\*\//,
    message: 'Component should have documentation'
  },
  {
    name: 'Missing error handling',
    pattern: /try\s*{/,
    message: 'Component should include error handling'
  },
  {
    name: 'Missing loading states',
    pattern: /loading/,
    message: 'Component should handle loading states'
  },
  {
    name: 'Missing input validation',
    pattern: /validate/,
    message: 'Component should validate inputs'
  }
]

// Check a single file
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const issues = []

  CHECKS.forEach(check => {
    if (check.checkFile) {
      const testFile = filePath.replace('.vue', '.spec.ts')
      if (!fs.existsSync(testFile)) {
        issues.push({
          check: check.name,
          message: check.message
        })
      }
    } else if (!check.pattern.test(content)) {
      issues.push({
        check: check.name,
        message: check.message
      })
    }
  })

  return issues
}

// Check a component and its test file
function checkComponent(componentPath) {
  const issues = checkFile(componentPath)
  const testPath = componentPath.replace('.vue', '.spec.ts')

  if (fs.existsSync(testPath)) {
    const testIssues = checkFile(testPath)
    issues.push(...testIssues.map(issue => ({
      ...issue,
      file: 'test'
    })))
  }

  return issues
}

// Generate report
function generateReport(issues) {
  const report = {
    timestamp: new Date().toISOString(),
    totalComponents: issues.length,
    componentsWithIssues: issues.filter(i => i.issues.length > 0).length,
    issues: issues
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  return report
}

// Main function
function checkIssues() {
  console.log('Checking for common issues...\n')

  // Find all Vue components
  const components = glob.sync('**/*.vue', {
    cwd: SRC_DIR,
    absolute: true
  })

  if (components.length === 0) {
    console.log('No Vue components found!')
    return
  }

  // Check each component
  const issues = components.map(componentPath => ({
    component: path.relative(SRC_DIR, componentPath),
    issues: checkComponent(componentPath)
  }))

  // Generate report
  const report = generateReport(issues)

  // Print summary
  console.log('=== Issue Summary ===\n')
  console.log(`Total Components: ${report.totalComponents}`)
  console.log(`Components with Issues: ${report.componentsWithIssues}\n`)

  // Print detailed issues
  issues.forEach(({ component, issues }) => {
    if (issues.length > 0) {
      console.log(`\n${component}:`)
      issues.forEach(issue => {
        console.log(`  - ${issue.check}: ${issue.message}`)
      })
    }
  })

  console.log(`\nDetailed report saved to: ${REPORT_PATH}`)

  // Exit with error if issues found
  if (report.componentsWithIssues > 0) {
    process.exit(1)
  }
}

// Run the checker
checkIssues() 