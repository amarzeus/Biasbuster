# Developer Guide for Biasbuster

This guide provides detailed information for developers who want to contribute to the Biasbuster project.

## Project Structure

Biasbuster consists of several key components:

- **Web Platform**: Frontend interface for users to analyze articles for bias
- **Chrome Extension**: Browser extension for real-time bias detection
- **MCP Server**: Master Control Program server that handles API requests and AI processing
- **AI Models**: Integration with various AI services for bias detection

## Development Environment Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- A code editor (VSCode recommended)

### Setting Up the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Biasbuster.git
   cd Biasbuster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   # API Keys
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GROQ_API_KEY=your_groq_key
   
   # Server Configuration
   PORT=8080
   CORS_ORIGIN=*
   DEFAULT_AI_MODEL=auto
   ```

## Running the Project

### Starting the Server

- **Windows**:
  ```bash
  start-server.bat
  ```
  
- **macOS/Linux**:
  ```bash
  sh start-server.sh
  ```

### MCP Server (Master Control Program)

The MCP server can be started in different modes:

- **HTTP Mode**:
  ```bash
  npm run mcp-http
  ```

- **STDIO Mode**:
  ```bash
  npm run mcp-stdio
  ```

- **Dual Mode**:
  ```bash
  npm run mcp-dual
  ```

### Web Platform

The web platform can be served using any static file server:

```bash
cd web-platform
python -m http.server 8000
```

Then access the application at http://localhost:8000

### Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` directory from the Biasbuster project

## Testing

We use Jest for testing. Run tests with:

```bash
npm test
```

### Test Structure

Tests are organized in the `__tests__` directory:

- `web-platform.test.js`: Tests for the web platform functionality
- `api.test.js`: Tests for the API functionality
- `script.test.js`: Tests for script.js functions

### Writing Tests

When writing new tests:
1. Place them in the `__tests__` directory
2. Name files with `.test.js` suffix
3. Use Jest's `describe` and `test` functions
4. Mock external dependencies when necessary

Example:
```javascript
describe('Feature', () => {
  test('should behave correctly', () => {
    // Test code here
    expect(result).toBe(expectedValue);
  });
});
```

## Code Style and Linting

We use ESLint for code quality. Run the linter with:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npx eslint --fix . --ext .js,.ts
```

## Build Process

Build the project with:

```bash
npm run build
```

This compiles TypeScript files and prepares the project for production.

## Documentation

- [API Documentation](docs/api.md): Describes API endpoints and usage
- [Architecture](ARCHITECTURE.md): Explains the system architecture
- [Flowchart](FLOWCHART.md): Visual representation of the system flow

## Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add your detailed commit message"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check that your API keys are correctly set in the `.env` file
   - Verify the server is running on the expected port

2. **Chrome Extension Not Working**:
   - Make sure you've loaded the unpacked extension correctly
   - Check the browser console for errors

3. **Tests Failing**:
   - Ensure all dependencies are installed
   - Check that the test environment is properly set up in `__tests__/setup.js`

## Contact

For questions or assistance, please contact the project maintainers or open an issue on GitHub.
