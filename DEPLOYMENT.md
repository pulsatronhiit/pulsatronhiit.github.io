# GitHub Pages Build und Deployment (Unterordner)

Die HIIT Workout App ist konfiguriert für Deployment in einem GitHub Pages Unterordner!

## 🚀 Production Build mit Unterordner-Support

Die App ist konfiguriert für den Pfad `/hiity/` auf GitHub Pages.

**Vite Konfiguration:**
- `base: '/hiity/'` in `vite.config.js`
- Alle Asset-Pfade werden automatisch angepasst

## 📋 GitHub Pages Deployment

### Option 1: GitHub Actions (Empfohlen)

1. Push den Code in dein Repository
2. Die GitHub Action deployed automatisch in den `hiity/` Unterordner
3. Die App ist verfügbar unter: `https://yourusername.github.io/your-repo/hiity/`

### Option 2: Manueller Upload

1. Erstelle einen `hiity/` Ordner in deinem GitHub Pages Repository  
2. Kopiere alle Dateien aus `dist/` in den `hiity/` Ordner
3. Die App ist dann unter `https://yourusername.github.io/your-repo/hiity/` verfügbar

## 🔧 Pfad-Anpassungen

Falls du einen anderen Unterordner-Namen möchtest:

1. Ändere `base: '/hiity/'` in `vite.config.js` zu `base: '/dein-ordner/'`
2. Ändere `destination_dir: hiity` in `.github/workflows/deploy.yml` zu `destination_dir: dein-ordner`
3. Erstelle einen neuen Build: `npm run build`

## 🎯 URL-Struktur

- **GitHub Pages Root**: `https://yourusername.github.io/your-repo/`  
- **HIIT App**: `https://yourusername.github.io/your-repo/hiity/`
- **Andere Projekte**: `https://yourusername.github.io/your-repo/other-project/`

## ✨ Build-Features

- **Optimiert**: Code ist minifiziert und komprimiert
- **PWA-Ready**: Alle Manifest- und Icon-Dateien enthalten
- **iPhone-Optimiert**: Meta-Tags für iOS Vollbild-App
- **Single-Page-App**: Funktioniert komplett client-seitig
- **Keine Abhängigkeiten**: Benötigt nur einen Static-Server

## 🔧 Lokaler Test

Um den Build lokal zu testen:

```bash
npm run preview
```

Dies startet einen lokalen Server mit den Build-Dateien.

## 📱 PWA Installation

Nach dem Deployment kann die App:
- Am iPhone Homescreen angepinnt werden
- Im Vollbildmodus laufen
- Offline funktionieren (Service Worker wird automatisch registriert)

Der gesamte `dist/` Ordner ist deployment-ready! 🎯