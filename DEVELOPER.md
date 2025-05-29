# Biasbuster MCP Server Developer Guide

## Project Structure
```
.
├── src/
│   ├── index.ts           # Entry point
│   ├── services/          # Service integrations
│   │   └── aiService.ts   # AI service integration
│   └── tools/             # MCP tool implementations
│       └── analyzeBias.ts # Bias analysis tool
├── prompts/               # AI prompt templates
│   └── biasbusterPrompt.txt # Main prompt
├── chrome-extension/      # Chrome extension
│   ├── manifest.json      # Extension configuration
│   ├── service_worker.js  # Background service worker  
│   ├── popup/            # Extension popup UI
│   ├── content_scripts/   # In-page scripts
│   └── icons/            # Extension icons
├── web-platform/         # Demo web platform
│   ├── index.html        # Main page
│   ├── style.css         # Styles
│   └── script.js         # Frontend logic
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── .env                  # Environment variables
```

## Development Workflow
1. **Install dependencies:** `npm install`
2. **Run locally:** `npm run dev`
3. **Test endpoints:** Use Postman or `curl` to test `/api/v1/analyze`
4. **Build for production:** `npm run build`
5. **Deploy:** Use Docker, Kubernetes, or cloud provider

## API Documentation

### Analyze Endpoint
- **Endpoint:** `POST /api/v1/analyze`
- **Description:** Analyzes text for bias
- **Request Body:**
  ```json
  {
    "text": "Article text to analyze"
  }
  ```
- **Response Body:**
  ```json
  {
    "MainTopic": "Topic of article",
    "BiasDetected": "yes/no",
    "BiasInstances": [
      {
        "Sentence": "Biased sentence",
        "BiasType": "Type of bias",
        "Explanation": "Why it's biased",
        "Severity": "0/1/2",
        "Justification": "Reason for severity",
        "Mitigation": "Unbiased rewrite"
      }
    ],
    "BiasSummary": "Summary of bias",
    "TrustedSources": ["URL1", "URL2", "URL3"],
    "EducationalContent": "Educational info about bias"
  }
  ```

### Health Check Endpoint
- **Endpoint:** `GET /api/v1/health`
- **Description:** Returns server health status
- **Response Body:**
  ```json
  {
    "status": "ok",
    "timestamp": "ISO timestamp"
  }
  ```

## Environment Variables
- `PORT` - Server port (default 8080)
- `NODE_ENV` - Environment (development/production)
- `API_KEY` - API key for authentication (if implemented)
- `AI_SERVICE` - Type of AI service to use (groq/openai/google)
- `GROQ_API_KEY` - API key for Groq
- `OPENAI_API_KEY` - API key for OpenAI (if used)
- `GOOGLE_API_KEY` - API key for Google AI (if used)

## Coding Standards
- TypeScript preferred for safety
- Use async/await for all async code
- Log errors and use structured error responses
- Document all functions with JSDoc

## Testing
- Endpoint testing with Postman or curl
- Prompt testing with sample articles
- Chrome extension testing in Developer mode 