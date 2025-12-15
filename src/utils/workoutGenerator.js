/**
 * Generate random workout based on difficulty or custom config
 * @param {string} difficulty - The difficulty level or 'individuell' for custom
 * @param {Object} exercises - The exercises object with all available exercises
 * @param {Object} workoutConfigs - The workout configurations for different difficulties
 * @param {Object} customConfig - The custom configuration (used when difficulty is 'individuell')
 * @returns {Array} Array of workout sequence items (exercises and pauses)
 */
export const generateWorkout = (difficulty, exercises, workoutConfigs, customConfig = null) => {
  const config = difficulty === 'individuell' ? customConfig : workoutConfigs[difficulty];
  
  if (!config) {
    throw new Error(`Unknown difficulty: ${difficulty}`);
  }
  
  if (!exercises || Object.keys(exercises).length === 0) {
    throw new Error('No exercises available');
  }
  
  const exerciseIds = Object.keys(exercises);
  const sequence = [];

  // Shuffle function to randomize exercises
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Track used exercises to avoid duplicates
  const usedExercises = new Set();
  const availableExercises = [...exerciseIds];

  // Get next available exercise (prefer unused ones)
  const getNextExercise = () => {
    // First, try to get an unused exercise
    const unusedExercises = availableExercises.filter(id => !usedExercises.has(id));
    
    if (unusedExercises.length > 0) {
      // Shuffle unused exercises and pick the first one
      const shuffledUnused = shuffleArray(unusedExercises);
      const selectedId = shuffledUnused[0];
      usedExercises.add(selectedId);
      return selectedId;
    } else {
      // All exercises have been used, reset and pick randomly
      usedExercises.clear();
      const shuffledAll = shuffleArray(availableExercises);
      const selectedId = shuffledAll[0];
      usedExercises.add(selectedId);
      return selectedId;
    }
  };

  // First, generate all exercises without pauses
  const exerciseSequence = [];
  let exerciseCount = 0;
  
  while (exerciseCount < config.totalExercises) {
    // Pick next available exercise
    const randomExerciseId = getNextExercise();
    const exerciseData = exercises[randomExerciseId];
    
    if (exerciseData.type === 'group') {
      // This is a group - check if we have room for both exercises
      if (exerciseCount + 1 < config.totalExercises) {
        // Add left exercise
        exerciseSequence.push({
          type: 'exercise',
          exerciseId: exerciseData.left.id,
          exercise: exerciseData.left
        });
        exerciseCount++;
        
        // Add right exercise
        exerciseSequence.push({
          type: 'exercise',
          exerciseId: exerciseData.right.id,
          exercise: exerciseData.right
        });
        exerciseCount++;
      } else {
        // Only room for one more exercise - pick a different individual exercise instead
        const individualExercises = exerciseIds.filter(id => exercises[id].type !== 'group');
        const unusedIndividualExercises = individualExercises.filter(id => !usedExercises.has(id));
        
        let selectedIndividualId;
        if (unusedIndividualExercises.length > 0) {
          // Pick from unused individual exercises
          const shuffledUnused = shuffleArray(unusedIndividualExercises);
          selectedIndividualId = shuffledUnused[0];
        } else if (individualExercises.length > 0) {
          // All individual exercises used, pick randomly
          const shuffledAll = shuffleArray(individualExercises);
          selectedIndividualId = shuffledAll[0];
        } else {
          // Fallback: if no individual exercises exist, add the left exercise
          selectedIndividualId = exerciseData.left.id;
        }
        
        usedExercises.add(selectedIndividualId);
        exerciseSequence.push({
          type: 'exercise',
          exerciseId: selectedIndividualId,
          exercise: exercises[selectedIndividualId]?.left || undefined
        });
        exerciseCount++;
      }
    } else {
      // This is a regular individual exercise
      exerciseSequence.push({
        type: 'exercise',
        exerciseId: randomExerciseId
      });
      exerciseCount++;
    }
  }

  // Now insert pauses at calculated positions
  if (config.pauseCount > 0) {
    // Calculate pause positions - distribute evenly among exercises
    const interval = Math.floor(config.totalExercises / (config.pauseCount + 1));
    const pausePositions = [];
    
    for (let i = 1; i <= config.pauseCount; i++) {
      const position = interval * i;
      if (position < config.totalExercises) {
        pausePositions.push(position);
      }
    }

    // Insert pauses at calculated positions (in reverse order to maintain indices)
    for (let i = pausePositions.length - 1; i >= 0; i--) {
      const pausePosition = pausePositions[i];
      exerciseSequence.splice(pausePosition, 0, {
        type: 'pause',
        duration: config.pauseDuration
      });
    }
  }

  return exerciseSequence;
};