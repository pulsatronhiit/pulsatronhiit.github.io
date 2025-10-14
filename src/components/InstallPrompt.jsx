// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';
import appIcon from '/icon-192x192.svg';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Zeige manuelle Anweisungen nach 3 Sekunden falls kein Install-Prompt verfügbar
    const timer = setTimeout(() => {
      // if (!deferredPrompt) {
        setShowManualInstructions(true);
      // }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowManualInstructions(true);
    }
  };

  return (
    <div className="install-prompt">
      <div className="install-container">
        <div className="app-icon">
          <img src={appIcon} alt="PulsatronHIIT" />
        </div>
        
        <h1>PulsatronHIIT</h1>
        <p className="tagline">Baremetal Training.</p>
        
        <div className="install-content">
          <p>Für die beste Erfahrung installiere PulsatronHIIT auf deinem Homebildschirm.</p>
          
          {deferredPrompt ? (
            <button className="install-button" onClick={handleInstallClick}>
              <span className="install-icon">📱</span>
              App installieren
            </button>
          ) : (
            <button className="install-button" onClick={handleInstallClick}>
              <span className="install-icon">📖</span>
              Anleitung anzeigen
            </button>
          )}
        </div>

        {showManualInstructions && (
          <div className="manual-instructions">
            <h3>Manuelle Installation:</h3>
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1</span>
                <p>Tippe auf das <strong>Teilen-Symbol</strong> in deinem Browser</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Wähle <strong>"Zum Home-Bildschirm hinzufügen"</strong></p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Bestätige mit <strong>"Hinzufügen"</strong></p>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <p>Öffne die App vom <strong>Homebildschirm</strong></p>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default InstallPrompt;