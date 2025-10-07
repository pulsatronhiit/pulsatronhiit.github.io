import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ExerciseDisplay from './components/ExerciseDisplay';
import './App.css';

function App() {
  const [exercises, setExercises] = useState({});
  const [workoutSequence, setWorkoutSequence] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [timerKey, setTimerKey] = useState(0); // Force timer re-render
  const [isWarningTime, setIsWarningTime] = useState(false); // Track warning state
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer control
  const [isRestTime, setIsRestTime] = useState(false); // Track if we're in rest period
  const [isPreWorkout, setIsPreWorkout] = useState(false); // Track pre-workout countdown
  const [isLongPause, setIsLongPause] = useState(false); // Track if we're in a long pause
  const [currentPauseDuration, setCurrentPauseDuration] = useState(null); // Store current pause duration
  const [isTransitionFlash, setIsTransitionFlash] = useState(false); // Track flash transition

  // Load exercises from JSON file
  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        // Load exercises library
        const exercisesResponse = await fetch('./exercises.json');
        const exercisesData = await exercisesResponse.json();
        setExercises(exercisesData.exercises);
      } catch (error) {
        console.error('Error loading workout data:', error);
      }
    };
    
    loadWorkoutData();
  }, []); 

  // Function to trigger flash transition
  const triggerFlashTransition = () => {
    setIsTransitionFlash(true);
    setTimeout(() => {
      setIsTransitionFlash(false);
    }, 250); // Match the animation duration
  };

  // Workout difficulty configurations
  const workoutConfigs = {
    leicht: {
      name: 'Leicht',
      totalExercises: 15,
      pauses: [{ after: 5, duration: '01:00' }]
    },
    moderat: {
      name: 'Moderat',
      totalExercises: 20,
      pauses: [{ after: 10, duration: '02:00' }]
    },
    anstrengend: {
      name: 'Anstrengend',
      totalExercises: 30,
      pauses: [{ after: 10, duration: '01:00' }, { after: 20, duration: '01:00' }]
    },
    brutal: {
      name: 'Brutal',
      totalExercises: 40,
      pauses: [{ after: 20, duration: '02:00' }]
    }
  };

  // Generate random workout based on difficulty
  const generateWorkout = (difficulty) => {
    const config = workoutConfigs[difficulty];
    const exerciseIds = Object.keys(exercises);
    const sequence = [];

    // Generate random exercise sequence
    for (let i = 0; i < config.totalExercises; i++) {
      // Add random exercise
      const randomExerciseId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)];
      sequence.push({
        type: 'exercise',
        exerciseId: randomExerciseId
      });

      // Add pauses at specified intervals
      config.pauses.forEach(pause => {
        if (i + 1 === pause.after && i + 1 < config.totalExercises) {
          sequence.push({
            type: 'pause',
            duration: pause.duration
          });
        }
      });
    }

    return sequence;
  };

  // Handle difficulty selection
  const selectDifficulty = (difficulty) => {
    const sequence = generateWorkout(difficulty);
    setWorkoutSequence(sequence);
    setSelectedDifficulty(difficulty);
    setDifficultySelected(true);
  };

  // Go back to difficulty selection
  const goBackToDifficultySelection = () => {
    setDifficultySelected(false);
    setSelectedDifficulty(null);
    setWorkoutSequence([]);
  };

  // Get difficulty details for display
  const getDifficultyDetails = (difficulty) => {
    if (!difficulty || !workoutConfigs[difficulty]) return null;
    const config = workoutConfigs[difficulty];
    
    const pauseDetails = config.pauses.map((pause, index) => {
      return `${pause.duration} Min nach ${pause.after} Übungen`;
    }).join(' '); 

    return {
      name: config.name,
      exercises: config.totalExercises,
      pauseText: pauseDetails
    };
  };

  const handleTimeUp = () => {
    if (isPreWorkout) {
      // Pre-workout countdown finished, start actual workout
      triggerFlashTransition();
      setIsPreWorkout(false);
      setWorkoutStarted(true);
      setIsTimerActive(true);
      setTimerKey(prev => prev + 1); // Reset timer for first exercise
    } else if (workoutStarted && workoutSequence.length > 0) {
      if (isLongPause) {
        // Long pause finished, move to next exercise
        triggerFlashTransition();
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setIsLongPause(false);
        setCurrentPauseDuration(null);
        setTimerKey(prev => prev + 1); // Reset timer for next exercise
      } else if (!isRestTime) {
        // Exercise finished, check if next item is a pause or move to rest
        const nextIndex = currentExerciseIndex + 1;
        if (nextIndex < workoutSequence.length && workoutSequence[nextIndex].type === 'pause') {
          // Next item is a pause, start long pause
          triggerFlashTransition();
          setCurrentExerciseIndex(nextIndex);
          setIsLongPause(true);
          setCurrentPauseDuration(workoutSequence[nextIndex].duration);
          setTimerKey(prev => prev + 1); // Reset timer for pause
        } else if (nextIndex < workoutSequence.length) {
          // Next item is an exercise, start rest period
          triggerFlashTransition();
          setIsRestTime(true);
          setTimerKey(prev => prev + 1); // Reset timer for rest period
        } else {
          // Last exercise finished, end workout
          setWorkoutStarted(false);
          setCurrentExerciseIndex(0);
          setIsRestTime(false);
          setIsLongPause(false);
          setIsPreWorkout(false);
          setCurrentPauseDuration(null);
          setTimerKey(prev => prev + 1);
        }
      } else {
        // Rest period finished, move to next exercise
        triggerFlashTransition();
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setIsRestTime(false);
        setTimerKey(prev => prev + 1); // Reset timer for next exercise
      }
    }
  };

  const startWorkout = () => {
    setIsPreWorkout(true);
    setWorkoutStarted(false); // Don't start workout yet
    setCurrentExerciseIndex(0);
    setIsTimerActive(true);
    setIsRestTime(false);
    setTimerKey(prev => prev + 1); // Start pre-workout countdown
  };

  const resetWorkout = () => {
    triggerFlashTransition();
    setWorkoutStarted(false);
    setDifficultySelected(false);
    setSelectedDifficulty(null);
    setWorkoutSequence([]);
    setCurrentExerciseIndex(0);
    setIsTimerActive(false);
    setIsRestTime(false);
    setIsPreWorkout(false);
    setIsLongPause(false);
    setCurrentPauseDuration(null);
    setTimerKey(prev => prev + 1); // Force timer reset when workout ends
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  // Helper function to get exercise data by sequence item
  const getExerciseFromSequence = (sequenceItem) => {
    if (!sequenceItem) return null;
    if (sequenceItem.type === 'pause') {
      return {
        type: 'pause',
        name: 'Längere Pause', // Always use "Längere Pause" for any pause
        duration: sequenceItem.duration
      };
    }
    return exercises[sequenceItem.exerciseId] || null;
  };

  const currentExercise = (workoutStarted || isPreWorkout) && workoutSequence.length > 0 
    ? getExerciseFromSequence(workoutSequence[currentExerciseIndex])
    : null;

  const nextExercise = (workoutStarted || isPreWorkout) && workoutSequence.length > 0 && currentExerciseIndex < workoutSequence.length - 1
    ? getExerciseFromSequence(workoutSequence[currentExerciseIndex + 1])
    : null;

  // Helper function to get the count of actual exercises (excluding pauses)
  const getExerciseCount = () => {
    return workoutSequence.filter(item => item.type !== 'pause').length;
  };

  // Helper function to get the current exercise number (excluding pauses)
  const getCurrentExerciseNumber = () => {
    return workoutSequence.slice(0, currentExerciseIndex + 1).filter(item => item.type !== 'pause').length;
  };

  return (
    <div className={`app ${isWarningTime ? 'warning-active' : ''} ${isTransitionFlash ? 'transition-flash' : ''}`}>
      <header className="app-header">
        {workoutStarted && (
          <div className="workout-progress">
            {isLongPause
              ? `Längere Pause - ${currentExercise?.name || 'Pause'}`
              : isRestTime 
                ? `Pause nach Übung ${getCurrentExerciseNumber()} von ${getExerciseCount()}`
                : `Übung ${getCurrentExerciseNumber()} von ${getExerciseCount()}`
            }
          </div>
        )}
      </header>

      <main className="app-main">
        {(workoutStarted || isPreWorkout) && (
          <Timer 
            onTimeUp={handleTimeUp}
            autoStart={workoutStarted || isPreWorkout}
            onWarningChange={setIsWarningTime}
            isActive={isTimerActive}
            isRestTime={isRestTime}
            isPreWorkout={isPreWorkout}
            isLongPause={isLongPause}
            pauseDuration={currentPauseDuration}
            key={timerKey} // Force timer re-render with auto-start on exercise change
          />
        )}
        
        {difficultySelected && (
          <ExerciseDisplay 
            exercise={currentExercise} 
            nextExercise={nextExercise}
            isLastExercise={workoutStarted && workoutSequence.length > 0 && currentExerciseIndex === workoutSequence.length - 1}
            isRestTime={isRestTime}
            isPreWorkout={isPreWorkout}
            isLongPause={isLongPause}
          />
        )}
        
        {!difficultySelected && (
          <div className="difficulty-selection">
            <h2>Wähle deine Herausforderung</h2>
            <div className="difficulty-buttons">
              <button 
                onClick={() => selectDifficulty('leicht')} 
                className="difficulty-btn easy"
              >
                <strong>Leicht</strong>
                <span>15 Übungen</span>
                <span>1 Pause (1 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('moderat')} 
                className="difficulty-btn moderate"
              >
                <strong>Moderat</strong>
                <span>20 Übungen</span>
                <span>1 Pause (2 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('anstrengend')} 
                className="difficulty-btn hard"
              >
                <strong>Anstrengend</strong>
                <span>30 Übungen</span>
                <span>2 Pausen (1 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('brutal')} 
                className="difficulty-btn brutal"
              >
                <strong>Brutal</strong>
                <span>40 Übungen</span>
                <span>1 Pause (2 Min)</span>
              </button>
            </div>
          </div>
        )}

        {difficultySelected && !workoutStarted && !isPreWorkout && (
          <div className="difficulty-confirmation">
            {(() => {
              const details = getDifficultyDetails(selectedDifficulty);
              return details ? (
                <>
                  <div className="confirmation-header">
                    <h3>Herausforderung</h3>
                    <h2>{details.name}</h2>
                  </div>
                  <div className="confirmation-details">
                    <div className="detail-item">
                      <span className="detail-label">Übungen:</span>
                      <span className="detail-value">{details.exercises} zufällige Übungen</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pausen:</span>
                      <span className="detail-value">{details.pauseText}</span>
                    </div>
                  </div>
                  <div className="random-workout-hint">
                    Ein Workout mit zufälligen Übungen wird für dich zusammengestellt.
                  </div>
                  <div className="confirmation-buttons">
                    <button 
                      onClick={startWorkout} 
                      className="workout-btn start-workout-btn"
                      disabled={workoutSequence.length === 0}
                    >
                      Workout starten
                    </button>
                    <button 
                      onClick={goBackToDifficultySelection} 
                      className="workout-btn back-btn"
                    >
                      Andere Herausforderung wählen
                    </button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        )}
        
        {(workoutStarted || isPreWorkout) && (
          <div className="workout-controls">
            <button 
              onClick={toggleTimer} 
              className="workout-btn pause-btn"
            >
              {isTimerActive ? 'Pausieren' : 'Fortsetzen'}
            </button>
            <button 
              onClick={resetWorkout} 
              className="workout-btn reset-workout-btn"
            >
              Workout beenden
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;