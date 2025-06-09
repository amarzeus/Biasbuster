const { execSync } = require('child_process')
const path = require('path')

const CHECKS = [
  {
    name: 'TypeScript Type Checking',
    command: 'npm run type-check',
    critical: true
  },
  {
    name: 'Linting',
    command: 'npm run lint',
    critical: true
  },
  {
    name: 'Test Generation',
    command: 'npm run generate:tests',
    critical: false
  },
  {
    name: 'Issue Checking',
    command: 'npm run check:issues',
    critical: false
  },
  {
    name: 'Test Coverage',
    command: 'npm run test:coverage',
    critical: true
  },
  {
    name: 'Code Analysis',
    command: 'npm run analyze',
    critical: false
  }
]

function runCheck(check) {
  console.log(`\nRunning ${check.name}...`)
  try {
    execSync(check.command, { stdio: 'inherit' })
    console.log(`✅ ${check.name} passed`)
    return true
  } catch (error) {
    console.error(`❌ ${check.name} failed`)
    if (check.critical) {
      throw error
    }
    return false
  }
}

function runChecks() {
  console.log('Starting code quality checks...\n')
  
  const results = {
    passed: [],
    failed: [],
    criticalFailed: false
  }

  for (const check of CHECKS) {
    try {
      const passed = runCheck(check)
      if (passed) {
        results.passed.push(check.name)
      } else {
        results.failed.push(check.name)
      }
    } catch (error) {
      results.failed.push(check.name)
      if (check.critical) {
        results.criticalFailed = true
      }
    }
  }

  // Print summary
  console.log('\n=== Check Summary ===')
  console.log('\nPassed:')
  results.passed.forEach(name => console.log(`✅ ${name}`))
  
  if (results.failed.length > 0) {
    console.log('\nFailed:')
    results.failed.forEach(name => console.log(`❌ ${name}`))
  }

  // Exit with appropriate code
  if (results.criticalFailed) {
    console.error('\n❌ Critical checks failed. Please fix the issues above.')
    process.exit(1)
  } else if (results.failed.length > 0) {
    console.warn('\n⚠️ Some non-critical checks failed. Please review the issues above.')
    process.exit(0)
  } else {
    console.log('\n✅ All checks passed successfully!')
    process.exit(0)
  }
}

runChecks() 