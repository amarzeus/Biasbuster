const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// PRD Requirements Categories
const PRD_CATEGORIES = {
  WEBSITE_STRUCTURE: 'Website Structure & Premium UI/UX Design',
  WEBSITE_PAGES: 'Website Pages & Structure',
  CHROME_EXTENSION: 'Chrome Extension & Integration',
  ML_AI: 'World-Class ML/AI Best Practices and Bias Mitigation',
  AI_BACKEND: 'AI, Backend, and Knowledge Base',
  DOCUMENTATION: 'Documentation & Compliance',
  CICD: 'CI/CD Pipeline & Automation',
  METRICS: 'Metrics & KPIs',
  RISKS: 'Risks & Mitigation',
  INNOVATION: 'Innovation & Award-Worthy Features'
};

// Required files and directories
const REQUIRED_STRUCTURE = {
  website: {
    pages: [
      'Homepage',
      'About Us',
      'Product/Features',
      'How It Works',
      'Education Hub',
      'Analytics Dashboard',
      'Demo/Get Started',
      'Blog/News',
      'Contact Us',
      'FAQ',
      'Privacy Policy',
      'Terms of Service',
      'Accessibility Statement',
      'Support/Help Center',
      'Community/Feedback',
      'Judges\' Corner',
      'Transparency Reports',
      'AI Ethics & Governance',
      'Knowledge Base',
      'Testimonials/Partners',
      'Press Kit',
      'Careers'
    ],
    components: [
      'Header',
      'Footer',
      'Navigation',
      'Search',
      'UserProfile',
      'Analytics',
      'Education',
      'Transparency'
    ]
  },
  extension: {
    files: [
      'manifest.json',
      'popup.html',
      'popup.js',
      'contentScript.js',
      'background.js',
      'options.html',
      'options.js'
    ],
    assets: [
      'icons',
      'images',
      'styles'
    ]
  },
  documentation: {
    files: [
      'README.md',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md',
      'LICENSE.md',
      'api.md',
      'user-guide.md',
      'faq.md',
      'privacy-policy.md',
      'terms-of-service.md',
      'accessibility-statement.md',
      'release-notes.md',
      'test-automation-plan.md',
      'kb-automation-plan.md'
    ]
  }
};

// Required features and implementations
const REQUIRED_FEATURES = {
  accessibility: [
    'WCAG 2.1 AA Compliance',
    'Dark/Light Mode',
    'Accessibility Toolbar',
    'ARIA Labels',
    'Keyboard Navigation'
  ],
  performance: [
    'Lazy Loading',
    'Code Splitting',
    'Resource Hints',
    'Image Optimization',
    'Caching'
  ],
  security: [
    'GDPR Compliance',
    'CCPA Compliance',
    'Data Encryption',
    'Secure Authentication',
    'Privacy Controls'
  ],
  ml_ai: [
    'Bias Detection',
    'Explainable AI',
    'Fairness Metrics',
    'Model Auditing',
    'Continuous Learning'
  ]
};

class PRDComplianceChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.success = [];
  }

  checkFileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  checkDirectoryStructure() {
    const baseDir = path.resolve(__dirname, '..');
    
    // Check website pages
    REQUIRED_STRUCTURE.website.pages.forEach(page => {
      const pagePath = path.join(baseDir, 'src', 'views', page.replace(/\//g, '-').toLowerCase() + '.vue');
      if (!this.checkFileExists(pagePath)) {
        this.issues.push(`Missing page: ${page}`);
      }
    });

    // Check components
    REQUIRED_STRUCTURE.website.components.forEach(component => {
      const componentPath = path.join(baseDir, 'src', 'components', component + '.vue');
      if (!this.checkFileExists(componentPath)) {
        this.issues.push(`Missing component: ${component}`);
      }
    });

    // Check extension files
    REQUIRED_STRUCTURE.extension.files.forEach(file => {
      const filePath = path.join(baseDir, 'extension', file);
      if (!this.checkFileExists(filePath)) {
        this.issues.push(`Missing extension file: ${file}`);
      }
    });

    // Check documentation
    REQUIRED_STRUCTURE.documentation.files.forEach(file => {
      const filePath = path.join(baseDir, file);
      if (!this.checkFileExists(filePath)) {
        this.warnings.push(`Missing documentation: ${file}`);
      }
    });
  }

  checkFeatureImplementation() {
    const baseDir = path.resolve(__dirname, '..');
    
    // Check accessibility features
    REQUIRED_FEATURES.accessibility.forEach(feature => {
      const hasFeature = this.searchCodebase(baseDir, feature);
      if (!hasFeature) {
        this.issues.push(`Missing accessibility feature: ${feature}`);
      }
    });

    // Check performance features
    REQUIRED_FEATURES.performance.forEach(feature => {
      const hasFeature = this.searchCodebase(baseDir, feature);
      if (!hasFeature) {
        this.issues.push(`Missing performance feature: ${feature}`);
      }
    });

    // Check security features
    REQUIRED_FEATURES.security.forEach(feature => {
      const hasFeature = this.searchCodebase(baseDir, feature);
      if (!hasFeature) {
        this.issues.push(`Missing security feature: ${feature}`);
      }
    });

    // Check ML/AI features
    REQUIRED_FEATURES.ml_ai.forEach(feature => {
      const hasFeature = this.searchCodebase(baseDir, feature);
      if (!hasFeature) {
        this.issues.push(`Missing ML/AI feature: ${feature}`);
      }
    });
  }

  searchCodebase(baseDir, searchTerm) {
    try {
      const result = execSync(`grep -r "${searchTerm}" ${baseDir}`, { encoding: 'utf-8' });
      return result.length > 0;
    } catch (error) {
      return false;
    }
  }

  checkDependencies() {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
    if (this.checkFileExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Check required dependencies
      const requiredDeps = [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'chart.js',
        'lighthouse',
        'web-vitals'
      ];

      requiredDeps.forEach(dep => {
        if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
          this.warnings.push(`Missing dependency: ${dep}`);
        }
      });
    }
  }

  checkCI_CD() {
    const workflowsDir = path.resolve(__dirname, '..', '.github', 'workflows');
    if (this.checkFileExists(workflowsDir)) {
      const requiredWorkflows = [
        'ci.yml',
        'e2e-tests.yml',
        'performance-tests.yml'
      ];

      requiredWorkflows.forEach(workflow => {
        const workflowPath = path.join(workflowsDir, workflow);
        if (!this.checkFileExists(workflowPath)) {
          this.issues.push(`Missing CI/CD workflow: ${workflow}`);
        }
      });
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalSuccess: this.success.length
      },
      issues: this.issues,
      warnings: this.warnings,
      success: this.success
    };

    // Save report to file
    const reportPath = path.resolve(__dirname, '..', 'prd-compliance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Print summary to console
    console.log('\nPRD Compliance Report');
    console.log('====================');
    console.log(`Total Issues: ${this.issues.length}`);
    console.log(`Total Warnings: ${this.warnings.length}`);
    console.log(`Total Success: ${this.success.length}`);
    
    if (this.issues.length > 0) {
      console.log('\nIssues:');
      this.issues.forEach(issue => console.log(`- ${issue}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\nWarnings:');
      this.warnings.forEach(warning => console.log(`- ${warning}`));
    }

    return report;
  }

  run() {
    console.log('Checking PRD compliance...');
    
    this.checkDirectoryStructure();
    this.checkFeatureImplementation();
    this.checkDependencies();
    this.checkCI_CD();
    
    return this.generateReport();
  }
}

// Run the checker
const checker = new PRDComplianceChecker();
const report = checker.run();

// Exit with error if there are issues
if (report.summary.totalIssues > 0) {
  process.exit(1);
} 