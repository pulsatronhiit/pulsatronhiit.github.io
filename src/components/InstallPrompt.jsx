// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';
import appIcon from '/icon-192x192.svg';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isCheckingInstallPrompt, setIsCheckingInstallPrompt] = useState(true); // Track install prompt detection status

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsCheckingInstallPrompt(false); // Install prompt detection completed
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Kurze Wartezeit für Install-Prompt Erkennung
    const timer = setTimeout(() => {
      setIsCheckingInstallPrompt(false); // Detection completed
      if (!deferredPrompt) {
        setShowManualInstructions(true);
      }
    }, 200);

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
    }
  };

  // Während Install-Prompt-Erkennung läuft, zeige Loading
  if (isCheckingInstallPrompt) {
    return (
      <div className="app">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
        }}>
          {/* Leerer Bildschirm während PWA-Erkennung */}
        </div>
      </div>
    );
  }

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
          
          {deferredPrompt && (
            <button className="install-button" onClick={handleInstallClick}>
              <span className="install-icon">📱</span>
              App installieren
            </button>
          )}
        </div>

        {/* Zeige manual instructions standardmäßig an
            Verstecke sie nur, wenn deferredPrompt verfügbar ist */}
        {!deferredPrompt && (
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