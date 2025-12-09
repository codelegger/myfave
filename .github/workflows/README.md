# GitHub Actions Workflows

This directory contains CI/CD workflows for the project.

## Workflows

### `ci.yml` - Main CI Pipeline

Runs on push and pull requests to `main` and `develop` branches.

**Jobs:**

1. **lint-and-format**: Runs ESLint and Prettier checks
2. **unit-tests**: Runs Vitest unit tests with coverage
3. **e2e-tests**: Runs Playwright E2E tests
4. **build**: Builds the Next.js application

### `test.yml` - Test Matrix

Runs unit and E2E tests in parallel using a matrix strategy.

## Environment Variables

Set these in GitHub repository settings (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_API_URL`: API base URL for the application
- `API_TOKEN`: API authentication token (if needed)

## Artifacts

- Playwright reports are uploaded as artifacts and retained for 30 days
- Coverage reports can be uploaded to Codecov (optional)

## Node.js Version

The workflows use the Node.js version specified in `.nvmrc` (currently 22.20.0).
