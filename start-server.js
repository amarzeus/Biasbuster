const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Biasbuster Server Startup');
console.log('========================');

// Check if Node.js is installed
try {
    execSync('node --version');
} catch (error) {
    console.error('Error: Node.js is not installed or not in your PATH.');
    console.error('Please install Node.js from https://nodejs.org/');
    process.exit(1);
}

// Check if .env file exists, create if not
if (!fs.existsSync('.env')) {
    console.log('Creating default .env file...');
    const envContent = `PORT=8080
AI_SERVICE=mock
# Add your API keys below for using external AI services
# GROQ_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here`;
    fs.writeFileSync('.env', envContent);
}

// Check if dist folder exists, build if not
if (!fs.existsSync('dist')) {
    console.log('Building TypeScript project...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error: Build failed. Make sure all dependencies are installed.');
        console.error('Try running \'npm install\' first.');
        process.exit(1);
    }
}

// Set environment variables
process.env.AI_SERVICE = 'mock';
process.env.PORT = '8080';
process.env.NODE_ENV = 'development';

console.log('Starting Biasbuster Server...');
console.log(`Using AI_SERVICE=${process.env.AI_SERVICE}`);
console.log(`Server will be available at http://localhost:${process.env.PORT}/`);

// Start server
console.log('');
if (process.env.NODE_ENV === 'development') {
    execSync('npm run dev', { stdio: 'inherit' });
} else {
    execSync('node dist/index.js', { stdio: 'inherit' });
} 