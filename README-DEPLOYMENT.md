# IronHIIT - GitHub Pages Deployment

## Deployment Setup

Diese App ist für GitHub Pages konfiguriert und wird automatisch deployed:

- **Landing Page**: `https://ironhiit.github.io/`
- **HIIT App**: `https://ironhiit.github.io/app/`

### Automatisches Deployment

1. **Push auf main/master Branch** triggert automatisches Deployment
2. **GitHub Actions Workflow** erstellt:
   - Die HIIT React App unter `/app/`
   - Eine Dummy Landing Page unter `/`

### GitHub Pages Setup

1. Gehe zu Repository Settings → Pages
2. Source: **GitHub Actions** auswählen
3. Der Workflow `.github/workflows/deploy.yml` übernimmt den Rest

### Lokale Entwicklung

```bash
# Development Server (localhost:5173)
npm run dev

# Production Build Test
npm run build
npx serve dist/app -s
```

### Projekt Struktur

```
dist/
├── index.html          # Landing Page (ironhiit.github.io)
└── app/               # HIIT App (ironhiit.github.io/app)
    ├── index.html
    ├── assets/
    └── manifest.json
```

### Konfiguration

- **Vite Config**: `base: '/app/'` für GitHub Pages
- **PWA Manifest**: `start_url: '/app/'` und `scope: '/app/'`
- **Build Output**: `dist/app/` für die React App

### Features

- ✅ Progressive Web App (PWA)
- ✅ Automatisches Deployment via GitHub Actions
- ✅ iPhone 15 Plus optimiert
- ✅ Dummy Landing Page
- ✅ Korrekte Pfad-Konfiguration für GitHub Pages

### Nächste Schritte

1. Repository zu GitHub pushen
2. GitHub Pages in Repository Settings aktivieren
3. Automatisches Deployment läuft bei jedem Push

Die App wird dann unter `https://ironhiit.github.io/app/` verfügbar sein!