# Contributing to Biasbuster

Thank you for your interest in contributing to Biasbuster! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Communication](#communication)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) that all contributors are expected to follow. Please read it before participating.

## Getting Started

### Prerequisites

- Node.js (version 16.x or 18.x)
- npm (comes with Node.js)
- MongoDB (version 5.0 or newer)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Biasbuster.git
   cd Biasbuster
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/Biasbuster.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```
6. Configure your local environment variables in the `.env` file
7. Run the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Always create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/` - for new features
   - `fix/` - for bug fixes
   - `docs/` - for documentation updates
   - `test/` - for test additions or modifications
   - `refactor/` - for code refactoring
   - `chore/` - for routine tasks, dependency updates, etc.

2. Make your changes with clear, descriptive commits:
   ```bash
   git commit -m "feat: add new bias detection algorithm"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/) format.

3. Keep your branch up to date with the main branch:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. Update your forked repository with the latest changes from the upstream repository.
2. Ensure your code passes all tests:
   ```bash
   npm test
   ```
3. Ensure your code follows the coding standards:
   ```bash
   npm run lint
   ```
4. Create a pull request to the `develop` branch of the original repository.
5. Fill out the pull request template with all required information.
6. Wait for a review from maintainers.
7. Address any feedback and make requested changes.
8. Once approved, your pull request will be merged.

## Coding Standards

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications:

- Use TypeScript for all new code
- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Use ES6 syntax (arrow functions, destructuring, etc.)
- Document all functions, classes, and complex code blocks with JSDoc comments

Before submitting your code, run:
```bash
npm run lint
npm run format
```

## Testing Guidelines

All new features and bug fixes should include appropriate tests:

- **Unit tests** for individual components
- **Integration tests** for API endpoints
- **End-to-end tests** for critical user flows

To run tests:
```bash
npm test               # Run all tests
npm run test:unit      # Run only unit tests
npm run test:api       # Run only API tests
npm run test:e2e       # Run only end-to-end tests
```

Aim for high test coverage, especially for critical components and utility functions.

## Documentation

Good documentation is crucial for the project:

- Add or update JSDoc comments for all functions, classes, and types
- Update README files as needed
- Create or update wiki pages for complex features
- Document API endpoints using OpenAPI/Swagger

## Issue Reporting

When reporting issues, please use the issue templates provided and include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or logs (if applicable)
- Environment information (browser, OS, etc.)

## Feature Requests

Feature requests are welcome. Please provide:

- A clear and descriptive title
- Detailed description of the proposed feature
- Any relevant examples or mockups
- Explanation of the use case and benefits

## Communication

- **GitHub Issues**: For bug reports, feature requests, and task tracking
- **Pull Requests**: For code review and discussion
- **Community Chat**: Join our [Discord server](https://discord.gg/biasbuster) for real-time discussion
- **Mailing List**: Subscribe to our [mailing list](https://biasbuster.com/mailing-list) for announcements

---

Thank you for contributing to Biasbuster! Your efforts help make the internet a more balanced and fair place. 