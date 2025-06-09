# BiasBuster Platform

A comprehensive platform for detecting and analyzing bias in text content, with real-time collaboration features.

## Features

- **Text Analysis**: Detect and highlight potential biases in text content
- **Real-time Collaboration**: Work together with others to analyze and improve content
- **Education Hub**: Interactive lessons and resources about bias detection and media literacy
- **Feedback System**: Provide and receive feedback on content analysis
- **Accessibility**: Full support for screen readers and keyboard navigation
- **Dark Mode**: Comfortable viewing in both light and dark environments

## Project Structure

```
web-platform/
├── vue-app/                 # Frontend Vue.js application
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/         # Page components
│   │   ├── stores/        # Pinia stores
│   │   ├── services/      # API and WebSocket services
│   │   └── router/        # Vue Router configuration
│   └── package.json
└── server/                 # Backend services
    ├── websocket.js       # WebSocket server
    └── package.json
```

## Setup

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Frontend Setup

1. Navigate to the Vue app directory:
   ```bash
   cd web-platform/vue-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### WebSocket Server Setup

1. Navigate to the server directory:
   ```bash
   cd web-platform/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the WebSocket server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or sign in
3. Start analyzing text content or explore the Education Hub
4. Invite collaborators to work together in real-time
5. Provide feedback and suggestions for improvement

## Development

### Adding New Features

1. Create new components in `vue-app/src/components/`
2. Add new routes in `vue-app/src/router/index.js`
3. Create new stores in `vue-app/src/stores/`
4. Add new WebSocket handlers in `server/websocket.js`

### Testing

Run the test suite:
```bash
npm run test
```

### Building for Production

Build the frontend:
```bash
cd web-platform/vue-app
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 