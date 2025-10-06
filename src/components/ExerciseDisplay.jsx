import React from 'react';
import './ExerciseDisplay.css';

const ExerciseDisplay = ({ exercise, nextExercise, isLastExercise, isRestTime }) => {
  if (!exercise) {
    return (
      <div className="exercise-container">
        <div className="exercise-name">Bereit für das Workout?</div>
        <div className="exercise-description">Drücke Start, um zu beginnen!</div>
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
          <div className="completion-label">🎉 Workout beendet!</div>
          <div className="completion-text">Gut gemacht!</div>
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
        <div className="next-exercise-preview">
          <div className="next-label">Als nächstes:</div>
          <div className="next-exercise-name">{nextExercise.name}</div>
          <div className="next-exercise-description">{nextExercise.description}</div>
        </div>
      )}
      
      {isLastExercise && (
        <div className="completion-preview">
          <div className="completion-label">🎉 Letzte Übung!</div>
          <div className="completion-text">Das Workout wird automatisch beendet</div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;