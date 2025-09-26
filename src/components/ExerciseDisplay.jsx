import React from 'react';
import './ExerciseDisplay.css';

const ExerciseDisplay = ({ exercise, nextExercise, isLastExercise }) => {
  if (!exercise) {
    return (
      <div className="exercise-container">
        <div className="exercise-name">Bereit für das Workout?</div>
        <div className="exercise-description">Drücke Start, um zu beginnen!</div>
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