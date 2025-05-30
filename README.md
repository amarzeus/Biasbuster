# Biasbuster

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/amarzeus/Biasbuster/ci.yml?style=flat-square)
![GitHub Stars](https://img.shields.io/github/stars/amarzeus/Biasbuster?style=flat-square)
![GitHub License](https://img.shields.io/github/license/amarzeus/Biasbuster?style=flat-square)

Biasbuster is an AI-powered media literacy tool designed to help users detect and understand bias in online content. It includes a Chrome extension, web platform, and API service for analyzing text across multiple dimensions of bias.

<p align="center">
  <img src="docs/architecture.svg" alt="Biasbuster Architecture" width="600">
</p>

## 🚀 Quick Demo

Check out Biasbuster in action:

<p align="center">
  <img src="docs/demo.gif" alt="Biasbuster Demo" width="500">
</p>

## 🌟 Features

- **Chrome Extension**: Analyze any webpage for bias directly while browsing
- **Web Platform**: Upload text or articles for comprehensive bias analysis
- **Multi-dimensional Analysis**: Identifies political bias, emotional language, framing, and more
- **Educational Resources**: AI literacy and media literacy educational content
- **Ethical Framework**: Built with transparency and ethics in mind

## 📸 Screenshots

<p align="center">
  <img src="docs/web-platform-demo.svg" alt="Web Platform" width="400">
  <img src="docs/extension-demo.svg" alt="Chrome Extension" width="400">
</p>

## 🛠️ Getting Started

### Prerequisites

- Node.js 14+ (16+ recommended)
- NPM or Yarn
- Chrome browser (for extension)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/amarzeus/Biasbuster.git
   cd Biasbuster
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

### Installing the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension` folder from this repository
4. The Biasbuster icon should appear in your browser toolbar

## 🏗️ Project Structure

```
Biasbuster/
├── src/                # Backend API server source code
├── web-platform/       # Web platform front-end
├── chrome-extension/   # Chrome extension source
├── prompts/            # AI prompts for bias analysis
├── docs/               # Documentation and assets
└── scripts/            # Utility scripts
```

## 📊 Flowchart

See [FLOWCHART.md](FLOWCHART.md) for a visual representation of how Biasbuster works.

## 📚 Documentation

- [Architecture](ARCHITECTURE.md): Detailed system architecture
- [Product Requirements](Biasbuster%20Product%20Requirements%20Document%20-%20PRD.md): Product specifications
- [Developer Guide](DEVELOPER.md): Guide for developers

## 🧪 Running Tests

```
npm test
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Made with ❤️ by [Amar](https://www.linkedin.com/in/amarmahakal/)

## 🙏 Support

If you find this project helpful, please consider giving it a star on GitHub and supporting the developer:

<a href="https://buymeacoffee.com/amarmahakal">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" >
</a>
