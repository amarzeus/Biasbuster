@echo off
echo Starting Biasbuster MCP Server...

:: Set environment variables
set ENABLE_MCP_SERVER=true
set MCP_PORT=8081
set MCP_TRANSPORT=dual

:: Start the server
npx ts-node src/mcp/index.ts

echo MCP Server stopped. 