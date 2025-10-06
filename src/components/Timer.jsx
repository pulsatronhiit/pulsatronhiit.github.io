import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ onTimeUp, autoStart, onWarningChange, onPauseToggle, isActive, isRestTime = false, isPreWorkout = false, isLongPause = false, pauseDuration = null }) => {
  // 50 seconds for exercise, 10 seconds for rest, 5 seconds for pre-workout
  const exerciseTime = 50000; // 50 seconds in milliseconds
  const restTime = 10000; // 10 seconds in milliseconds
  const preWorkoutTime = 5000; // 5 seconds in milliseconds
  
  // Helper function to parse pause duration from mm:ss format
  const parsePauseDuration = (duration) => {
    if (!duration) return 0;
    const parts = duration.split(':');
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60 + seconds) * 1000; // Convert to milliseconds
  };
  
  const [timeLeft, setTimeLeft] = useState(exerciseTime);

  // Auto-start timer when autoStart prop changes, stop when autoStart is false
  useEffect(() => {
    if (autoStart) {
      // Reset timer based on current mode (pre-workout, exercise, rest, or long pause)
      let initialTime;
      if (isPreWorkout) {
        initialTime = preWorkoutTime;
      } else if (isLongPause) {
        initialTime = parsePauseDuration(pauseDuration);
      } else if (isRestTime) {
        initialTime = restTime;
      } else {
        initialTime = exerciseTime;
      }
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(exerciseTime); // Reset to exercise time when workout is stopped
    }
  }, [autoStart, isRestTime, isPreWorkout, isLongPause, pauseDuration, exerciseTime, restTime, preWorkoutTime]);

  // Check if we're in the warning period (only during exercise, last 5 seconds)
  const isWarningTime = !isRestTime && !isPreWorkout && !isLongPause && timeLeft <= 5000 && timeLeft > 0;

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
            } else if (isLongPause) {
              return exerciseTime; // Long pause -> Exercise
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
      } else if (isLongPause) {
        newTime = exerciseTime; // Long pause -> Exercise
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
    }, [isActive, timeLeft, onTimeUp, isRestTime, isPreWorkout, isLongPause, exerciseTime, restTime]);  // Format time as MM:SS.MS
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
        isLongPause ? 'long-pause-mode' :
        isRestTime ? 'rest-mode' : 'exercise-mode'
      }`}>
        {formatTime(timeLeft)}
      </div>
      {isLongPause && (
        <div className="timer-mode-label">LÄNGERE PAUSE</div>
      )}
      {isRestTime && (
        <div className="timer-mode-label">PAUSE</div>
      )}
    </div>
  );
};

export default Timer;