import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ onTimeUp, autoStart, onWarningChange, onPauseToggle, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(60000); // 60 seconds in milliseconds

  // Auto-start timer when autoStart prop changes, stop when autoStart is false
  useEffect(() => {
    if (autoStart) {
      // setIsActive is now controlled by parent
    } else {
      setTimeLeft(60000); // Reset timer when workout is stopped
    }
  }, [autoStart]);

  // Check if we're in the warning period (last 3 seconds)
  const isWarningTime = timeLeft <= 3000 && timeLeft > 0;

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
            return 60000; // Reset to 60 seconds
          }
          return timeLeft - 10; // Decrease by 10ms for smooth countdown
        });
      }, 10);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onTimeUp();
      setTimeLeft(60000); // Reset to 60 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);

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
      <div className={`timer-display ${isWarningTime ? 'warning' : ''}`}>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default Timer;