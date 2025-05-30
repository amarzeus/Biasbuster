# Biasbuster: AI-Powered Media Literacy Tool

<div align="center">
  <img src="chrome-extension/icons/icon128.png" alt="Biasbuster Logo" width="128" height="128">
  <h3>Detect, explain, and mitigate media bias in real-time</h3>
  <p><i>Created for the Persist Ventures Startupathon Challenge</i></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Chrome-blue" alt="Platform">
  <img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20TypeScript%20%7C%20Express-green" alt="Stack">
  <img src="https://img.shields.io/badge/AI-Groq%20%7C%20Anthropic%20%7C%20OpenAI-purple" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</div>

<br>

## 🚀 Quick Demo

https://github.com/amarzeus/Biasbuster/assets/demo.gif

## 🔍 What is Biasbuster?

Biasbuster uses advanced AI to analyze news articles for bias and misinformation, helping readers become more informed and critical consumers of media. It works both as a Chrome extension that analyzes articles as you browse and as a web platform where you can paste any text for analysis.

<img src="https://raw.githubusercontent.com/amarzeus/Biasbuster/main/docs/demo-screenshot.png" alt="Biasbuster Demo" width="100%">

## ✨ Key Features

### Core Capabilities
- 🔍 **Advanced Bias Detection**: Identify multiple types of bias including political, racial, gender, framing, selection, and more
- 📊 **Bias Visualization**: Highlight biased content with an intuitive heat map showing bias intensity
- 📝 **Bias Explanation**: Get detailed explanations of why specific text contains bias
- 🔄 **Alternative Perspectives**: Discover diverse viewpoints on the same topic from various sources to break echo chambers
- ✏️ **Mitigation Suggestions**: Receive balanced rewording suggestions for biased content
- 🎯 **Educational Resources**: Learn about different bias types and how to spot them

### Advanced AI/ML Features
- 🧠 **Adaptive AI Model Selection**: Automatically selects the best AI model based on content complexity
- 🌐 **Multilingual Analysis**: Detect and explain bias in multiple languages
- 😀 **Sentiment Analysis**: Measure the emotional tone of content
- ⚖️ **Source Credibility Scoring**: Evaluate the reliability of news sources
- 📱 **Real-time Bias Detection**: Get bias alerts as you browse the web
- 🔄 **Offline Analysis**: Basic bias detection even without internet connection

## 🖥️ Project Components

<div align="center">
  <img src="https://raw.githubusercontent.com/amarzeus/Biasbuster/main/docs/architecture.png" alt="Biasbuster Architecture" width="80%">
</div>

### MCP Server
The Master Control Program (MCP) server processes article text and communicates with AI services.

- RESTful API endpoints for bias analysis
- Support for multiple AI service providers (OpenAI, Anthropic, Groq)
- Rate limiting and request caching
- Comprehensive error handling

### Chrome Extension
A browser extension that analyzes web pages for bias in real-time.

<div align="center">
  <img src="https://raw.githubusercontent.com/amarzeus/Biasbuster/main/docs/extension-demo.png" alt="Chrome Extension" width="60%">
</div>

- Content scripts for page analysis
- Bias highlighting with severity indicators
- Detailed bias explanation tooltips
- Auto-analysis feature for passive bias detection
- Settings for customizing analysis features

### Web Platform
A standalone web application that allows users to analyze text directly.

<div align="center">
  <img src="https://raw.githubusercontent.com/amarzeus/Biasbuster/main/docs/web-platform-demo.png" alt="Web Platform" width="60%">
</div>

- Interactive bias visualization dashboard
- Statistical analysis of detected bias
- Educational resources on media literacy
- Example articles demonstrating various bias types

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher
- NPM 6 or higher

### One-Line Setup
```bash
git clone https://github.com/amarzeus/Biasbuster.git && cd Biasbuster && npm install && npm start
```

### Step-by-Step Setup

1. Clone the repository:
   ```
   git clone https://github.com/amarzeus/Biasbuster.git
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

## 🔧 Configuration

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

## 📊 How It Works

<div align="center">
  <a href="FLOWCHART.md">
    <img src="https://raw.githubusercontent.com/amarzeus/Biasbuster/main/docs/flowchart-preview.png" alt="Flowchart" width="70%">
    <p>View detailed system flowcharts</p>
  </a>
</div>

## 🔄 System Workflow

1. **Input**: User submits article text via Chrome extension or web platform
2. **Processing**: MCP server sends text to the appropriate AI model
3. **Analysis**: AI performs comprehensive bias detection
4. **Results**: System returns structured analysis with bias instances, explanations, and suggestions
5. **Visualization**: Front-end displays results with interactive heat maps and detailed breakdowns

## 🌟 Why Biasbuster?

- **Media Literacy**: Empowers readers to identify bias and make informed decisions
- **Educational Tool**: Helps students and educators understand media bias
- **Journalistic Aid**: Supports journalists in creating more balanced content
- **AI Transparency**: Uses explainable AI to justify bias detections

## 👥 Contributing

Contributions to Biasbuster are welcome! Please review our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- This project was created as part of the Persist Ventures Startupathon challenge.
- Thanks to the open source community for the amazing tools and libraries that made this project possible.
