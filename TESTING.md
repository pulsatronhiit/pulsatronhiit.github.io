# Testing Documentation

## Overview

This project uses Jest as the testing framework to ensure the reliability and correctness of the workout generation functionality, specifically the `generateWorkout` function.

## Test Coverage

The tests achieve excellent coverage:
- **94.20% Statement Coverage**
- **88.23% Branch Coverage**  
- **100% Function Coverage**
- **93.75% Line Coverage**

## Test Structure

### Test Files

- `src/__tests__/generateWorkout.test.js` - Main test suite for the generateWorkout function
- `src/__tests__/fixtures/mockData.js` - Test data and fixtures
- `src/utils/workoutGenerator.js` - Extracted utility function for better testability

### Test Categories

#### 1. Input Validation Tests
- ✅ Validates error handling for unknown difficulties
- ✅ Validates error handling for empty/missing exercises
- ✅ Validates custom config handling for "individuell" difficulty

#### 2. Workout Sequence Generation Tests
- ✅ Verifies correct total exercise count
- ✅ Verifies pause count within expected bounds
- ✅ Verifies proper pause duration assignment
- ✅ Handles workouts with zero pauses

#### 3. Exercise Selection and Distribution Tests
- ✅ Validates exercise ID presence and format
- ✅ Handles individual exercises correctly
- ✅ Handles group exercises (left/right pairs) correctly
- ✅ Distributes pauses evenly throughout workout

#### 4. Custom Configuration Tests
- ✅ Uses custom config parameters for "individuell" difficulty
- ✅ Applies custom exercise counts, pause counts, and durations

#### 5. Randomization and Uniqueness Tests
- ✅ Generates different sequences on multiple calls
- ✅ Handles cases with more exercises needed than available
- ✅ Properly reuses exercises when necessary

#### 6. Edge Cases Tests
- ✅ Single exercise in database
- ✅ Minimal workout (1 exercise, 0 pauses)
- ✅ Group exercise when only one slot remaining

#### 7. Workout Sequence Structure Tests
- ✅ Returns properly structured objects
- ✅ Prevents consecutive pauses
- ✅ Ensures pauses are never first or last items

## Available Test Scripts

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Configuration

### Jest Configuration (`jest.config.cjs`)
- **Environment**: `jest-environment-jsdom` for DOM testing support
- **Setup**: `src/setupTests.js` for test initialization
- **Transform**: Babel for JSX and ES6+ support
- **Test Pattern**: Files ending in `.test.js` or `.spec.js`

### Babel Configuration (`babel.config.cjs`)
- **Presets**: 
  - `@babel/preset-env` for modern JavaScript
  - `@babel/preset-react` for React JSX support

## Mock Data Structure

The tests use realistic mock data that mirrors the actual exercise structure:

```javascript
// Individual exercises
{
  "exercise-id": {
    "id": "exercise-id",
    "name": "Exercise Name",
    "description": "Exercise description"
  }
}

// Group exercises (left/right pairs)
{
  "group-id": {
    "type": "group",
    "left": { "id": "left-id", "name": "Left Exercise", ... },
    "right": { "id": "right-id", "name": "Right Exercise", ... }
  }
}
```

## Workout Configuration Structure

```javascript
{
  difficulty: {
    name: 'Display Name',
    totalExercises: 20,    // Number of exercises
    pauseCount: 2,         // Number of pauses
    pauseDuration: '02:00' // Pause duration (MM:SS)
  }
}
```

## Key Testing Insights

1. **Pause Distribution**: The algorithm distributes pauses evenly but may result in fewer pauses than configured due to positioning constraints.

2. **Exercise Reuse**: When more exercises are needed than available, the function intelligently reuses exercises while maintaining variety.

3. **Group Exercise Handling**: Group exercises (left/right pairs) are treated specially and may fall back to individual exercises when space is limited.

4. **Randomization**: The function uses proper shuffling algorithms to ensure workout variety while avoiding immediate duplicates.

## Running Tests

To run the test suite:

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode for development
npm run test:watch
```

The tests provide comprehensive validation of the workout generation logic and serve as documentation for the expected behavior of the system.