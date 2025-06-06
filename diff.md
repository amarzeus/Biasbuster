diff --git a/README.md b/README.md
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/README.md
@@ -0,0 +1,34 @@
+# Biasbuster MCP Server
+
+## Overview
+Biasbuster MCP Server is the backbone of the Biasbuster platform, providing scalable, secure, and robust bias analysis and feedback APIs for the Chrome extension and web platform.
+
+## Key Features
+- RESTful API for bias analysis, feedback, and health checks
+- Integration with Blackbox AI for advanced bias detection
+- Dockerized, cloud-ready, and stateless
+- Developer and architect documentation included
+- Real-world article example for prompt testing
+
+## Quickstart
+1. Clone the repo and install dependencies:
+   ```
+   git clone https://github.com/yourorg/biasbuster-mcp-server.git
+   cd biasbuster-mcp-server
+   npm install
+   ```
+2. Configure environment variables in `.env`
+3. Run locally:
+   ```
+   npm run start
+   ```
+4. API available at `http://localhost:8080/api/v1/analyze`
+
+## Documentation
+- See [ARCHITECTURE.md](ARCHITECTURE.md) for technical design
+- See [DEVELOPER.md](DEVELOPER.md) for development workflow
+- See [prompts/biasbusterPrompt.txt](prompts/biasbusterPrompt.txt) for the advanced prompt and demo article
+
+---
+© 2025 Biasbuster Team
diff --git a/ARCHITECTURE.md b/ARCHITECTURE.md
new file mode 100644
index 0000000..b2c3d4e
--- /dev/null
+++ b/ARCHITECTURE.md
@@ -0,0 +1,45 @@
+# Biasbuster MCP Server Architecture
+
+## Overview
+The MCP (Main Control Platform) server is designed for high scalability, security, and extensibility. It exposes RESTful APIs for bias analysis, feedback, and health checks, and integrates with Blackbox AI for advanced NLP.
+
+## Components
+- **API Gateway**: Handles routing, HTTPS, authentication, and rate limiting.
+- **RESTful API Server**: Node.js (TypeScript, Express) or Python (FastAPI) backend.
+- **AI Model Service**: Connects to Blackbox AI for bias analysis.
+- **Database**: PostgreSQL or MongoDB for feedback, logs, and analytics.
+- **Static Web Hosting**: For the Biasbuster web platform.
+- **Monitoring/Logging**: Prometheus, Grafana, or cloud-native tools.
+
+## API Endpoints
+- `POST /api/v1/analyze` — Analyze article text for bias (calls Blackbox AI)
+- `POST /api/v1/feedback` — Collect user feedback
+- `GET  /api/v1/health` — Health check
+
+## Security
+- HTTPS enforced
+- API Key/OAuth2 authentication
+- CORS for allowed origins
+- Rate limiting and input validation
+
+## Deployment
+- Dockerized for portability
+- Cloud-ready (AWS, GCP, Azure, Vercel)
+- CI/CD pipeline for automated build/test/deploy
+
+## Developer Notes
+- All configuration via `.env`
+- Prompts for Blackbox AI in `/prompts/biasbusterPrompt.txt`
+- Type-safe codebase (TypeScript or Python with type hints)
+
+## Extensibility
+- Add new tools/resources as separate modules in `/tools` and `/resources`
+- MCP standard supports both HTTP and stdio transports
+
+## References
+- See [DEVELOPER.md](DEVELOPER.md) for coding standards and workflow
+
+---
diff --git a/DEVELOPER.md b/DEVELOPER.md
new file mode 100644
index 0000000..c4d5e6f
--- /dev/null
+++ b/DEVELOPER.md
@@ -0,0 +1,38 @@
+# Biasbuster MCP Server Developer Guide
+
+## Project Structure
+```
+src/
+  index.ts           # Entry point
+  config.ts          # Configuration
+  types.ts           # Type definitions
+  tools/             # MCP tool implementations
+  resources/         # Resource implementations
+  services/          # AI, DB, etc.
+  prompts/           # AI prompt templates
+  transports/        # HTTP and stdio handlers
+  utils/             # Logging, error handling
+  prisma/            # (Optional) ORM schema
+```
+
+## Development Workflow
+1. **Install dependencies:** `npm install`
+2. **Run locally:** `npm run start`
+3. **Test endpoints:** Use Postman or `curl` to test `/api/v1/analyze`
+4. **Add new tools/resources:** Create files in `/tools` or `/resources`
+5. **Write and update prompts:** Edit `/prompts/biasbusterPrompt.txt`
+6. **Lint and test:** `npm run lint` and `npm run test`
+7. **Build for production:** `npm run build`
+8. **Deploy:** Use Docker, Kubernetes, or cloud provider
+
+## Coding Standards
+- TypeScript preferred for safety
+- Use async/await for all async code
+- Log errors and use structured error responses
+- Write unit and integration tests for all endpoints
+
+## Contributing
+- Fork, branch, and submit PRs with clear descriptions
+- Follow code review best practices
+
+---
diff --git a/src/index.ts b/src/index.ts
new file mode 100644
index 0000000..d1e2f3a
--- /dev/null
+++ b/src/index.ts
@@ -0,0 +1,23 @@
+import express from 'express';
+import { analyzeBias } from './tools/analyzeBias';
+
+const app = express();
+app.use(express.json());
+
+// Health check endpoint
+app.get('/api/v1/health', (req, res) => {
+  res.json({ status: 'ok', timestamp: new Date().toISOString() });
+});
+
+// Bias analysis endpoint
+app.post('/api/v1/analyze', async (req, res) => {
+  try {
+    const { text } = req.body;
+    const result = await analyzeBias(text);
+    res.json(result);
+  } catch (e) {
+    res.status(500).json({ error: 'Analysis failed', details: e.message });
+  }
+});
+
+app.listen(process.env.PORT || 8080, () => console.log('Biasbuster MCP server running...'));
diff --git a/src/tools/analyzeBias.ts b/src/tools/analyzeBias.ts
new file mode 100644
index 0000000..e4f5a6b
--- /dev/null
+++ b/src/tools/analyzeBias.ts
@@ -0,0 +1,18 @@
+import { callBlackboxAI } from '../services/aiService';
+
+/**
+ * Analyze article text for bias using Blackbox AI.
+ * @param text The article text to analyze.
+ * @returns Bias analysis result as structured JSON.
+ */
+export async function analyzeBias(text: string) {
+  // Load prompt template
+  const prompt = require('fs').readFileSync('./prompts/biasbusterPrompt.txt', 'utf8');
+  const aiInput = prompt.replace('[Insert article text here]', text);
+  const aiResult = await callBlackboxAI(aiInput);
+  // Optionally post-process aiResult here
+  return aiResult;
+}
+
+// Add more MCP tools as needed in this directory
+
diff --git a/src/services/aiService.ts b/src/services/aiService.ts
new file mode 100644
index 0000000..f6e7d8c
--- /dev/null
+++ b/src/services/aiService.ts
@@ -0,0 +1,17 @@
+/**
+ * Service for calling Blackbox AI API.
+ * Replace this with actual API integration.
+ */
+import axios from 'axios';
+
+export async function callBlackboxAI(prompt: string) {
+  // Example: Replace with your Blackbox AI endpoint and key
+  const response = await axios.post(
+    process.env.BLACKBOX_AI_URL || 'https://api.blackboxai.com/analyze',
+    { prompt },
+    { headers: { 'Authorization': `Bearer ${process.env.BLACKBOX_AI_KEY}` } }
+  );
+  return response.data;
+}
+
+// Add error handling, retries, and logging as needed
diff --git a/prompts/biasbusterPrompt.txt b/prompts/biasbusterPrompt.txt
new file mode 100644
index 0000000..eeff001
--- /dev/null
+++ b/prompts/biasbusterPrompt.txt
@@ -0,0 +1,96 @@
+Biasbuster Advanced AI Prompt
+============================
+
+ROLE:
+You are Biasbuster, an expert AI system specializing in detecting, explaining, and mitigating bias and misinformation in news articles. Your responses must be structured, actionable, and educational, suitable for integration in both a Chrome extension and a web platform.
+
+OBJECTIVE:
+Given a news article (or excerpt), analyze it for all forms of bias and misinformation. Highlight, explain, and suggest improvements for each biased instance. Educate users and recommend trustworthy sources for a balanced perspective.
+
+INSTRUCTIONS:
+
+1. TOPIC IDENTIFICATION
+   - Identify the main topic of the article in 1-3 words.
+
+2. BIAS & MISINFORMATION DETECTION
+   - Analyze the text for:
+     - Tone/Sentiment Bias (emotional, extreme, or loaded language)
+     - Framing Bias (selective emphasis, misleading context)
+     - Cognitive Bias (confirmation bias, straw man, circular reasoning, hidden assumptions)
+     - Demographic Bias (racial, gender, cultural stereotypes, exclusion)
+     - Omission of Key Facts
+     - Manipulation Techniques (ad hominem, generalization, red herring, appeal to emotion)
+   - For each detected bias:
+     - Extract the exact sentence or phrase.
+     - Classify the type of bias.
+     - Explain why it is problematic.
+     - Rate severity (0 = none, 1 = moderate, 2 = extreme) with a brief justification.
+
+3. STRUCTURED OUTPUT
+   - For each detected bias, create a record with:
+     - "Sentence": [the biased sentence/phrase]
+     - "BiasType": [type]
+     - "Explanation": [why it is biased]
+     - "Severity": [0/1/2]
+     - "Justification": [short reason for severity]
+     - "Mitigation": [unbiased rewrite suggestion]
+
+4. BIAS SUMMARY
+   - Summarize the overall bias of the article in ≤10 words.
+
+5. TRUSTED SOURCES
+   - Recommend up to 3 trusted, balanced sources or articles on the same topic (include URLs if possible).
+
+6. EDUCATIONAL CONTENT
+   - Provide a concise, actionable explanation of the detected biases and practical tips for readers to spot similar issues in the future.
+
+7. OUTPUT FORMAT
+   - Return a JSON object with the following structure:
+     {
+       "MainTopic": "",
+       "BiasDetected": "yes/no",
+       "BiasInstances": [
+         {
+           "Sentence": "",
+           "BiasType": "",
+           "Explanation": "",
+           "Severity": "",
+           "Justification": "",
+           "Mitigation": ""
+         }
+         // ...repeat for each bias detected
+       ],
+       "BiasSummary": "",
+       "TrustedSources": ["", "", ""],
+       "EducationalContent": ""
+     }
+
+ARTICLE TO ANALYZE:
+Media literacy is proven to be on the decline, and I want to start a conversation about how we can improve it in the country. The Brookfield native conceived the project early last year while doing her usual skimming of stories, mostly those related to U.S. politics and the election, and thought she noticed a pattern in the way the word “communism” was being used. Rarely did it have a neutral connotation; it almost always had a negative bent, she thought.
+
+In the New York Times, four of the 50 stories, or 8%, had clear anti-communist sentiment. Another four were vaguely anti-communist, 32 had no anti-communist sentiment, three had somewhat positive interpretations of communism, four were difficult to understand, and three were marked as miscellaneous, or “other.”
+
+In the Washington Post, three of the 50, or 6%, had clear anti-communist sentiment. Six were vaguely anti-communist, and 41 were neutral or had no sentiment present.
+
+In the Wall Street Journal, 23 of the 50, or 46%, had clear anti-communist sentiment. Eleven were vaguely anti-communist, 11 had no anti-communist sentiment, and five were difficult to understand.
+
+Many stories in the sample were about the latest Israel-Hamas war and included words like “leftist” to describe protesting college students in a negative way. The Wall Street Journal stories, she found, especially carried the theme of colleges indoctrinating students in “leftist” beliefs.
+
+Regardless, if it’s an editorial or not, it goes against journalistic standards to make these very bold claims – bashing whole universities and universities as a concept – and not provide quotes from people involved, not provide any statistics or information, not doing any interviews. It’s not professional, and also it’s clearly biased against an idea that they perceive as communist.
+
+Above all though, this gets a conversation going about what we should be looking at in the news and how we can better convey to the average person what they should be on the lookout for and how they might think more critically about what they’re reading.
+
+AI bias is also a growing concern. For example, a healthcare risk-prediction algorithm used on more than 200 million U.S. citizens demonstrated racial bias because it relied on a faulty metric for determining the need. The algorithm’s designers used previous patients’ healthcare spending as a proxy for medical needs. This was a bad interpretation of historical data because income and race are highly correlated metrics and making assumptions based on only one variable of correlated metrics led the algorithm to provide inaccurate results.
+
+Another example is Amazon’s AI recruiting tool, which showed bias against women by penalizing resumes that included the word “women’s.” The system incorrectly learned that male candidates were preferable due to biased historical data, leading Amazon to discontinue the use of the algorithm.
+
+Despite some efforts to address these biases, developers’ choices and flawed data still cause significant problems. These biases could negatively impact how society views women and how women perceive themselves.
