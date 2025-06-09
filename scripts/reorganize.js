const fs = require('fs');
const path = require('path');

// Create new directories
const directories = [
    'src/core/bias',
    'src/core/ml',
    'src/core/analytics',
    'src/styles',
    'src/api',
    'src/database',
    'src/extensions',
    '__tests__/unit',
    '__tests__/integration',
    '__tests__/e2e',
    '__tests__/performance',
    '__tests__/security',
    '__tests__/accessibility'
];

// Create directories
directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Move files to their new locations
const moves = [
    {
        from: 'src/routes',
        to: 'src/api/routes'
    },
    {
        from: 'src/controllers',
        to: 'src/api/controllers'
    },
    {
        from: 'src/models',
        to: 'src/database/models'
    },
    {
        from: 'src/migrations',
        to: 'src/database/migrations'
    },
    {
        from: 'chrome-extension',
        to: 'src/extensions/chrome'
    }
];

// Move directories
moves.forEach(move => {
    const fromPath = path.join(process.cwd(), move.from);
    const toPath = path.join(process.cwd(), move.to);
    
    if (fs.existsSync(fromPath)) {
        if (!fs.existsSync(path.dirname(toPath))) {
            fs.mkdirSync(path.dirname(toPath), { recursive: true });
        }
        fs.renameSync(fromPath, toPath);
        console.log(`Moved ${move.from} to ${move.to}`);
    }
});

console.log('Reorganization complete!'); 