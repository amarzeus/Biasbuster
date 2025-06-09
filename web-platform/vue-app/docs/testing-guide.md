# Biasbuster Testing Guide

## Overview

This guide outlines our testing strategy, tools, and best practices for maintaining high-quality code in the Biasbuster project.

## Testing Stack

- **Vitest**: Unit and component testing
- **Vue Test Utils**: Component testing utilities
- **Testing Library**: User-centric testing utilities
- **MSW**: API mocking
- **Playwright**: E2E testing

## Test Types

### 1. Unit Tests
- Test individual functions and methods
- Located in `__tests__/unit/`
- File naming: `*.spec.ts`

### 2. Component Tests
- Test Vue components in isolation
- Located in `__tests__/components/`
- File naming: `*.spec.ts`
- Use `@vue/test-utils`

### 3. Integration Tests
- Test component interactions
- Located in `__tests__/integration/`
- File naming: `*.spec.ts`

### 4. E2E Tests
- Test complete user flows
- Located in `e2e/`
- File naming: `*.spec.ts`
- Use Playwright

## Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ComponentName } from './ComponentName.vue';

describe('ComponentName', () => {
  // Setup
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(ComponentName, {
      // Mount options
    });
  });

  // Test cases
  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
```

## Best Practices

### 1. Component Testing
- Test component rendering
- Test props and events
- Test user interactions
- Test accessibility
- Test error states
- Test loading states

### 2. Store Testing
- Test state mutations
- Test actions
- Test getters
- Test store integration

### 3. API Testing
- Mock API responses
- Test error handling
- Test loading states
- Test data transformations

### 4. Accessibility Testing
- Test ARIA attributes
- Test keyboard navigation
- Test screen reader compatibility
- Test color contrast

## Running Tests

```bash
# Run all tests
npm run test

# Run unit tests
npm run test:unit

# Run component tests
npm run test:components

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Test Generation

We provide automated test generation for components:

```bash
# Generate tests for all components
npm run generate:tests

# Generate test for specific component
npm run generate:tests -- --component ComponentName
```

## Issue Checking

Check for common issues in components:

```bash
# Check all components
npm run check:issues

# Check specific component
npm run check:issues -- --component ComponentName
```

## Code Analysis

Analyze the codebase for metrics and coverage:

```bash
# Run full analysis
npm run analyze

# Generate coverage report
npm run analyze:coverage
```

## Continuous Integration

Our GitHub Actions workflow automatically:
- Runs all tests
- Checks for issues
- Analyzes code quality
- Generates reports

## Test Reports

- Coverage reports: `coverage/`
- Analysis reports: `analysis-report.json`
- Issue reports: `issues-report.json`

## Common Patterns

### 1. Testing Props
```typescript
it('renders with props', () => {
  const wrapper = mount(Component, {
    props: {
      propName: 'value'
    }
  });
  expect(wrapper.text()).toContain('value');
});
```

### 2. Testing Events
```typescript
it('emits event', async () => {
  const wrapper = mount(Component);
  await wrapper.find('button').trigger('click');
  expect(wrapper.emitted('eventName')).toBeTruthy();
});
```

### 3. Testing Store
```typescript
it('updates store', async () => {
  const store = useStore();
  const wrapper = mount(Component);
  await wrapper.find('button').trigger('click');
  expect(store.state.value).toBe('newValue');
});
```

### 4. Testing API Calls
```typescript
it('handles API response', async () => {
  const wrapper = mount(Component);
  await wrapper.vm.fetchData();
  expect(wrapper.text()).toContain('Data loaded');
});
```

## Troubleshooting

### Common Issues

1. **Test Not Running**
   - Check file naming (`*.spec.ts`)
   - Check test directory structure
   - Check import paths

2. **Component Not Mounting**
   - Check component registration
   - Check required props
   - Check global plugins

3. **Store Not Working**
   - Check store registration
   - Check state initialization
   - Check action/mutation names

4. **API Mocking Issues**
   - Check MSW setup
   - Check request handlers
   - Check response format

## Resources

- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/) 