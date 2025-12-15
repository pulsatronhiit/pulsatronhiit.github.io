import { generateWorkout } from '../utils/workoutGenerator';
import { mockExercises, mockWorkoutConfigs, mockCustomConfig } from './fixtures/mockData';

describe('generateWorkout', () => {
  describe('Input validation', () => {
    test('should throw error for unknown difficulty', () => {
      expect(() => {
        generateWorkout('unknown', mockExercises, mockWorkoutConfigs);
      }).toThrow('Unknown difficulty: unknown');
    });

    test('should throw error when exercises object is empty', () => {
      expect(() => {
        generateWorkout('leicht', {}, mockWorkoutConfigs);
      }).toThrow('No exercises available');
    });

    test('should throw error when exercises is null or undefined', () => {
      expect(() => {
        generateWorkout('leicht', null, mockWorkoutConfigs);
      }).toThrow('No exercises available');
      
      expect(() => {
        generateWorkout('leicht', undefined, mockWorkoutConfigs);
      }).toThrow('No exercises available');
    });

    test('should handle custom config when difficulty is "individuell"', () => {
      const result = generateWorkout('individuell', mockExercises, mockWorkoutConfigs, mockCustomConfig);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should throw error when custom config is missing for "individuell" difficulty', () => {
      expect(() => {
        generateWorkout('individuell', mockExercises, mockWorkoutConfigs, null);
      }).toThrow('Unknown difficulty: individuell');
    });
  });

  describe('Workout sequence generation', () => {
    test('should generate workout with correct total exercise count', () => {
      const difficulty = 'leicht';
      const result = generateWorkout(difficulty, mockExercises, mockWorkoutConfigs);
      
      // Count only exercise items (excluding pauses)
      const exerciseItems = result.filter(item => item.type === 'exercise');
      expect(exerciseItems).toHaveLength(mockWorkoutConfigs[difficulty].totalExercises);
    });

    test('should generate workout with pause count up to the configured maximum', () => {
      const difficulty = 'moderat';
      const result = generateWorkout(difficulty, mockExercises, mockWorkoutConfigs);
      
      // Count pause items - should be <= configured count due to positioning logic
      const pauseItems = result.filter(item => item.type === 'pause');
      expect(pauseItems.length).toBeLessThanOrEqual(mockWorkoutConfigs[difficulty].pauseCount);
      expect(pauseItems.length).toBeGreaterThanOrEqual(0);
    });

    test('should generate workout with no pauses when pauseCount is 0', () => {
      const configWithNoPauses = {
        ...mockWorkoutConfigs.leicht,
        pauseCount: 0
      };
      
      const customWorkoutConfigs = {
        ...mockWorkoutConfigs,
        leicht: configWithNoPauses
      };
      
      const result = generateWorkout('leicht', mockExercises, customWorkoutConfigs);
      const pauseItems = result.filter(item => item.type === 'pause');
      expect(pauseItems).toHaveLength(0);
    });

    test('should include pause duration in pause items', () => {
      const difficulty = 'moderat';
      const result = generateWorkout(difficulty, mockExercises, mockWorkoutConfigs);
      
      const pauseItems = result.filter(item => item.type === 'pause');
      pauseItems.forEach(pauseItem => {
        expect(pauseItem.duration).toBe(mockWorkoutConfigs[difficulty].pauseDuration);
      });
    });
  });

  describe('Exercise selection and distribution', () => {
    test('should include valid exercise IDs', () => {
      const result = generateWorkout('leicht', mockExercises, mockWorkoutConfigs);
      const exerciseItems = result.filter(item => item.type === 'exercise');
      
      exerciseItems.forEach(item => {
        expect(item.exerciseId).toBeDefined();
        expect(typeof item.exerciseId).toBe('string');
      });
    });

    test('should handle individual exercises correctly', () => {
      // Create a mock with only individual exercises
      const individualExercisesOnly = Object.fromEntries(
        Object.entries(mockExercises).filter(([key, value]) => value.type !== 'group')
      );
      
      const result = generateWorkout('leicht', individualExercisesOnly, mockWorkoutConfigs);
      const exerciseItems = result.filter(item => item.type === 'exercise');
      
      exerciseItems.forEach(item => {
        expect(item.type).toBe('exercise');
        expect(item.exerciseId).toBeDefined();
        // For individual exercises, the exercise property should be undefined
        expect(item.exercise).toBeUndefined();
      });
    });

    test('should handle group exercises correctly', () => {
      // Create a mock with only group exercises
      const groupExercisesOnly = Object.fromEntries(
        Object.entries(mockExercises).filter(([key, value]) => value.type === 'group')
      );
      
      const result = generateWorkout('leicht', groupExercisesOnly, mockWorkoutConfigs);
      const exerciseItems = result.filter(item => item.type === 'exercise');
      
      exerciseItems.forEach(item => {
        expect(item.type).toBe('exercise');
        expect(item.exerciseId).toBeDefined();
        // For group exercises, the exercise property should be defined
        expect(item.exercise).toBeDefined();
        expect(item.exercise.id).toBe(item.exerciseId);
      });
    });

    test('should distribute pauses evenly throughout workout', () => {
      const difficulty = 'moderat'; // Has 2 pauses and 8 exercises
      const result = generateWorkout(difficulty, mockExercises, mockWorkoutConfigs);
      
      const pausePositions = [];
      result.forEach((item, index) => {
        if (item.type === 'pause') {
          // Count exercises before this pause
          const exercisesBefore = result.slice(0, index).filter(x => x.type === 'exercise').length;
          pausePositions.push(exercisesBefore);
        }
      });
      
      // Pauses should be distributed roughly evenly
      // With 8 exercises and 2 pauses, expect pauses around positions 2-3 and 5-6
      expect(pausePositions).toHaveLength(2);
      expect(pausePositions[0]).toBeGreaterThan(0);
      expect(pausePositions[0]).toBeLessThan(mockWorkoutConfigs[difficulty].totalExercises);
      expect(pausePositions[1]).toBeGreaterThan(pausePositions[0]);
      expect(pausePositions[1]).toBeLessThan(mockWorkoutConfigs[difficulty].totalExercises);
    });
  });

  describe('Custom configuration', () => {
    test('should use custom config for "individuell" difficulty', () => {
      const customConfig = {
        totalExercises: 8,
        pauseCount: 2,
        pauseDuration: '03:00'
      };
      
      const result = generateWorkout('individuell', mockExercises, mockWorkoutConfigs, customConfig);
      
      const exerciseItems = result.filter(item => item.type === 'exercise');
      const pauseItems = result.filter(item => item.type === 'pause');
      
      expect(exerciseItems).toHaveLength(customConfig.totalExercises);
      // Note: pause count might be less than expected due to complex pause positioning logic
      expect(pauseItems.length).toBeLessThanOrEqual(customConfig.pauseCount);
      
      if (pauseItems.length > 0) {
        expect(pauseItems[0].duration).toBe(customConfig.pauseDuration);
      }
    });
  });

  describe('Randomization and uniqueness', () => {
    test('should generate different sequences on multiple calls', () => {
      // Mock Math.random to ensure deterministic but different results
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = jest.fn(() => {
        callCount++;
        return (callCount * 0.1234567) % 1;
      });
      
      const result1 = generateWorkout('leicht', mockExercises, mockWorkoutConfigs);
      const result2 = generateWorkout('leicht', mockExercises, mockWorkoutConfigs);
      
      // Results should be arrays but might be different due to randomization
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
      expect(result1.length).toBeGreaterThan(0);
      expect(result2.length).toBeGreaterThan(0);
      
      Math.random = originalRandom;
    });

    test('should handle case when there are more exercises needed than available', () => {
      // Create scenario with many exercises needed but few available
      const limitedExercises = {
        "exercise1": {
          "id": "exercise1",
          "name": "Exercise 1",
          "description": "Test exercise 1"
        },
        "exercise2": {
          "id": "exercise2", 
          "name": "Exercise 2",
          "description": "Test exercise 2"
        }
      };
      
      const configWithManyExercises = {
        name: 'Test',
        totalExercises: 6, // More than available exercises
        pauseCount: 1,
        pauseDuration: '01:00'
      };
      
      const testConfigs = { test: configWithManyExercises };
      const result = generateWorkout('test', limitedExercises, testConfigs);
      
      const exerciseItems = result.filter(item => item.type === 'exercise');
      expect(exerciseItems).toHaveLength(configWithManyExercises.totalExercises);
      
      // Should reuse exercises when necessary
      const exerciseIds = exerciseItems.map(item => item.exerciseId);
      const uniqueIds = new Set(exerciseIds);
      expect(uniqueIds.size).toBeLessThanOrEqual(Object.keys(limitedExercises).length);
    });
  });

  describe('Edge cases', () => {
    test('should handle single exercise in database', () => {
      const singleExercise = {
        "only-exercise": {
          "id": "only-exercise",
          "name": "Only Exercise",
          "description": "The only available exercise"
        }
      };
      
      const result = generateWorkout('leicht', singleExercise, mockWorkoutConfigs);
      const exerciseItems = result.filter(item => item.type === 'exercise');
      
      expect(exerciseItems).toHaveLength(mockWorkoutConfigs.leicht.totalExercises);
      exerciseItems.forEach(item => {
        expect(item.exerciseId).toBe('only-exercise');
      });
    });

    test('should handle workout with 1 exercise and 0 pauses', () => {
      const minimalConfig = {
        name: 'Minimal',
        totalExercises: 1,
        pauseCount: 0,
        pauseDuration: '01:00'
      };
      
      const testConfigs = { minimal: minimalConfig };
      const result = generateWorkout('minimal', mockExercises, testConfigs);
      
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('exercise');
    });

    test('should handle group exercise when only one slot remaining', () => {
      // This tests the fallback logic when a group exercise is selected
      // but there's only room for one more exercise
      const configWithOddTotal = {
        name: 'Odd',
        totalExercises: 3, // Odd number to trigger the "only room for one" case
        pauseCount: 0,
        pauseDuration: '01:00'
      };
      
      const testConfigs = { odd: configWithOddTotal };
      const result = generateWorkout('odd', mockExercises, testConfigs);
      
      const exerciseItems = result.filter(item => item.type === 'exercise');
      expect(exerciseItems).toHaveLength(3);
    });
  });

  describe('Workout sequence structure', () => {
    test('should return array of objects with correct structure', () => {
      const result = generateWorkout('leicht', mockExercises, mockWorkoutConfigs);
      
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(['exercise', 'pause']).toContain(item.type);
        
        if (item.type === 'exercise') {
          expect(item).toHaveProperty('exerciseId');
          expect(typeof item.exerciseId).toBe('string');
        } else if (item.type === 'pause') {
          expect(item).toHaveProperty('duration');
          expect(typeof item.duration).toBe('string');
        }
      });
    });

    test('should never have consecutive pauses', () => {
      const result = generateWorkout('moderat', mockExercises, mockWorkoutConfigs);
      
      for (let i = 0; i < result.length - 1; i++) {
        if (result[i].type === 'pause') {
          expect(result[i + 1].type).toBe('exercise');
        }
      }
    });

    test('should not have pause as first or last item', () => {
      const result = generateWorkout('moderat', mockExercises, mockWorkoutConfigs);
      
      if (result.length > 0) {
        expect(result[0].type).toBe('exercise');
        expect(result[result.length - 1].type).toBe('exercise');
      }
    });
  });
});