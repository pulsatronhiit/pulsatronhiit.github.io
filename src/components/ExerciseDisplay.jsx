import React from 'react';
import './ExerciseDisplay.css';

const ExerciseDisplay = ({ exercise, nextExercise, isLastExercise, isRestTime, isPreWorkout, isLongPause }) => {
  if (isPreWorkout) {
    return (
      <div className="exercise-container pre-workout-display">
        <div className="pre-workout-info">
          <div className="pre-workout-label">Mach dich bereit</div>
          <div className="pre-workout-text">Das Workout startet gleich</div>
        </div>
        {exercise && (
          <div className="first-exercise-preview">
            <div className="next-label">Erste Übung:</div>
            <div className="next-exercise-name">{exercise.name}</div>
          </div>
        )}
      </div>
    );
  }

  // During long pause
  if (isLongPause && exercise) {
    return (
      <div className="exercise-container long-pause-display">
        <div className="long-pause-info">
          <div className="long-pause-label">⏸️ {exercise.name || 'Längere Pause'}</div>
          <div className="long-pause-text">Nutze die Zeit für Erholung und Hydration</div>
        </div>
        {nextExercise && (
          <div className="next-exercise-preview">
            <div className="next-label">Danach geht es weiter mit:</div>
            <div className="next-exercise-name">{nextExercise.name}</div>
          </div>
        )}
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="exercise-container">
        <div className="exercise-name">Dein Workout</div> 
      </div>
    );
  } 

  // During rest time, show the next exercise as the main display
  if (isRestTime && nextExercise) {
    return (
      <div className="exercise-container rest-display">
        <div className="rest-info">
          <div className="rest-label">Bereite dich vor auf:</div>
        </div>
        <div className="next-exercise-main">
          <div className="exercise-name">{nextExercise.name}</div>
          <div className="exercise-description">{nextExercise.description}</div>
        </div>
      </div>
    );
  }

  // During rest time after last exercise (shouldn't happen, but just in case)
  if (isRestTime && !nextExercise) {
    return (
      <div className="exercise-container rest-display">
        <div className="completion-preview">
          <div className="completion-label">Workout beendet</div>
          <div className="completion-text">Gut gemacht</div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-container">
      <div className="current-exercise">
        <div className="exercise-name">{exercise.name}</div>
        <div className="exercise-description">{exercise.description}</div>
      </div>
      
      {nextExercise && !isLastExercise && (
        <div className="next-exercise-minimal">
          <div className="next-label-minimal">Als nächstes: {nextExercise.name}</div>
        </div>
      )}
      
      {isLastExercise && (
        <div className="completion-preview">
          <div className="completion-label">Letzte Übung</div>
          <div className="completion-text">Das Workout wird automatisch beendet</div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;