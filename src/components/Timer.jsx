import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ onTimeUp, autoStart, onWarningChange, onPauseToggle, isActive, isRestTime = false, isPreWorkout = false }) => {
  // 50 seconds for exercise, 10 seconds for rest, 5 seconds for pre-workout
  const exerciseTime = 50000; // 50 seconds in milliseconds
  const restTime = 10000; // 10 seconds in milliseconds
  const preWorkoutTime = 5000; // 5 seconds in milliseconds
  
  const [timeLeft, setTimeLeft] = useState(exerciseTime);

  // Auto-start timer when autoStart prop changes, stop when autoStart is false
  useEffect(() => {
    if (autoStart) {
      // Reset timer based on current mode (pre-workout, exercise, or rest)
      let initialTime;
      if (isPreWorkout) {
        initialTime = preWorkoutTime;
      } else if (isRestTime) {
        initialTime = restTime;
      } else {
        initialTime = exerciseTime;
      }
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(exerciseTime); // Reset to exercise time when workout is stopped
    }
  }, [autoStart, isRestTime, isPreWorkout, exerciseTime, restTime, preWorkoutTime]);

  // Check if we're in the warning period (only during exercise, last 5 seconds)
  const isWarningTime = !isRestTime && !isPreWorkout && timeLeft <= 5000 && timeLeft > 0;

  // Notify parent component about warning state changes
  useEffect(() => {
    if (onWarningChange) {
      onWarningChange(isWarningTime);
    }
  }, [isWarningTime, onWarningChange]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 10) {
            onTimeUp();
            // Reset to appropriate time based on next mode
            if (isPreWorkout) {
              return exerciseTime; // Pre-workout -> Exercise
            } else if (isRestTime) {
              return exerciseTime; // Rest -> Exercise
            } else {
              return restTime; // Exercise -> Rest
            }
          }
          return timeLeft - 10; // Decrease by 10ms for smooth countdown
        });
      }, 10);
    } else if (timeLeft === 0) {
      onTimeUp();
      let newTime;
      if (isPreWorkout) {
        newTime = exerciseTime; // Pre-workout -> Exercise
      } else if (isRestTime) {
        newTime = exerciseTime; // Rest -> Exercise
      } else {
        newTime = restTime; // Exercise -> Rest
      }
      setTimeLeft(newTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp, isRestTime, isPreWorkout, exerciseTime, restTime]);

  // Format time as MM:SS.MS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <div className={`timer-display ${isWarningTime ? 'warning' : ''} ${
        isPreWorkout ? 'pre-workout-mode' : 
        isRestTime ? 'rest-mode' : 'exercise-mode'
      }`}>
        {formatTime(timeLeft)}
      </div>
      {isPreWorkout && (
        <div className="timer-mode-label">BEREIT MACHEN</div>
      )}
      {isRestTime && (
        <div className="timer-mode-label">PAUSE</div>
      )}
    </div>
  );
};

export default Timer;