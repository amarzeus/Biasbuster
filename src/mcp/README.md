# Biasbuster MCP Server

This directory contains the implementation of the Biasbuster Model Context Protocol (MCP) Server for Cursor IDE integration. The MCP server provides advanced bias detection, analysis, and annotation capabilities that can be consumed by Cursor IDE and other clients supporting the MCP protocol.

## Features

- **Dual Transport Support**: Runs in both HTTP and stdio modes
- **Multiple Analysis Tools**: Bias analysis, code analysis, perspective analysis, and document annotation
- **IDE Integration**: Designed to work seamlessly with Cursor IDE
- **RESTful API**: Clean, consistent, and well-documented API endpoints
- **Typed Responses**: TypeScript types for all requests and responses

## Quick Start

### Running the MCP Server

You can run the MCP server in different transport modes:

**HTTP Transport** (for API clients and web integration):
```bash
npm run mcp-http
```

**stdio Transport** (for direct IDE integration):
```bash
npm run mcp-stdio
```

**Dual Transport** (both HTTP and stdio):
```bash
npm run mcp-dual
```

Or using the provided scripts:
```bash
# Windows
start-mcp-server.bat

# Linux/Mac
./start-mcp-server.sh
```

### Configuration

The MCP server supports the following environment variables:

- `ENABLE_MCP_SERVER`: Set to `true` to enable MCP server (default: `false`)
- `MCP_PORT`: HTTP port for the MCP server (default: `8081`)
- `MCP_TRANSPORT`: Transport mode: `http`, `stdio`, or `dual` (default: `http`)

## Available Tools

The Biasbuster MCP server provides the following tools:

### 1. Bias Analysis Tool

Analyzes text for biased language and provides detailed feedback.

**Endpoint**: `/api/v1/tools/biasbuster/analyzeBias`

**Request**:
```json
{
  "articleText": "Your article text here",
  "options": {
    "includeSentiment": true,
    "includeCredibility": true,
    "preferredModel": "auto",
    "language": "en",
    "maxTokens": 4000
  }
}
```

### 2. Code Analysis Tool

Analyzes code for potentially biased terminology, variable names, or algorithmic bias.

**Endpoint**: `/api/v1/tools/biasbuster/analyzeCode`

**Request**:
```json
{
  "codeText": "Your source code here",
  "language": "javascript",
  "checkForBias": true
}
```

### 3. Perspective Analysis Tool

Analyzes text from multiple perspectives or viewpoints to provide a balanced view.

**Endpoint**: `/api/v1/tools/biasbuster/analyzePerspectives`

**Request**:
```json
{
  "articleText": "Your article text here",
  "topic": "Optional topic",
  "viewpoints": ["liberal", "conservative", "neutral"]
}
```

### 4. Document Annotation Tool

Annotates a document with bias, sentiment, claims, or source information.

**Endpoint**: `/api/v1/tools/biasbuster/annotateDocument`

**Request**:
```json
{
  "documentText": "Your document text here",
  "annotationType": "bias"
}
```

## Cursor IDE Integration

To integrate the Biasbuster MCP server with Cursor IDE:

1. Start the MCP server with stdio transport:
   ```bash
   npm run mcp-stdio
   ```

2. Configure Cursor IDE to use the Biasbuster MCP server by adding it to your Cursor IDE settings:
   ```json
   {
     "mcpServers": [
       {
         "name": "Biasbuster",
         "transport": "stdio",
         "command": "npm run mcp-stdio",
         "workingDir": "/path/to/biasbuster"
       }
     ]
   }
   ```

3. You can now use Biasbuster tools directly from Cursor IDE!

## API Reference

For detailed API documentation, visit:
- `/api/v1/resources` - List all available resources and tools
- `/api/v1/health` - MCP server health information

## Development

To contribute to the MCP server development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Add new tools by extending the `tools.ts` file.

## License

MIT - See the main project LICENSE file for details. 