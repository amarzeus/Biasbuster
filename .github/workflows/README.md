# Biasbuster CI/CD Workflows

This directory contains the GitHub Actions workflows for the Biasbuster project. These workflows automate the building, testing, and deployment of the application.

## Workflow Overview

### Main CI/CD Pipeline (`biasbuster-pipeline.yml`)

Our comprehensive CI/CD pipeline that handles the entire software delivery process:

- **Setup**: Installs and caches dependencies
- **Lint**: Checks code quality and adherence to standards
- **Test**: Runs unit, integration, and API tests
- **Build**: Creates production-ready artifacts
- **Security**: Performs security scanning and vulnerability checks
- **E2E & Performance**: Runs end-to-end and performance tests
- **Docker**: Builds and pushes container images
- **Documentation**: Generates and publishes documentation
- **Deploy**: Deploys to the appropriate environment
- **Post-Deploy**: Performs health checks and sends notifications
- **Rollback**: Automatically rolls back failed deployments

### Supporting Workflows

- **dependency-scan.yml**: Weekly dependency vulnerability scanning
- **ci.yml**: Simple CI workflow for pull requests
- **test-workflows.yml**: Tests the workflows themselves

## How to Use

### Triggering Workflows

The main pipeline is triggered by:
- Pushes to `main`, `develop`, `feature/*`, and `release/*` branches
- Pull requests to `main` and `develop` branches
- Release publications
- Weekly schedule (for security scanning)
- Manual dispatch with environment selection

### Manual Workflow Dispatch

To manually trigger the CI/CD pipeline:

1. Navigate to the "Actions" tab in the GitHub repository
2. Select "Biasbuster Advanced CI/CD Pipeline" from the workflows list
3. Click "Run workflow"
4. Choose the target environment (development, staging, or production)
5. Optionally enable force deployment
6. Click "Run workflow"

## Environment Configuration

The workflows use the following environment variables and secrets:

### Environment Variables

- `NODE_VERSION`: Node.js version (18.x)
- `MONGODB_VERSION`: MongoDB version (5.0)
- `CACHE_NPM`: Path to npm cache
- `CACHE_NEXTJS`: Path to Next.js cache
- `DEFAULT_BRANCH`: Default branch name (main)

### Required Secrets

For full functionality, the following secrets should be configured:

- `CODECOV_TOKEN`: Token for uploading coverage reports
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `SSH_HOST`: SSH host for custom server deployment
- `SSH_USERNAME`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key
- `VERCEL_TOKEN`: Vercel deployment token
- `DEPLOYMENT_URL`: URL of the deployed application
- `SLACK_WEBHOOK`: Slack webhook for notifications
- `MAIL_SERVER`: Email server address
- `MAIL_PORT`: Email server port
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password
- `NOTIFICATION_EMAIL`: Email address for notifications

## Customization

To customize the workflows for your specific needs:

1. Edit the appropriate workflow file
2. Adjust environment variables in the workflow file
3. Update job dependencies as needed
4. Add or remove steps within jobs
5. Configure branch triggers in the `on` section

## Troubleshooting

If a workflow fails:

1. Check the workflow run logs in the GitHub Actions tab
2. Look for specific step failures and error messages
3. For deployment failures, check the rollback job logs
4. Verify that all required secrets are properly configured
5. Ensure the code meets all linting and testing requirements

## Best Practices

- Keep sensitive information in GitHub Secrets
- Use environment protection rules for production deployments
- Regularly review and update workflows
- Test workflow changes in feature branches
- Use the test-workflows.yml to validate workflow changes

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Actions Security Guides](https://docs.github.com/en/actions/security-guides)
- [Environment Secrets](https://docs.github.com/en/actions/reference/environments) 