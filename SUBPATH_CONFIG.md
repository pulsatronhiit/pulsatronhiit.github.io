# Unterordner-Konfiguration für GitHub Pages

## 🔧 Aktuelle Konfiguration

Die App ist für den Unterordner `/hiity/` konfiguriert:

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/hiity/', // ← Unterordner-Pfad
  // ... weitere Konfiguration
})
```

### GitHub Actions Workflow
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    destination_dir: hiity  # ← Deployment-Zielordner
```

## 🎯 Ergebnis

**GitHub Pages URL:** `https://yourusername.github.io/your-repo/hiity/`

Alle Asset-Pfade werden automatisch korrekt gesetzt:
- CSS: `/hiity/assets/index-*.css`
- JS: `/hiity/assets/index-*.js` 
- Icons: `/hiity/icon-*.svg`
- Manifest: `/hiity/manifest.json`
- Exercises: `/hiity/exercises.json`

## 🔄 Anderen Unterordner verwenden

Um einen anderen Unterordner zu verwenden (z.B. `/workout/`):

1. **vite.config.js** ändern:
   ```javascript
   base: '/workout/',  // statt '/hiity/'
   ```

2. **deploy.yml** ändern:
   ```yaml
   destination_dir: workout  # statt hiity
   ```

3. **Neuen Build erstellen:**
   ```bash
   npm run build
   ```

4. **Neue URL:**
   `https://yourusername.github.io/your-repo/workout/`

## ✅ Vorteile

- **Mehrere Apps**: Verschiedene Projekte in verschiedenen Unterordnern
- **Saubere URLs**: Klare Struktur für verschiedene Anwendungen  
- **Keine Konflikte**: Root-Ordner bleibt frei für andere Inhalte
- **Flexibel**: Einfach änderbar für andere Pfade