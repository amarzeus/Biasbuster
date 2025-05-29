@echo off
echo Starting Biasbuster server with Mock AI service...
set AI_SERVICE=mock
npx ts-node src/index.ts
pause 