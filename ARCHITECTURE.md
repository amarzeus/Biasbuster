# Biasbuster MCP Server Architecture

## Overview
The MCP (Main Control Platform) server is designed for high scalability, security, and extensibility. It exposes RESTful APIs for bias analysis, feedback, and health checks, and integrates with advanced AI for bias detection and analysis. The system now uses a pure JavaScript/TypeScript stack with no Python dependencies.

## Components
- **API Gateway**: Handles routing, HTTPS, authentication, and rate limiting.
- **RESTful API Server**: Node.js (TypeScript, Express) backend.
- **AI Model Service**: Connects to chosen AI service (e.g., Groq, Google AI, OpenAI) for bias analysis.
- **JavaScript Analysis Service**: Performs basic bias detection without requiring external dependencies.
- **Database**: Optional for storing user feedback, logs, and analytics.
- **Static Web Hosting**: For the Biasbuster web platform.
- **Monitoring/Logging**: For system health and issue tracking.

## API Endpoints
- `POST /api/v1/analyze` — Analyze article text for bias (calls AI service)
- `POST /api/v1/feedback` — Collect user feedback
- `GET  /api/v1/health` — Health check

## Security
- HTTPS enforced
- API Key/OAuth2 authentication
- CORS for allowed origins
- Rate limiting and input validation

## Deployment
- Dockerized for portability
- Cloud-ready (AWS, GCP, Azure, Vercel)
- CI/CD pipeline ready
- Simplified deployment with no Python dependencies

## Developer Notes
- All configuration via `.env`
- Prompts for AI in `/prompts/biasbusterPrompt.txt`
- Type-safe codebase with TypeScript
- Zero external dependencies beyond Node.js

## Flow Diagrams

### Request Processing Flow

```
HTTP Client → API Gateway → Express Route → Bias Analysis Tool → AI Service/JS Analysis → JSON Response → Client
```

### Chrome Extension Flow

```
User → View News → Extension Button → Content Script → Text Extraction → API Request → 
Bias Analysis → Highlight Bias → Show Explanations → User
```

### Web Platform Flow

```
User → Paste Article → Submit → API Request → Bias Analysis → Display Results → User
```

## References
- See [DEVELOPER.md](DEVELOPER.md) for coding standards and workflow
- See [package.json](package.json) for dependencies
- See [prompt.txt](prompts/biasbusterPrompt.txt) for AI prompt