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
      const nextIndex = currentExerciseIndex + 1;
      
      // Check if we've completed all exercises
      if (nextIndex >= exercises.length) {
        // End workout after last exercise
        setWorkoutStarted(false);
        setCurrentExerciseIndex(0);
        setTimerKey(prev => prev + 1); // Reset timer
      } else {
        // Move to next exercise and force timer restart
        setCurrentExerciseIndex(nextIndex);
        setTimerKey(prev => prev + 1); // Force timer component re-render with auto-start
      }
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    setIsTimerActive(true);
  };

  const resetWorkout = () => {
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setIsTimerActive(false);
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
            Übung {currentExerciseIndex + 1} von {exercises.length}
          </div>
        )}
      </header>

      <main className="app-main">
        <Timer 
          onTimeUp={handleTimeUp}
          autoStart={workoutStarted}
          onWarningChange={setIsWarningTime}
          isActive={isTimerActive}
          key={timerKey} // Force timer re-render with auto-start on exercise change
        />
        
        <ExerciseDisplay 
          exercise={currentExercise} 
          nextExercise={nextExercise}
          isLastExercise={workoutStarted && exercises.length > 0 && currentExerciseIndex === exercises.length - 1}
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