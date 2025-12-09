# Test Structure

This directory contains test utilities, fixtures, and shared test setup.

## Folder Structure

```
tests/
├── setup.ts              # Global test setup and configuration
├── utils/                # Test utilities and helpers
│   ├── test-utils.tsx    # Custom render function and testing utilities
│   └── *.test.ts        # Utility tests
├── __mocks__/            # Mock implementations
├── fixtures/             # Test data and fixtures
└── README.md            # This file
```

## Test File Locations

- **Co-located tests**: Place test files next to source files (e.g., `component.test.tsx` next to `component.tsx`)
- **Integration tests**: Place in `tests/` directory
- **E2E tests**: Place in `e2e/` directory (Playwright)

## Usage

Import test utilities:

```tsx
import { render, screen } from "@/tests/utils/test-utils";
```
