import express, { Request, Response } from 'express';
import { analyzeBias } from './tools';
import { BiasBusterResponse, AnalysisOptions } from '../types/biasbuster';

const router = express.Router();

interface MCPRequest extends Request {
    body: {
        text: string;
        options?: AnalysisOptions;
    };
}

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'mcp-server' });
});

// Main analysis endpoint
router.post('/analyze', async (req: MCPRequest, res: Response) => {
    try {
        const { text, options } = req.body;

        if (!text) {
            res.status(400).json({ error: 'Text is required for analysis' });
            return;
        }

        const result: BiasBusterResponse = await analyzeBias(text, options);

        // Add analytics and tracking
        const response = {
            ...result,
            stats: {
                processingTime: Date.now(),
                textLength: text.length,
                biasInstancesFound: result.BiasInstances.length
            }
        };

        res.json(response);
    } catch (error) {
        console.error('MCP Analysis Error:', error);
        res.status(500).json({ 
            error: 'Error processing analysis request',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// Batch analysis endpoint
router.post('/analyze-batch', async (req: Request, res: Response) => {
    try {
        const { texts } = req.body;

        if (!Array.isArray(texts)) {
            res.status(400).json({ error: 'Texts array is required for batch analysis' });
            return;
        }

        const results = await Promise.all(
            texts.map(text => analyzeBias(text))
        );

        res.json({ results });
    } catch (error) {
        console.error('MCP Batch Analysis Error:', error);
        res.status(500).json({ 
            error: 'Error processing batch analysis request',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// Feedback endpoint
router.post('/feedback', (req: Request, res: Response) => {
    const { analysisId, feedback } = req.body;

    // TODO: Implement feedback collection for model improvement
    console.log('Received feedback for analysis:', analysisId, feedback);

    res.json({ message: 'Feedback received' });
});

/**
 * Start the MCP server via HTTP
 * @param port Port number to listen on
 */
export function startMcpHttpServer(port: number): void {
    const app = express();
    app.use(express.json());
    app.use('/', router);
    
    app.listen(port, () => {
        console.log(`MCP HTTP server running on port ${port}`);
    });
}

/**
 * Start the MCP server via stdio for direct process communications
 */
export function startMcpStdioTransport(): void {
    console.log('MCP STDIO transport started');
    
    // Read from stdin
    process.stdin.on('data', async (data) => {
        try {
            const input = JSON.parse(data.toString());
            if (input.type === 'analyze' && input.text) {
                const result = await analyzeBias(input.text, input.options);
                process.stdout.write(JSON.stringify({ success: true, result }) + '\n');
            } else {
                process.stdout.write(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid request format' 
                }) + '\n');
            }
        } catch (error) {
            process.stdout.write(JSON.stringify({ 
                success: false, 
                error: 'Error processing request' 
            }) + '\n');
        }
    });
}

export default router;
