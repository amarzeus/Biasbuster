#!/bin/bash

echo "Biasbuster MCP Server Startup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in your PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo "Creating default .env file..."
    cat > .env << EOF
PORT=8080
AI_SERVICE=mock
# Add your API keys below for using external AI services
# GROQ_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
EOF
fi

# Check if dist folder exists, build if not
if [ ! -d dist ]; then
    echo "Building TypeScript project..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "Error: Build failed. Make sure all dependencies are installed."
        echo "Try running 'npm install' first."
        exit 1
    fi
fi

# Set environment variables
export AI_SERVICE=mock
export PORT=8080

echo "Starting Biasbuster MCP Server..."
echo "Using AI_SERVICE=$AI_SERVICE"
echo "Server will be available at http://localhost:$PORT/"

# Start server
echo ""
node dist/index.js 