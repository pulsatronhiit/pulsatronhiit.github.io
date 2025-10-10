# PulsatronHIIT - Baremetal Training

HIIT Kettlebell Training with full data protection. No tracking, no cookies, no personal data collection. GDPR compliant by design.

**Baremetal Training. Minimal Data. Maximum Results.**

## Features

- **Progressive Web App**: Kann am Homescreen angepinnt werden wie eine native App
- **Intelligente Workout-Generierung**: Zufällige Workouts basierend auf Schwierigkeitsgrad
- **Timer-System**: 5s Vorbereitung, 50s Übung, 10s Pause + konfigurierbare längere Pausen

## Deployment

**Live-Zugang:**
- **HIIT App**: `https://pulsatronhiit.github.io/app/`

**Automatisches GitHub Pages Deployment** bei jedem Push auf main/master Branch.

## Technologie-Stack

- **Frontend**: React 18 mit funktionalen Komponenten und Hooks
- **Build-Tool**: Vite 5.4.20 mit GitHub Pages Konfiguration
- **Styling**: Vanilla CSS

## Installation und Entwicklung

### Lokale Entwicklung

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. App im Browser öffnen: `http://localhost:5173`

### Produktions-Build

```bash
npm run build
```

Die fertige App wird in `dist/app/` erstellt.


## Übungen anpassen

Die Übungen sind in `public/exercises.json` definiert:

```json
{
  "exercises": {
    "exercise-id": {
      "id": "exercise-id",
      "name": "Übungsname", 
      "description": "Detaillierte Beschreibung"
    },
    "grouped-exercise": {
      "type": "group",
      "left": {
        "id": "exercise-left",
        "name": "Übung links",
        "description": "..."
      },
      "right": {
        "id": "exercise-right", 
        "name": "Übung rechts",
        "description": "..."
      }
    }
  }
}
```


## App-Struktur

```
src/
├── components/
│   ├── Timer.jsx          # Multi-Phase Timer (Vorbereitung, Übung, Pause)
│   ├── Timer.css          # Timer Styling mit Flash-Transitions
│   ├── ExerciseDisplay.jsx # Intelligente Übungsanzeige
│   └── ExerciseDisplay.css # Übungsanzeige Styling
├── App.jsx               # Haupt-App mit Workout-Orchestrierung
├── App.css              # PulsatronHIIT Branding und Vollbild-Layout
├── main.jsx             # React Entry Point
└── index.css            # Basis-Styling

public/
├── exercises.json       # Übungsdefinitionen (24+ Kettlebell-Übungen)
├── manifest.json       # PWA Manifest für /app/ Pfad
├── icon-192x192.svg    # App Icon (klein)
└── icon-512x512.svg    # App Icon (groß)

.github/workflows/
└── deploy.yml          # GitHub Actions Deployment
```


## Beitragen

1. Repository forken
2. Feature Branch erstellen (`git checkout -b feature/awesome-feature`)
3. Änderungen committen (`git commit -m 'Add awesome feature'`)
4. Branch pushen (`git push origin feature/awesome-feature`)
5. Pull Request erstellen

## Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

