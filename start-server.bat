@echo off
echo Starting Biasbuster server...

:: Set environment variables
set PORT=8080
set NODE_ENV=development

:: Start the server
npm run dev

echo Server started successfully. 