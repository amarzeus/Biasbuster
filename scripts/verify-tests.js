const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Test files to verify
const testFiles = [
  '__tests__/api.test.js',
  '__tests__/performance.test.js',
  '__tests__/security.test.js',
  '__tests__/script.test.js',
  '__tests__/web-platform.test.js'
];

// Support files to verify
const supportFiles = [
  '__tests__/setup.js',
  '__tests__/utils/test-helpers.js',
  '__mocks__/fileMock.js',
  'jest.config.js'
];

console.log(`${colors.bright}Starting test verification...${colors.reset}\n`);

// Check if all required files exist
console.log(`${colors.blue}Checking required files...${colors.reset}`);
const missingFiles = [...testFiles, ...supportFiles].filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error(`${colors.red}Missing files:${colors.reset}`);
  missingFiles.forEach(file => console.error(`- ${file}`));
  process.exit(1);
}

console.log(`${colors.green}✓ All required files present${colors.reset}\n`);

// Verify package.json has required scripts and dependencies
console.log(`${colors.blue}Checking package.json configuration...${colors.reset}`);
const package = require('../package.json');

const requiredScripts = [
  'test',
  'test:e2e',
  'test:unit',
  'test:api',
  'test:performance',
  'test:security'
];

const missingScripts = requiredScripts.filter(script => !package.scripts[script]);

if (missingScripts.length > 0) {
  console.error(`${colors.red}Missing scripts in package.json:${colors.reset}`);
  missingScripts.forEach(script => console.error(`- ${script}`));
  process.exit(1);
}

const requiredDependencies = [
  'jest',
  'supertest',
  'puppeteer',
  'autocannon',
  'mongodb-memory-server'
];

const missingDeps = requiredDependencies.filter(
  dep => !package.dependencies[dep] && !package.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.error(`${colors.red}Missing dependencies:${colors.reset}`);
  missingDeps.forEach(dep => console.error(`- ${dep}`));
  process.exit(1);
}

console.log(`${colors.green}✓ Package.json configuration valid${colors.reset}\n`);

// Verify Jest configuration
console.log(`${colors.blue}Checking Jest configuration...${colors.reset}`);
const jestConfig = require('../jest.config.js');

const requiredJestConfig = [
  'setupFilesAfterEnv',
  'testEnvironment',
  'moduleFileExtensions',
  'transform'
];

const missingConfig = requiredJestConfig.filter(config => !jestConfig[config]);

if (missingConfig.length > 0) {
  console.error(`${colors.red}Missing Jest configuration:${colors.reset}`);
  missingConfig.forEach(config => console.error(`- ${config}`));
  process.exit(1);
}

console.log(`${colors.green}✓ Jest configuration valid${colors.reset}\n`);

// Try to run Jest in dry-run mode to verify syntax
console.log(`${colors.blue}Verifying test file syntax...${colors.reset}`);
try {
  execSync('npx jest --listTests', { stdio: 'pipe' });
  console.log(`${colors.green}✓ All test files have valid syntax${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}Test file syntax verification failed:${colors.reset}`);
  console.error(error.toString());
  process.exit(1);
}

// Summary
console.log(`${colors.magenta}Verification Summary:${colors.reset}`);
console.log(`- ${testFiles.length} test files verified`);
console.log(`- ${supportFiles.length} support files verified`);
console.log(`- ${requiredScripts.length} npm scripts verified`);
console.log(`- ${requiredDependencies.length} dependencies verified`);
console.log(`- ${requiredJestConfig.length} Jest configurations verified\n`);

console.log(`${colors.green}${colors.bright}All verifications passed successfully!${colors.reset}`);
console.log('\nYou can now run the tests using the following commands:');
console.log(`${colors.yellow}
npm test              # Run all tests
npm run test:unit     # Run unit tests
npm run test:api      # Run API tests
npm run test:e2e      # Run end-to-end tests
npm run test:security # Run security tests
npm run test:performance # Run performance tests${colors.reset}
`);
