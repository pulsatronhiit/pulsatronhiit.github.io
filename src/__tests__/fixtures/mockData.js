// Test fixtures for exercises data
export const mockExercises = {
  "sidestep-squats": {
    "id": "sidestep-squats",
    "name": "Sidestep Squats",
    "description": "Stehe aufrecht, mache einen Schritt zur Seite und gehe dabei in die Squat-Position runter"
  },
  "burpees": {
    "id": "burpees", 
    "name": "Burpees",
    "description": "Gehe in die Hocke, springe in den Liegestütz, zurück zur Hocke und springe hoch"
  },
  "one-arm-kb-swing": {
    "id": "one-arm-kb-swing",
    "name": "One-arm KB Swing", 
    "description": "Schwinge die Kettlebell einarmig kraftvoll zwischen den Beinen hoch"
  },
  "mountain-climbers": {
    "id": "mountain-climbers",
    "name": "Mountain Climbers",
    "description": "Alterniere schnell die Knie zur Brust in Liegestütz-Position"
  },
  "kb-lateral-swing-snatch-group": {
    "type": "group",
    "left": {
      "id": "kb-lateral-swing-snatch-left",
      "name": "KB lateral Swing to Snatch links",
      "description": "Schwinge die Kettlebell seitlich vom Körper weg nach außen"
    },
    "right": {
      "id": "kb-lateral-swing-snatch-right", 
      "name": "KB lateral Swing to Snatch rechts",
      "description": "Schwinge die Kettlebell seitlich vom Körper weg nach außen"
    }
  },
  "kb-lateral-swing-windmill": {
    "type": "group",
    "left": {
      "id": "kb-lateral-swing-windmill-left",
      "name": "KB lateral Swing to Windmill-Press links",
      "description": "Schwinge die Kettlebell seitlich vom Körper weg nach außen"
    },
    "right": {
      "id": "kb-lateral-swing-windmill-right",
      "name": "KB lateral Swing to Windmill-Press rechts", 
      "description": "Schwinge die Kettlebell seitlich vom Körper weg nach außen"
    }
  }
};

export const mockWorkoutConfigs = {
  leicht: {
    name: 'Leicht',
    totalExercises: 6,
    pauseCount: 1,
    pauseDuration: '01:00'
  },
  moderat: {
    name: 'Moderat',
    totalExercises: 8,
    pauseCount: 2,
    pauseDuration: '02:00'
  },
  anstrengend: {
    name: 'Anstrengend',
    totalExercises: 10,
    pauseCount: 1,
    pauseDuration: '01:00'
  },
  brutal: {
    name: 'Brutal',
    totalExercises: 12,
    pauseCount: 2,
    pauseDuration: '02:00'
  }
};

export const mockCustomConfig = {
  totalExercises: 8,
  pauseCount: 1,
  pauseDuration: '01:30'
};