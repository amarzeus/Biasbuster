# Biasbuster

![Biasbuster Logo](chrome-extension/icons/icon128.png)

Biasbuster is an AI-powered tool that detects, explains, and helps mitigate bias and misinformation in news articles in real time.

## Features

### Core Capabilities
- 🔍 **Advanced Bias Detection**: Identify multiple types of bias including political, racial, gender, framing, selection, and more
- 📊 **Bias Visualization**: Highlight biased content with an intuitive heat map showing bias intensity
- 📝 **Bias Explanation**: Get detailed explanations of why specific text contains bias
- ✏️ **Mitigation Suggestions**: Receive balanced rewording suggestions for biased content
- 🎯 **Educational Resources**: Learn about different bias types and how to spot them

### Advanced AI/ML Features
- 🧠 **Adaptive AI Model Selection**: Automatically selects the best AI model based on content complexity
- 🌐 **Multilingual Analysis**: Detect and explain bias in multiple languages
- 😀 **Sentiment Analysis**: Measure the emotional tone of content
- ⚖️ **Source Credibility Scoring**: Evaluate the reliability of news sources
- 📱 **Real-time Bias Detection**: Get bias alerts as you browse the web
- 🔄 **Offline Analysis**: Basic bias detection even without internet connection

## Project Components

### MCP Server
The Master Control Program (MCP) server processes article text and communicates with AI services.

- RESTful API endpoints for bias analysis
- Support for multiple AI service providers (OpenAI, Anthropic, Groq)
- Rate limiting and request caching
- Comprehensive error handling

### Chrome Extension
A browser extension that analyzes web pages for bias in real-time.

- Content scripts for page analysis
- Bias highlighting with severity indicators
- Detailed bias explanation tooltips
- Auto-analysis feature for passive bias detection
- Settings for customizing analysis features

### Web Platform
A standalone web application that allows users to analyze text directly.

- Interactive bias visualization dashboard
- Statistical analysis of detected bias
- Educational resources on media literacy
- Example articles demonstrating various bias types

## Getting Started

### Prerequisites
- Node.js 14 or higher
- NPM 6 or higher

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

3. Start the server:
- On Windows:
```
start-server.bat
```
- On macOS/Linux:
```
sh start-server.sh
```

4. Access the web platform:
```
Open web-platform/index.html in your browser
```

5. Load the Chrome extension:
```
Open Chrome > Extensions > Load unpacked > Select chrome-extension folder
```

## Environment Configuration

Create a `.env` file in the project root to configure API keys and settings:

```
# AI Service Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GROQ_API_KEY=your_groq_key

# Server Configuration
PORT=8080
CORS_ORIGIN=*
DEFAULT_AI_MODEL=auto
```

## API Reference

The Biasbuster API provides several endpoints:

- `POST /api/v1/analyze`: Analyze text for bias
- `POST /api/v1/sentiment`: Analyze sentiment of text
- `POST /api/v1/credibility`: Evaluate source credibility
- `POST /api/v1/comprehensive`: Perform complete analysis (bias, sentiment, credibility)
- `GET /api/v1/health`: Check server status
- `GET /api/v1/models`: List available AI models
- `GET /api/v1/version`: Get API version information

## Contributing

Contributions to Biasbuster are welcome! Please review our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was created as part of the Persist Ventures Startupathon challenge.
- Thanks to the open source community for the amazing tools and libraries that made this project possible.
