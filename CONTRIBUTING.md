# Contributing to Biasbuster

Thank you for your interest in contributing to Biasbuster! We welcome contributions from everyone who wants to help improve media literacy through our bias detection platform.

## Ways to Contribute

There are many ways to contribute to Biasbuster:

- **Code Contributions**: Add new features, fix bugs, or improve performance
- **Documentation**: Improve README, create tutorials, or add code comments
- **Design**: Enhance UI/UX, create visual assets, or improve accessibility
- **Testing**: Test the application, report bugs, or write test cases
- **Prompts**: Help improve our AI prompts for better bias detection
- **Ideas**: Suggest new features or improvements

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```
   git clone https://github.com/YOUR-USERNAME/Biasbuster.git
   ```
3. **Create a new branch**
   ```
   git checkout -b feature/your-feature-name
   ```
4. **Set up the development environment**
   ```
   npm install
   ```
5. **Make your changes**
6. **Test your changes**
   ```
   npm test
   ```
7. **Commit your changes**
   ```
   git commit -m "Add a descriptive commit message"
   ```
8. **Push your changes**
   ```
   git push origin feature/your-feature-name
   ```
9. **Create a pull request**

## Code Style Guidelines

- Follow the existing code style and patterns in the codebase
- Use meaningful variable and function names
- Add comments for complex logic
- Follow TypeScript best practices
- Keep functions small and focused on a single task
- Write tests for new functionality

## Commit Message Guidelines

We use conventional commits to make the commit history more readable:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code changes that neither fix bugs nor add features
- `test:` Adding or modifying tests
- `chore:` Changes to the build process or auxiliary tools

Example: `feat: add sentiment analysis visualization`

## Pull Request Process

1. Ensure your code follows our style guidelines
2. Update documentation if necessary
3. Include a description of your changes and why they should be included
4. Link any related issues
5. Your PR will be reviewed by maintainers who may request changes
6. Once approved, your PR will be merged

## Project Structure

- `/src` - Backend server code
- `/chrome-extension` - Chrome extension code
- `/web-platform` - Web application code
- `/prompts` - AI prompts for bias analysis
- `/docs` - Documentation and visual assets

## AI Model Integration

When contributing to AI model integration:

1. Ensure your code can handle API failures gracefully
2. Respect rate limits and implement appropriate caching
3. Follow best practices for prompt engineering
4. Document any new AI capabilities or limitations

## Questions?

If you have any questions about contributing, please open an issue with the label "question".

Thank you for helping make Biasbuster better for everyone! 