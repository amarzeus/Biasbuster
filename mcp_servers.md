Biasbuster MCP Server Specification
===================================

Purpose:
--------
This MCP server is the backbone of the Biasbuster platform, providing robust, scalable, and secure bias analysis and feedback services for both the Chrome extension and the professional-grade website. It exposes all core bias detection, feedback, and educational endpoints via the Model Context Protocol (MCP), supporting HTTP(S) and stdio transports.

Architecture Overview:
----------------------
- **API Gateway**: Handles routing, HTTPS, authentication, and rate limiting.
- **MCP REST API Server**: Main service exposing endpoints for bias analysis, feedback, and health checks.
- **AI Model Service**: Connects to Blackbox AI for article analysis.
- **Database**: Stores user feedback, logs, and optional analytics.
- **Static Web Hosting**: Serves the Biasbuster web platform.
- **Monitoring/Logging**: Ensures uptime, reliability, and observability.

Project Structure (TypeScript Example)[1][2]:
---------------------------------------------
src/
├── index.ts              # Entry point (server bootstrap)
├── initialize.ts         # Initialization logic
├── config.ts             # Configuration management (env vars, secrets)
├── types.ts              # Type definitions (API, MCP, DB)
├── utils/                # Logging, error handling, helpers
│   ├── logging.ts
│   ├── errors.ts
│   └── ...
├── tools/                # MCP tool implementations (bias analysis, feedback)
│   ├── analyzeBias.ts
│   ├── feedback.ts
│   └── ...
├── resources/            # Resource implementations (article, user)
│   ├── articleResource.ts
│   ├── userResource.ts
│   └── ...
├── prompts/              # Prompt templates for Blackbox AI
│   ├── biasbusterPrompt.txt
│   └── ...
├── services/             # Service layer (AI, DB, notifications)
│   ├── aiService.ts
│   ├── dbService.ts
│   └── ...
├── transports/           # HTTP and stdio transport handlers
│   ├── httpTransport.ts
│   ├── stdioTransport.ts
│   └── ...
├── config/               # Environment configs, secrets, .env files
├── prisma/               # (Optional) Prisma ORM schema and migrations
├── package.json
├── tsconfig.json
└── README.md

Key Features:
-------------
- **Dual Transport**: Supports both HTTP (RESTful) and stdio (CLI/local) modes[2][3][4].
- **TypeScript/Node.js**: Modern, type-safe codebase; Python or C# also supported[1][5][6].
- **Integrated Blackbox AI**: Calls out to AI model for bias analysis using robust, versioned prompts.
- **Extensible Tools/Resources**: Easily add new MCP tools (e.g., summarization, translation).
- **Prisma ORM**: For robust, type-safe database access (PostgreSQL/MongoDB).
- **Full Logging & Error Handling**: Production-ready logging, error classes, and monitoring hooks.
- **Configurable**: All secrets, API keys, and environment variables managed via `.env` or config files.

Core Endpoints/Tools:
---------------------
- `POST /api/v1/analyze` — Analyze article text for bias (calls Blackbox AI)
- `POST /api/v1/feedback` — Collect user feedback on analysis
- `GET  /api/v1/health` — Health check endpoint for monitoring
- `GET  /api/v1/resources` — List available MCP tools/resources
- `POST /api/v1/tools/biasbuster` — Direct tool invocation (MCP standard)
- (Optional) WebSocket/SSE endpoint for real-time updates

Security & Best Practices:
--------------------------
- **HTTPS** enforced for all HTTP endpoints
- **API Key/OAuth2** authentication for extension/web clients
- **CORS** configured for allowed origins
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization on all endpoints
- **Error Handling**: Structured error responses and logging

Deployment:
-----------
- **Dockerized**: All services run in Docker containers for portability and scalability
- **Cloud Ready**: Deployable to AWS, GCP, Azure, Vercel, or Cloudflare Workers[7]
- **CI/CD**: Automated build, test, and deploy (GitHub Actions, GitLab CI, etc.)
- **Monitoring**: Integrated with Prometheus, Grafana, or cloud-native monitoring

Example: MCP Tool Implementation (TypeScript)
---------------------------------------------
// src/tools/analyzeBias.ts
import { ToolContext, ToolRequest, ToolResponse } from '../types';
import { callBlackboxAI } from '../services/aiService';

export async function analyzeBias(context: ToolContext, req: ToolRequest): Promise<ToolResponse> {
const { articleText } = req.input;
const aiResult = await callBlackboxAI(articleText); // Uses prompt from prompts/biasbusterPrompt.txt
return {
output: aiResult,
success: true,
message: "Bias analysis complete"
};
}



Example: HTTP Transport Startup
-------------------------------
// src/transports/httpTransport.ts
import express from 'express';
import { analyzeBias } from '../tools/analyzeBias';

const app = express();
app.use(express.json());

app.post('/api/v1/analyze', async (req, res) => {
try {
const result = await analyzeBias({}, { input: req.body });
res.json(result.output);
} catch (e) {
res.status(500).json({ error: 'Analysis failed', details: e.message });
}
});

app.listen(process.env.PORT || 8080, () => {
console.log('Biasbuster MCP HTTP server running...');
});



Example: Stdio Transport Startup
-------------------------------
// src/transports/stdioTransport.ts
import { createInterface } from 'readline';
import { analyzeBias } from '../tools/analyzeBias';

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', async (line) => {
const req = JSON.parse(line);
const result = await analyzeBias({}, { input: req });
process.stdout.write(JSON.stringify(result.output) + '\n');
});



Setup & Quickstart:
-------------------
1. **Install CLI Tool**  
   `npm install -g create-advanced-mcp-server`  
   or  
   `npx @mcpdotdirect/create-mcp-server`

2. **Scaffold Project**  
   `create-advanced-mcp-server biasbuster-mcp-server`

3. **Configure Environment**  
   - Add API keys, secrets, and config values to `.env`

4. **Install Dependencies**  
   `npm install`

5. **Run Locally**  
   - HTTP: `npm run start:http`
   - Stdio: `npm start`

6. **Deploy to Cloud**  
   - Use Docker Compose, Kubernetes, or serverless deployment as needed

7. **Monitor & Scale**  
   - Integrate with monitoring/logging tools

References:
-----------
- [MCP Advanced Node Specification][1]
- [@mcpdotdirect/template-mcp-server][2]
- [Composio: Building MCP Servers][3]
- [Hugging Face MCP Course][4]
- [Model Context Protocol Docs][5]
- [Cloudflare Remote MCP Servers][7]
- [MCP Server Examples][8]

End of File