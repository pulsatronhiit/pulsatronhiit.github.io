import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ExerciseDisplay from './components/ExerciseDisplay';
import './App.css';

function App() {
  const [exercises, setExercises] = useState({});
  const [workoutSequence, setWorkoutSequence] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [timerKey, setTimerKey] = useState(0); // Force timer re-render
  const [isWarningTime, setIsWarningTime] = useState(false); // Track warning state
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer control
  const [isRestTime, setIsRestTime] = useState(false); // Track if we're in rest period
  const [isPreWorkout, setIsPreWorkout] = useState(false); // Track pre-workout countdown
  const [isLongPause, setIsLongPause] = useState(false); // Track if we're in a long pause
  const [currentPauseDuration, setCurrentPauseDuration] = useState(null); // Store current pause duration
  const [isTransitionFlash, setIsTransitionFlash] = useState(false); // Track flash transition
  const [showCustomConfig, setShowCustomConfig] = useState(false); // Track custom config screen
  const [customConfig, setCustomConfig] = useState({
    totalExercises: 20,
    pauseCount: 2,
    pauseDuration: '02:00'
  }); // Custom workout configuration

  // Load exercises from JSON file
  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        // Load exercises library
        const exercisesResponse = await fetch('./exercises.json');
        const exercisesData = await exercisesResponse.json();
        setExercises(exercisesData.exercises);
      } catch (error) {
        console.error('Error loading workout data:', error);
      }
    };
    
    loadWorkoutData();
  }, []); 

  // Function to trigger flash transition
  const triggerFlashTransition = () => {
    setIsTransitionFlash(true);
    setTimeout(() => {
      setIsTransitionFlash(false);
    }, 250); // Match the animation duration
  };

  // Workout difficulty configurations
  const workoutConfigs = {
    leicht: {
      name: 'Leicht',
      totalExercises: 15,
      pauseCount: 2,
      pauseDuration: '01:00'
    },
    moderat: {
      name: 'Moderat',
      totalExercises: 20,
      pauseCount: 1,
      pauseDuration: '02:00'
    },
    anstrengend: {
      name: 'Anstrengend',
      totalExercises: 30, 
      pauseCount: 2,
      pauseDuration: '01:00'
    },
    brutal: {
      name: 'Brutal',
      totalExercises: 40,
      pauseCount: 1,
      pauseDuration: '02:00'
    },
    individuell: {
      name: 'Individuell',
      totalExercises: 20,
      pauseCount: 2,
      pauseDuration: '02:00'
    }
  };

  // Generate random workout based on difficulty or custom config
  const generateWorkout = (difficulty) => {
    const config = difficulty === 'individuell' ? customConfig : workoutConfigs[difficulty];
    const exerciseIds = Object.keys(exercises);
    const sequence = [];

    // Calculate pause positions - distribute evenly
    const pausePositions = [];
    if (config.pauseCount > 0) {
      const interval = Math.floor(config.totalExercises / (config.pauseCount + 1));
      for (let i = 1; i <= config.pauseCount; i++) {
        const position = interval * i;
        if (position < config.totalExercises) {
          pausePositions.push(position);
        }
      }
    }

    // Generate random exercise sequence
    for (let i = 0; i < config.totalExercises; i++) {
      // Add random exercise
      const randomExerciseId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)];
      sequence.push({
        type: 'exercise',
        exerciseId: randomExerciseId
      });

      // Add pause if this is a pause position
      if (pausePositions.includes(i + 1) && i + 1 < config.totalExercises) {
        sequence.push({
          type: 'pause',
          duration: config.pauseDuration
        });
      }
    }

    return sequence;
  };

  // Handle difficulty selection
  const selectDifficulty = (difficulty) => {
    if (difficulty === 'individuell') {
      setShowCustomConfig(true);
      setSelectedDifficulty(difficulty);
      return;
    }
    
    const sequence = generateWorkout(difficulty);
    setWorkoutSequence(sequence);
    setSelectedDifficulty(difficulty);
    setDifficultySelected(true);
  };

  // Handle custom configuration submission
  const submitCustomConfig = () => {
    const sequence = generateWorkout('individuell');
    setWorkoutSequence(sequence);
    setShowCustomConfig(false);
    setDifficultySelected(true);
  };

  // Convert minutes:seconds format to total seconds for calculations
  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Convert seconds back to MM:SS format
  const secondsToTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate total workout duration
  const calculateWorkoutDuration = (config) => {
    
    // Exercise time: 50 seconds per exercise
    const exerciseTime = config.totalExercises * 60;    
    
    // Pause time: convert pause duration to seconds and multiply by pause count
    const pauseTime = config.pauseCount * timeToSeconds(config.pauseDuration);
    
    // Total time in seconds
    const totalSeconds = exerciseTime + pauseTime;
    
    // Round to nearest minute
    const totalMinutes = Math.round(totalSeconds / 60);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (minutes === 0) {
        return `ca. ${hours} Std.`;
      } else {
        return `ca. ${hours} Std. ${minutes} min`;
      }
    } else {
      return `ca. ${totalMinutes} min`;
    }
  };

  // Update custom config values
  const updateCustomConfig = (field, value) => {
    setCustomConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Go back to difficulty selection
  const goBackToDifficultySelection = () => {
    setDifficultySelected(false);
    setShowCustomConfig(false);
    setSelectedDifficulty(null);
    setWorkoutSequence([]);
  };

  // Get difficulty details for display
  const getDifficultyDetails = (difficulty) => {
    if (!difficulty) return null;
    
    const config = difficulty === 'individuell' ? customConfig : workoutConfigs[difficulty];
    if (!config) return null;
    
    const pauseText = config.pauseCount > 0 
      ? `${config.pauseCount} Pause${config.pauseCount > 1 ? 'n' : ''} (${config.pauseDuration} Min)`
      : 'Keine Pausen';

    const totalDuration = calculateWorkoutDuration(config);

    return {
      name: difficulty === 'individuell' ? 'Individuell' : config.name,
      exercises: config.totalExercises,
      pauseText: pauseText,
      duration: totalDuration
    };
  };

  const handleTimeUp = () => {
    if (isPreWorkout) {
      // Pre-workout countdown finished, start actual workout
      triggerFlashTransition();
      setIsPreWorkout(false);
      setWorkoutStarted(true);
      setIsTimerActive(true);
      setTimerKey(prev => prev + 1); // Reset timer for first exercise
    } else if (workoutStarted && workoutSequence.length > 0) {
      if (isLongPause) {
        // Long pause finished, move to next exercise
        triggerFlashTransition();
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setIsLongPause(false);
        setCurrentPauseDuration(null);
        setTimerKey(prev => prev + 1); // Reset timer for next exercise
      } else if (!isRestTime) {
        // Exercise finished, check if next item is a pause or move to rest
        const nextIndex = currentExerciseIndex + 1;
        if (nextIndex < workoutSequence.length && workoutSequence[nextIndex].type === 'pause') {
          // Next item is a pause, start long pause
          triggerFlashTransition();
          setCurrentExerciseIndex(nextIndex);
          setIsLongPause(true);
          setCurrentPauseDuration(workoutSequence[nextIndex].duration);
          setTimerKey(prev => prev + 1); // Reset timer for pause
        } else if (nextIndex < workoutSequence.length) {
          // Next item is an exercise, start rest period
          triggerFlashTransition();
          setIsRestTime(true);
          setTimerKey(prev => prev + 1); // Reset timer for rest period
        } else {
          // Last exercise finished, end workout
          setWorkoutStarted(false);
          setCurrentExerciseIndex(0);
          setIsRestTime(false);
          setIsLongPause(false);
          setIsPreWorkout(false);
          setCurrentPauseDuration(null);
          setTimerKey(prev => prev + 1);
        }
      } else {
        // Rest period finished, move to next exercise
        triggerFlashTransition();
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setIsRestTime(false);
        setTimerKey(prev => prev + 1); // Reset timer for next exercise
      }
    }
  };

  const startWorkout = () => {
    setIsPreWorkout(true);
    setWorkoutStarted(false); // Don't start workout yet
    setCurrentExerciseIndex(0);
    setIsTimerActive(true);
    setIsRestTime(false);
    setTimerKey(prev => prev + 1); // Start pre-workout countdown
  };

  const resetWorkout = () => {
    triggerFlashTransition();
    setWorkoutStarted(false);
    setDifficultySelected(false);
    setShowCustomConfig(false);
    setSelectedDifficulty(null);
    setWorkoutSequence([]);
    setCurrentExerciseIndex(0);
    setIsTimerActive(false);
    setIsRestTime(false);
    setIsPreWorkout(false);
    setIsLongPause(false);
    setCurrentPauseDuration(null);
    setTimerKey(prev => prev + 1); // Force timer reset when workout ends
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  // Helper function to get exercise data by sequence item
  const getExerciseFromSequence = (sequenceItem) => {
    if (!sequenceItem) return null;
    if (sequenceItem.type === 'pause') {
      return {
        type: 'pause',
        name: 'Längere Pause', // Always use "Längere Pause" for any pause
        duration: sequenceItem.duration
      };
    }
    return exercises[sequenceItem.exerciseId] || null;
  };

  const currentExercise = (workoutStarted || isPreWorkout) && workoutSequence.length > 0 
    ? getExerciseFromSequence(workoutSequence[currentExerciseIndex])
    : null;

  const nextExercise = (workoutStarted || isPreWorkout) && workoutSequence.length > 0 && currentExerciseIndex < workoutSequence.length - 1
    ? getExerciseFromSequence(workoutSequence[currentExerciseIndex + 1])
    : null;

  // Helper function to get the count of actual exercises (excluding pauses)
  const getExerciseCount = () => {
    return workoutSequence.filter(item => item.type !== 'pause').length;
  };

  // Helper function to get the current exercise number (excluding pauses)
  const getCurrentExerciseNumber = () => {
    return workoutSequence.slice(0, currentExerciseIndex + 1).filter(item => item.type !== 'pause').length;
  };

  return (
    <div className={`app ${isWarningTime ? 'warning-active' : ''} ${isTransitionFlash ? 'transition-flash' : ''}`}>
      <header className="app-header">
        {!workoutStarted && !isPreWorkout && !difficultySelected && !showCustomConfig && (
          <div className="brand-header">
            <h1 className="brand-title">IronHIIT</h1>
            <p className="brand-slogan">Baremetal Training.</p>
          </div>
        )}
        {workoutStarted && (
          <div className="workout-progress">
            {isLongPause
              ? `Längere Pause - ${currentExercise?.name || 'Pause'}`
              : isRestTime 
                ? `Pause nach Übung ${getCurrentExerciseNumber()} von ${getExerciseCount()}`
                : `Übung ${getCurrentExerciseNumber()} von ${getExerciseCount()}`
            }
          </div>
        )}
      </header>


      <main className="app-main">
        {(workoutStarted || isPreWorkout) && (
          <Timer 
            onTimeUp={handleTimeUp}
            autoStart={workoutStarted || isPreWorkout}
            onWarningChange={setIsWarningTime}
            isActive={isTimerActive}
            isRestTime={isRestTime}
            isPreWorkout={isPreWorkout}
            isLongPause={isLongPause}
            pauseDuration={currentPauseDuration}
            key={timerKey} // Force timer re-render with auto-start on exercise change
          />
        )}
        
        {difficultySelected && (
          <ExerciseDisplay 
            exercise={currentExercise} 
            nextExercise={nextExercise}
            isLastExercise={workoutStarted && workoutSequence.length > 0 && currentExerciseIndex === workoutSequence.length - 1}
            isRestTime={isRestTime}
            isPreWorkout={isPreWorkout}
            isLongPause={isLongPause}
          />
        )}
        
        {!difficultySelected && !showCustomConfig && (
          <div className="difficulty-selection">
            <h2>Wähle deine Herausforderung</h2>
            <div className="difficulty-buttons">
              <button 
                onClick={() => selectDifficulty('leicht')} 
                className="difficulty-btn easy"
              >
                <strong>Leicht</strong>
                <span>15 Übungen, 2 Pausen (1 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('moderat')} 
                className="difficulty-btn moderate"
              >
                <strong>Moderat</strong>
                <span>20 Übungen, 1 Pause (2 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('anstrengend')} 
                className="difficulty-btn hard"
              >
                <strong>Anstrengend</strong>
                <span>30 Übungen, 2 Pausen (1 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('brutal')} 
                className="difficulty-btn brutal"
              >
                <strong>Brutal</strong>
                <span>40 Übungen, 1 Pause (2 Min)</span>
              </button>
              <button 
                onClick={() => selectDifficulty('individuell')} 
                className="difficulty-btn custom"
              >
                <strong>Individuell</strong>
                <span>Erstelle dein eigenes Workout</span>
              </button>
            </div>
          </div>
        )}

        {showCustomConfig && (
          <div className="custom-config">
            <div className="config-header">
              <h2>Individuelles Workout</h2>
              <p>Stelle dein eigenes Workout zusammen</p>
            </div>

            <div className="config-section">
              <label>Anzahl Übungen: {customConfig.totalExercises}</label>
              <input
                type="range"
                min="5"
                max="60"
                value={customConfig.totalExercises}
                onChange={(e) => updateCustomConfig('totalExercises', parseInt(e.target.value))}
                className="config-slider"
              />
              <div className="range-labels">
                <span>5</span>
                <span>60</span>
              </div>
            </div>

            <div className="config-section">
              <label>Anzahl Pausen: {customConfig.pauseCount}</label>
              <input
                type="range"
                min="0"
                max="10"
                value={customConfig.pauseCount}
                onChange={(e) => updateCustomConfig('pauseCount', parseInt(e.target.value))}
                className="config-slider"
              />
              <div className="range-labels">
                <span>0</span>
                <span>10</span>
              </div>
            </div>

            <div className="config-section">
              <label>Pausendauer: {customConfig.pauseDuration} Min</label>
              <input
                type="range"
                min="30"
                max="300"
                step="30"
                value={timeToSeconds(customConfig.pauseDuration)}
                onChange={(e) => updateCustomConfig('pauseDuration', secondsToTime(parseInt(e.target.value)))}
                className="config-slider"
              />
              <div className="range-labels">
                <span>0:30</span>
                <span>5:00</span>
              </div>
            </div>

            <div className="config-summary">
              <h3>Workout Zusammenfassung</h3>
              <div className="summary-item">
                <span>Übungen:</span>
                <span>{customConfig.totalExercises} zufällige Übungen</span>
              </div>
              <div className="summary-item">
                <span>Pausen:</span>
                <span>
                  {customConfig.pauseCount === 0 
                    ? 'Keine Pausen' 
                    : `${customConfig.pauseCount} Pause${customConfig.pauseCount > 1 ? 'n' : ''} (${customConfig.pauseDuration} Min)`
                  }
                </span>
              </div>
              <div className="summary-item">
                <span>Gesamtdauer:</span>
                <span>{calculateWorkoutDuration(customConfig)}</span>
              </div>
            </div>

            <div className="config-buttons">
              <button 
                onClick={submitCustomConfig} 
                className="workout-btn start-custom-btn"
              >
                Workout erstellen
              </button>
              <button 
                onClick={goBackToDifficultySelection} 
                className="workout-btn back-btn"
              >
                Zurück zur Auswahl
              </button>
            </div>
          </div>
        )}

        {difficultySelected && !showCustomConfig && !workoutStarted && !isPreWorkout && (
          <div className="difficulty-confirmation">
            {(() => {
              const details = getDifficultyDetails(selectedDifficulty);
              return details ? (
                <>
                  <div className="confirmation-header">
                    <h3>Herausforderung</h3>
                    <h2>{details.name}</h2>
                  </div>
                  <div className="confirmation-details">
                    <div className="detail-item">
                      <span className="detail-label">Übungen:</span>
                      <span className="detail-value">{details.exercises} zufällige Übungen</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pausen:</span>
                      <span className="detail-value">{details.pauseText}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gesamtdauer:</span>
                      <span className="detail-value">{details.duration}</span>
                    </div>
                  </div>
                  <div className="random-workout-hint">
                    Ein Workout mit zufälligen Übungen wird für dich zusammengestellt.
                  </div>
                  <div className="confirmation-buttons">
                    <button 
                      onClick={startWorkout} 
                      className="workout-btn start-workout-btn"
                      disabled={workoutSequence.length === 0}
                    >
                      Workout starten
                    </button>
                    <button 
                      onClick={goBackToDifficultySelection} 
                      className="workout-btn back-btn"
                    >
                      Andere Herausforderung wählen
                    </button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        )}
        
        {(workoutStarted || isPreWorkout) && (
          <div className="confirmation-buttons workout-control-buttons">
            <button 
              onClick={toggleTimer} 
              className="workout-btn start-workout-btn workout-control-btn"
            >
              {isTimerActive ? 'Pausieren' : 'Fortsetzen'}
            </button>
            <button 
              onClick={resetWorkout} 
              className="workout-btn back-btn workout-control-btn"
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