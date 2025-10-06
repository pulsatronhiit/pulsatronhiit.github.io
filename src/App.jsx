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

  const handleTimeUp = () => {
    if (workoutStarted && exercises.length > 0) {
      if (!isRestTime) {
        // Exercise finished, start rest period
        if (currentExerciseIndex < exercises.length - 1) {
          // Not the last exercise, start rest period
          setIsRestTime(true);
          setTimerKey(prev => prev + 1); // Reset timer for rest period
        } else {
          // Last exercise finished, end workout
          setWorkoutStarted(false);
          setCurrentExerciseIndex(0);
          setIsRestTime(false);
          setTimerKey(prev => prev + 1);
        }
      } else {
        // Rest period finished, move to next exercise
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setIsRestTime(false);
        setTimerKey(prev => prev + 1); // Reset timer for next exercise
      }
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    setIsTimerActive(true);
    setIsRestTime(false);
  };

  const resetWorkout = () => {
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setIsTimerActive(false);
    setIsRestTime(false);
    setTimerKey(prev => prev + 1); // Force timer reset when workout ends
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const currentExercise = workoutStarted && exercises.length > 0 
    ? exercises[currentExerciseIndex] 
    : null;

  const nextExercise = workoutStarted && exercises.length > 0 && currentExerciseIndex < exercises.length - 1
    ? exercises[currentExerciseIndex + 1] 
    : null;

  return (
    <div className={`app ${isWarningTime ? 'warning-active' : ''}`}>
      <header className="app-header">
        {workoutStarted && (
          <div className="workout-progress">
            {isRestTime 
              ? `Pause nach Übung ${currentExerciseIndex + 1} von ${exercises.length}`
              : `Übung ${currentExerciseIndex + 1} von ${exercises.length}`
            }
          </div>
        )}
      </header>

      <main className="app-main">
        <Timer 
          onTimeUp={handleTimeUp}
          autoStart={workoutStarted}
          onWarningChange={setIsWarningTime}
          isActive={isTimerActive}
          isRestTime={isRestTime}
          key={timerKey} // Force timer re-render with auto-start on exercise change
        />
        
        <ExerciseDisplay 
          exercise={currentExercise} 
          nextExercise={nextExercise}
          isLastExercise={workoutStarted && exercises.length > 0 && currentExerciseIndex === exercises.length - 1}
          isRestTime={isRestTime}
        />
        
        {!workoutStarted && (
          <button 
            onClick={startWorkout} 
            className="workout-btn start-workout-btn"
            disabled={exercises.length === 0}
          >
            Workout starten
          </button>
        )}
        
        {workoutStarted && (
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