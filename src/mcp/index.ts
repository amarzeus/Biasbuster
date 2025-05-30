import dotenv from 'dotenv';
import { startMcpHttpServer, startMcpStdioTransport } from './mcpServer';

// Load environment variables
dotenv.config();

/**
 * Initialize and start the Biasbuster MCP server
 */
export function initializeMcpServer(): void {
  // Get the transport mode from environment or arguments
  const transportMode = getTransportMode();
  const port = parseInt(process.env.MCP_PORT || '8081', 10);
  
  console.log(`Starting Biasbuster MCP Server with ${transportMode} transport...`);
  
  // Start the appropriate transport
  switch (transportMode) {
    case 'http':
      startMcpHttpServer(port);
      break;
    case 'stdio':
      startMcpStdioTransport();
      break;
    case 'dual':
      startMcpHttpServer(port);
      startMcpStdioTransport();
      break;
    default:
      console.error(`Unknown transport mode: ${transportMode}. Using 'http' as default.`);
      startMcpHttpServer(port);
  }
}

/**
 * Determine which transport mode to use
 */
function getTransportMode(): 'http' | 'stdio' | 'dual' {
  // Check command line arguments
  const args = process.argv.slice(2);
  if (args.includes('--stdio')) return 'stdio';
  if (args.includes('--http')) return 'http';
  if (args.includes('--dual')) return 'dual';
  
  // Check environment variable
  const envTransport = process.env.MCP_TRANSPORT?.toLowerCase();
  if (envTransport === 'stdio') return 'stdio';
  if (envTransport === 'http') return 'http';
  if (envTransport === 'dual') return 'dual';
  
  // Default to HTTP transport
  return 'http';
}

// Start the server if this file is run directly
if (require.main === module) {
  initializeMcpServer();
} 