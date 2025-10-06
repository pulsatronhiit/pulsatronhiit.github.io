import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ExerciseDisplay from './components/ExerciseDisplay';
import './App.css';

function App() {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
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
    const loadExercises = async () => {
      try {
        const response = await fetch('./exercises.json');
        const data = await response.json();
        setExercises(data.exercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
      }
    };
    
    loadExercises();
  }, []);

  // Function to trigger flash transition
  const triggerFlashTransition = () => {
    setIsTransitionFlash(true);
    setTimeout(() => {
      setIsTransitionFlash(false);
    }, 250); // Match the animation duration
  };

  const handleTimeUp = () => {
    if (isPreWorkout) {
      // Pre-workout countdown finished, start actual workout
      triggerFlashTransition();
      setIsPreWorkout(false);
      setWorkoutStarted(true);
      setIsTimerActive(true);
      setTimerKey(prev => prev + 1); // Reset timer for first exercise
    } else if (workoutStarted && exercises.length > 0) {
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
        if (nextIndex < exercises.length && exercises[nextIndex].type === 'pause') {
          // Next item is a pause, start long pause
          triggerFlashTransition();
          setCurrentExerciseIndex(nextIndex);
          setIsLongPause(true);
          setCurrentPauseDuration(exercises[nextIndex].duration);
          setTimerKey(prev => prev + 1); // Reset timer for pause
        } else if (nextIndex < exercises.length) {
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

  const currentExercise = (workoutStarted || isPreWorkout) && exercises.length > 0 
    ? exercises[currentExerciseIndex] 
    : null;

  const nextExercise = (workoutStarted || isPreWorkout) && exercises.length > 0 && currentExerciseIndex < exercises.length - 1
    ? exercises[currentExerciseIndex + 1] 
    : null;

  // Helper function to get the count of actual exercises (excluding pauses)
  const getExerciseCount = () => {
    return exercises.filter(item => item.type !== 'pause').length;
  };

  // Helper function to get the current exercise number (excluding pauses)
  const getCurrentExerciseNumber = () => {
    return exercises.slice(0, currentExerciseIndex + 1).filter(item => item.type !== 'pause').length;
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
        
        <ExerciseDisplay 
          exercise={currentExercise} 
          nextExercise={nextExercise}
          isLastExercise={workoutStarted && exercises.length > 0 && currentExerciseIndex === exercises.length - 1}
          isRestTime={isRestTime}
          isPreWorkout={isPreWorkout}
          isLongPause={isLongPause}
        />
        
        {!workoutStarted && !isPreWorkout && (
          <button 
            onClick={startWorkout} 
            className="workout-btn start-workout-btn"
            disabled={exercises.length === 0}
          >
            Workout starten
          </button>
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