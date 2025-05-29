# Biasbuster

Biasbuster is an AI-powered Chrome extension and web platform that detects, explains, and helps mitigate bias and misinformation in news articles in real time. It empowers users to read critically, promotes media literacy, and provides educational resources and actionable feedback for a more informed society.

## Key Features

- **Real-time bias detection** in news articles
- **Highlighting of biased sentences** and phrases  
- **In-depth explanations** and unbiased rewrite suggestions
- **Educational resources** to improve media literacy
- **User feedback system** for continuous improvement

## Technical Components

- **Chrome extension** for real-time analysis while browsing
- **Web platform** with demo capabilities
- **Backend API** powered by advanced AI model
- **Structured JSON analysis** of bias with actionable suggestions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/biasbuster.git
   cd biasbuster
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8080
CORS_ORIGIN=*
AI_SERVICE=mock  # Options: mock, groq, openai, google
GROQ_API_KEY=your_groq_api_key  # Only needed if AI_SERVICE=groq
OPENAI_API_KEY=your_openai_api_key  # Only needed if AI_SERVICE=openai
GOOGLE_API_KEY=your_google_api_key  # Only needed if AI_SERVICE=google
```

## Web Platform Usage

1. Open `web-platform/index.html` in your browser
2. Enter or paste an article in the text area
3. Click "Analyze" to detect bias
4. Review the analysis results

## Chrome Extension Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `chrome-extension` directory
4. The Biasbuster icon should appear in your toolbar

## API Documentation

### Endpoints

- `GET /api/v1/health` - Health check endpoint
- `POST /api/v1/analyze` - Analyze text for bias

### Example Request

```json
{
  "text": "Your article text here..."
}
```

### Example Response

```json
{
  "MainTopic": "Politics",
  "BiasDetected": "yes",
  "BiasInstances": [
    {
      "Sentence": "All politicians are corrupt and dishonest.",
      "BiasType": "Generalization Bias",
      "Explanation": "This statement makes an absolute claim about all politicians without evidence.",
      "Severity": "2",
      "Justification": "High severity due to absolute language and lack of nuance.",
      "Mitigation": "Some politicians have been involved in corruption scandals, though many serve with integrity."
    }
  ],
  "BiasSummary": "The article contains instances of generalization bias.",
  "TrustedSources": [
    "https://example.com/reliable-source-1",
    "https://example.com/reliable-source-2"
  ],
  "EducationalContent": "Generalization bias occurs when broad claims are made about an entire group..."
}
```

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture information and [DEVELOPER.md](DEVELOPER.md) for development guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

- Biasbuster Team
