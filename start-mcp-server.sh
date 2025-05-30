#!/bin/bash
echo "Starting Biasbuster MCP Server..."

# Set environment variables
export ENABLE_MCP_SERVER=true
export MCP_PORT=8081
export MCP_TRANSPORT=dual

# Start the server
npx ts-node src/mcp/index.ts

echo "MCP Server stopped." 