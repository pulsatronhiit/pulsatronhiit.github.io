import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ onTimeUp, autoStart, onWarningChange, onPauseToggle, isActive, isRestTime = false }) => {
  // 50 seconds for exercise, 10 seconds for rest
  const exerciseTime = 50000; // 50 seconds in milliseconds
  const restTime = 10000; // 10 seconds in milliseconds
  
  const [timeLeft, setTimeLeft] = useState(exerciseTime);

  // Auto-start timer when autoStart prop changes, stop when autoStart is false
  useEffect(() => {
    if (autoStart) {
      // Reset timer based on current mode (exercise or rest)
      const initialTime = isRestTime ? restTime : exerciseTime;
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(exerciseTime); // Reset to exercise time when workout is stopped
    }
  }, [autoStart, isRestTime, exerciseTime, restTime]);

  // Check if we're in the warning period (only during exercise, last 10 seconds)
  const isWarningTime = !isRestTime && timeLeft <= 5000 && timeLeft > 0;

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
            return isRestTime ? exerciseTime : restTime;
          }
          return timeLeft - 10; // Decrease by 10ms for smooth countdown
        });
      }, 10);
    } else if (timeLeft === 0) {
      onTimeUp();
      const newTime = isRestTime ? exerciseTime : restTime;
      setTimeLeft(newTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp, isRestTime, exerciseTime, restTime]);

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
      <div className={`timer-display ${isWarningTime ? 'warning' : ''} ${isRestTime ? 'rest-mode' : 'exercise-mode'}`}>
        {formatTime(timeLeft)}
      </div>
      {isRestTime && (
        <div className="timer-mode-label">PAUSE</div>
      )}
    </div>
  );
};

export default Timer;