# HIIT Workout App

Eine Progressive Web App (PWA) für HIIT-Workouts, optimiert für iPhone 15 Plus als Vollbild-App.

## Features

- **Progressive Web App**: Kann am Homescreen angepinnt werden wie eine native App
- **60-Sekunden Timer**: Präziser Countdown im Format MM:SS.MS mit 10ms Genauigkeit
- **Übungssequenz**: Übungen werden aus einer JSON-Datei geladen und in Reihenfolge abgespielt
- **iPhone 15 Plus optimiert**: Speziell für 393x852px Vollbilddarstellung entwickelt
- **Automatischer Übungswechsel**: Timer startet automatisch neu bei jeder neuen Übung
- **Touch-optimiert**: Große Buttons und benutzerfreundliche Oberfläche

## Technologie-Stack

- **Frontend**: React 18 mit Hooks
- **Build-Tool**: Vite
- **Styling**: Vanilla CSS mit responsivem Design
- **PWA**: Web App Manifest für Homescreen-Installation

## Installation und Start

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. App im Browser öffnen: `http://localhost:5173`

## Produktions-Build

```bash
npm run build
```

Die fertige App wird im `dist/` Ordner erstellt.

## Übungen anpassen

Die Übungen können in der Datei `public/exercises.json` angepasst werden:

```json
{
  "exercises": [
    {
      "name": "Übungsname",
      "description": "Beschreibung der Übung"
    }
  ]
}
```

## iPhone Installation

1. Öffne die App im Safari-Browser auf deinem iPhone
2. Tippe auf das "Teilen"-Symbol (Quadrat mit Pfeil nach oben)
3. Scrolle runter und tippe auf "Zum Home-Bildschirm"
4. Bestätige mit "Hinzufügen"

Die App startet dann im Vollbildmodus ohne Browser-UI.

## App-Struktur

```
src/
├── components/
│   ├── Timer.jsx          # Timer-Komponente mit MM:SS.MS Format
│   ├── Timer.css          # Timer Styling
│   ├── ExerciseDisplay.jsx # Übungsanzeige-Komponente
│   └── ExerciseDisplay.css # Übungsanzeige Styling
├── App.jsx               # Haupt-App-Komponente
├── App.css              # App-weites Styling
├── main.jsx             # React Entry Point
└── index.css            # Basis-Styling

public/
├── exercises.json       # Übungsdefinitionen
├── manifest.json       # PWA Manifest
├── icon-192x192.svg    # App Icon (klein)
└── icon-512x512.svg    # App Icon (groß)
```

## Timer-Funktionalität

- **Format**: MM:SS.MS (Minuten:Sekunden.Millisekunden)
- **Dauer**: 60 Sekunden pro Übung
- **Genauigkeit**: 10ms Updates für flüssige Anzeige
- **Auto-Reset**: Automatischer Neustart bei Übungswechsel
- **Steuerung**: Start, Pause, Reset Buttons

## Responsive Design

- **iPhone 15 Plus**: 393x852px optimiert
- **Vollbild**: Nutzt 100vh/100dvh für echtes Vollbild
- **Touch-freundlich**: Große Buttons und optimierte Abstände
- **Kein Scrollen**: Feste Layouthöhe verhindert ungewolltes Scrollen

## Browser-Kompatibilität

- **Safari (iOS)**: Vollständig unterstützt
- **Chrome (Desktop/Mobile)**: Vollständig unterstützt  
- **Firefox**: Vollständig unterstützt
- **Edge**: Vollständig unterstützt

## Entwicklung

Die App verwendet moderne React Patterns:
- Funktionale Komponenten mit Hooks
- useState für lokales State-Management
- useEffect für Timer-Logic und API-Calls
- Responsive CSS mit clamp() für skalierbare Schriften