# Required Secrets and Environment Variables

This document lists all the secrets and environment variables required for the GitHub Actions workflows to function properly.

## GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

### Code Coverage
- `CODECOV_TOKEN`: Token for uploading coverage reports to Codecov

### Docker Registry
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

### AWS Deployment
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region for deployment

### SSH Deployment
- `SSH_HOST`: Target server hostname/IP
- `SSH_USERNAME`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key for authentication

### Vercel Deployment
- `VERCEL_TOKEN`: Vercel authentication token

### Monitoring
- `DEPLOYMENT_URL`: URL of the deployed application for health checks

### Notifications
- `SLACK_WEBHOOK`: Slack webhook URL for notifications
- `MAIL_SERVER`: SMTP server address
- `MAIL_PORT`: SMTP server port
- `MAIL_USERNAME`: SMTP username
- `MAIL_PASSWORD`: SMTP password
- `NOTIFICATION_EMAIL`: Email address for notifications

## Environment Variables

These are already configured in the workflow files:

- `NODE_VERSION`: Set to '18.x'
- `MONGODB_VERSION`: Set to '5.0'
- `CACHE_NPM`: Set to '~/.npm'
- `CACHE_NEXTJS`: Set to '.next/cache'
- `DEFAULT_BRANCH`: Set to 'main'
- `DEPLOY_ENV`: Automatically set based on the target environment
- `STACK_NAME`: Automatically set based on the deployment environment

## Note

The "Context access might be invalid" warnings in the workflow file are expected if some secrets are not configured. The workflow is designed to skip steps that require missing secrets, allowing for flexible deployment configurations.

For local development or minimal CI setup, you only need to configure the essential secrets:
- `CODECOV_TOKEN` (if using code coverage reporting)
- `GITHUB_TOKEN` (automatically provided by GitHub Actions)

Other secrets can be added as needed when enabling additional deployment targets or notification services.
