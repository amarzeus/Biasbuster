import express from 'express';
import { createInterface } from 'readline';
import { analyzeBias } from '../tools/analyzeBias';
import { BiasBusterResponse } from '../services/aiService';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { 
  biasAnalysisTool, 
  codeAnalysisTool, 
  perspectiveAnalysisTool, 
  documentAnnotationTool 
} from './tools';

// MCP Tool Context type
interface ToolContext {
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

// MCP Tool Request type
interface ToolRequest {
  input: {
    articleText: string;
    options?: {
      includeSentiment?: boolean;
      includeCredibility?: boolean;
      preferredModel?: string;
      language?: string;
      maxTokens?: number;
    };
  };
}

// MCP Tool Response type
interface ToolResponse {
  output: BiasBusterResponse;
  success: boolean;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Biasbuster MCP Tool for bias analysis
 */
export async function biasbusterTool(
  context: ToolContext,
  req: ToolRequest
): Promise<ToolResponse> {
  try {
    const { articleText, options } = req.input;
    
    if (!articleText) {
      return {
        output: {} as BiasBusterResponse,
        success: false,
        message: "Missing required field: articleText"
      };
    }
    
    // Call the analyzeBias function with the article text and options
    const result = await analyzeBias(articleText, options);
    
    return {
      output: result,
      success: true,
      message: "Bias analysis complete",
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        model: result._meta?.modelUsed || "unknown"
      }
    };
  } catch (error: any) {
    console.error('Error in biasbuster MCP tool:', error);
    return {
      output: {} as BiasBusterResponse,
      success: false,
      message: `Analysis failed: ${error.message}`,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    };
  }
}

/**
 * Start the MCP HTTP server
 */
export function startMcpHttpServer(port: number = 8081): void {
  const app = express();
  
  // Apply middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  
  // MCP resources endpoint
  app.get('/api/v1/resources', (req, res) => {
    res.json({
      resources: [
        {
          name: "biasbuster",
          version: "1.0.0",
          description: "AI-powered bias detection for news articles and code",
          tools: [
            {
              name: "analyzeBias",
              description: "Analyze text for bias and provide detailed feedback",
              input_schema: {
                type: "object",
                properties: {
                  articleText: {
                    type: "string",
                    description: "The article text to analyze for bias"
                  },
                  options: {
                    type: "object",
                    properties: {
                      includeSentiment: { type: "boolean" },
                      includeCredibility: { type: "boolean" },
                      preferredModel: { type: "string" },
                      language: { type: "string" },
                      maxTokens: { type: "number" }
                    }
                  }
                },
                required: ["articleText"]
              },
              output_schema: {
                type: "object",
                properties: {
                  MainTopic: { type: "string" },
                  BiasDetected: { type: "string", enum: ["yes", "no"] },
                  BiasInstances: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Sentence: { type: "string" },
                        BiasType: { type: "string" },
                        Explanation: { type: "string" },
                        Severity: { type: "string" },
                        Justification: { type: "string" },
                        Mitigation: { type: "string" }
                      }
                    }
                  },
                  BiasSummary: { type: "string" },
                  TrustedSources: { type: "array", items: { type: "string" } },
                  EducationalContent: { type: "string" }
                }
              }
            },
            {
              name: "analyzeCode",
              description: "Analyze code for potential bias in naming, comments, or algorithms",
              input_schema: {
                type: "object",
                properties: {
                  codeText: {
                    type: "string",
                    description: "The code to analyze"
                  },
                  language: {
                    type: "string",
                    description: "The programming language of the code"
                  },
                  checkForBias: {
                    type: "boolean",
                    description: "Whether to check for bias in the code"
                  }
                },
                required: ["codeText", "language"]
              }
            },
            {
              name: "analyzePerspectives",
              description: "Analyze text from multiple perspectives or viewpoints",
              input_schema: {
                type: "object",
                properties: {
                  articleText: {
                    type: "string",
                    description: "The text to analyze"
                  },
                  topic: {
                    type: "string",
                    description: "The main topic of the text"
                  },
                  viewpoints: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of viewpoints to analyze from"
                  }
                },
                required: ["articleText"]
              }
            },
            {
              name: "annotateDocument",
              description: "Annotate a document with bias, sentiment, or source information",
              input_schema: {
                type: "object",
                properties: {
                  documentText: {
                    type: "string",
                    description: "The document text to annotate"
                  },
                  annotationType: {
                    type: "string",
                    enum: ["bias", "sentiment", "claims", "sources"],
                    description: "The type of annotation to perform"
                  }
                },
                required: ["documentText", "annotationType"]
              }
            }
          ]
        }
      ]
    });
  });
  
  // MCP tool endpoints
  app.post('/api/v1/tools/biasbuster/analyzeBias', async (req, res) => {
    try {
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
        userId: req.headers['x-user-id'] as string
      };
      
      const result = await biasAnalysisTool(context, req.body);
      res.json(result);
    } catch (e: any) {
      console.error('Error in bias analysis endpoint:', e);
      res.status(500).json({
        success: false,
        message: `Tool execution failed: ${e.message}`,
        analysis: null
      });
    }
  });
  
  app.post('/api/v1/tools/biasbuster/analyzeCode', async (req, res) => {
    try {
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
        userId: req.headers['x-user-id'] as string
      };
      
      const result = await codeAnalysisTool(context, req.body);
      res.json(result);
    } catch (e: any) {
      console.error('Error in code analysis endpoint:', e);
      res.status(500).json({
        success: false,
        message: `Tool execution failed: ${e.message}`,
        analysis: null
      });
    }
  });
  
  app.post('/api/v1/tools/biasbuster/analyzePerspectives', async (req, res) => {
    try {
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
        userId: req.headers['x-user-id'] as string
      };
      
      const result = await perspectiveAnalysisTool(context, req.body);
      res.json(result);
    } catch (e: any) {
      console.error('Error in perspective analysis endpoint:', e);
      res.status(500).json({
        success: false,
        message: `Tool execution failed: ${e.message}`,
        perspectives: []
      });
    }
  });
  
  app.post('/api/v1/tools/biasbuster/annotateDocument', async (req, res) => {
    try {
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
        userId: req.headers['x-user-id'] as string
      };
      
      const result = await documentAnnotationTool(context, req.body);
      res.json(result);
    } catch (e: any) {
      console.error('Error in document annotation endpoint:', e);
      res.status(500).json({
        success: false,
        message: `Tool execution failed: ${e.message}`,
        annotations: []
      });
    }
  });
  
  // Legacy endpoint for backward compatibility
  app.post('/api/v1/tools/biasbuster', async (req, res) => {
    try {
      const toolRequest: ToolRequest = {
        input: req.body
      };
      
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
        userId: req.headers['x-user-id'] as string
      };
      
      const result = await biasbusterTool(context, toolRequest);
      res.json(result);
    } catch (e: any) {
      console.error('Error in MCP tool endpoint:', e);
      res.status(500).json({
        success: false,
        message: `Tool execution failed: ${e.message}`,
        output: null
      });
    }
  });
  
  // Direct analysis endpoint (for backward compatibility)
  app.post('/api/v1/analyze', async (req, res) => {
    try {
      const { text, options } = req.body;
      
      const toolRequest: ToolRequest = {
        input: {
          articleText: text,
          options
        }
      };
      
      const context: ToolContext = {
        requestId: req.headers['x-request-id'] as string || generateRequestId()
      };
      
      const result = await biasbusterTool(context, toolRequest);
      res.json(result.output);
    } catch (e: any) {
      res.status(500).json({
        error: 'Analysis failed',
        message: e.message
      });
    }
  });
  
  // Health check endpoint
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      name: 'biasbuster-mcp-server',
      protocol: 'MCP/1.0',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      tools: [
        'analyzeBias',
        'analyzeCode',
        'analyzePerspectives',
        'annotateDocument'
      ]
    });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Biasbuster MCP HTTP server running on port ${port}`);
  });
}

/**
 * Start the MCP stdio transport
 */
export function startMcpStdioTransport(): void {
  console.log('Starting Biasbuster MCP stdio transport...');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', async (line) => {
    try {
      // Parse the JSON request
      const request = JSON.parse(line);
      
      // Create tool context
      const context: ToolContext = {
        requestId: request.requestId || generateRequestId(),
        metadata: request.metadata || {}
      };
      
      // Determine which tool to call based on the tool field
      const tool = request.tool || 'analyzeBias';
      let result;
      
      switch (tool) {
        case 'analyzeBias':
          result = await biasAnalysisTool(context, request);
          break;
        case 'analyzeCode':
          result = await codeAnalysisTool(context, request);
          break;
        case 'analyzePerspectives':
          result = await perspectiveAnalysisTool(context, request);
          break;
        case 'annotateDocument':
          result = await documentAnnotationTool(context, request);
          break;
        default:
          // Default to bias analysis for backward compatibility
          const toolRequest: ToolRequest = {
            input: {
              articleText: request.text || request.articleText,
              options: request.options || {}
            }
          };
          result = await biasbusterTool(context, toolRequest);
      }
      
      // Write the response to stdout
      process.stdout.write(JSON.stringify(result) + '\n');
    } catch (error: any) {
      // Handle errors
      console.error('Error processing stdio request:', error);
      
      const errorResponse = {
        success: false,
        message: `Error: ${error.message}`,
        output: null,
        metadata: {
          timestamp: new Date().toISOString(),
          error: error.message
        }
      };
      
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('MCP stdio transport shutting down...');
    rl.close();
    process.exit(0);
  });
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
} 