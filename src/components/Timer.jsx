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
  
  // Track previous time to detect second changes for beep countdown
  const [prevTimeInSeconds, setPrevTimeInSeconds] = useState(0);

  // Notify parent component about warning state changes and play countdown beeps
  useEffect(() => {
    if (onWarningChange) {
      onWarningChange(isWarningTime);
    }
    
    // Play countdown beep for each second in the last 5 seconds
    if (isWarningTime) {
      const currentSeconds = Math.ceil(timeLeft / 1000); // Current seconds remaining (rounded up)
      
      // Play beep when we cross into a new second (5, 4, 3, 2, 1)
      if (currentSeconds <= 5 && currentSeconds !== prevTimeInSeconds && currentSeconds > 0) {
        // Create and play countdown beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set frequency - higher pitch for final second
        const frequency = currentSeconds === 1 ? 1000 : 800; // 1000Hz for last second, 800Hz for others
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // 30% volume
        
        // Play a short beep
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15); // 150ms beep
        
        setPrevTimeInSeconds(currentSeconds);
      }
    } else {
      // Reset previous time when not in warning period
      setPrevTimeInSeconds(0);
    }
  }, [isWarningTime, timeLeft, onWarningChange, prevTimeInSeconds]);

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
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    // Show milliseconds only in the last 3 seconds
    if (time <= 5000) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
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