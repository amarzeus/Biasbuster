@echo off
echo Biasbuster MCP Server Startup
echo ==========================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists, create if not
if not exist .env (
    echo Creating default .env file...
    echo PORT=8080 > .env
    echo AI_SERVICE=mock >> .env
    echo # Add your API keys below for using external AI services >> .env
    echo # GROQ_API_KEY=your_key_here >> .env
    echo # ANTHROPIC_API_KEY=your_key_here >> .env
    echo # OPENAI_API_KEY=your_key_here >> .env
)

REM Check if dist folder exists, build if not
if not exist dist (
    echo Building TypeScript project...
    call npm run build
    if %ERRORLEVEL% neq 0 (
        echo Error: Build failed. Make sure all dependencies are installed.
        echo Try running "npm install" first.
        pause
        exit /b 1
    )
)

REM Set environment variables
set AI_SERVICE=mock
set PORT=8080

echo Starting Biasbuster MCP Server...
echo Using AI_SERVICE=%AI_SERVICE%
echo Server will be available at http://localhost:%PORT%/

REM Start server
echo.
node dist/index.js

pause 