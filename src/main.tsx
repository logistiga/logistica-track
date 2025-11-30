import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enregistrer le Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker pas encore généré, normal en dev
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
