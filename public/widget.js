
/**
 * ImmoUpload Widget - Production Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 7.0 - Fixed Domain Loading for Customer Websites
 */
(function() {
  'use strict';
  
  // Globales Objekt für das Widget erstellen
  window.ImmoWidget = window.ImmoWidget || {};
  
  // Widget bereits initialisiert?
  if (window.ImmoWidget.initialized) return;
  
  // WICHTIG: Feste Domain für das Widget - IMMER von immoupload.com laden
  const WIDGET_BASE_URL = 'https://immoupload.com';
  
  // Aktuelles Script identifizieren
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Initialisierung des Widgets
  function initWidget() {
    console.log('ImmoWidget: Initializing widget from', WIDGET_BASE_URL);
    
    // Container identifizieren oder erstellen
    let container = document.getElementById('immo-widget-container');
    if (!container) {
      container = document.querySelector('.immo-widget-container');
    }
    
    // Wenn kein Container gefunden wurde, versuche einen zu erstellen
    if (!container) {
      // Erstelle einen Container nach dem Script
      if (script.parentNode) {
        container = document.createElement('div');
        container.id = 'immo-widget-container';
        container.className = 'immo-widget-container';
        script.parentNode.insertBefore(container, script.nextSibling);
      } else {
        // Versuche trotzdem einen Container im body zu erstellen als letzte Rettung
        const bodyContainer = document.createElement('div');
        bodyContainer.id = 'immo-widget-container';
        bodyContainer.className = 'immo-widget-container';
        document.body.appendChild(bodyContainer);
        container = bodyContainer;
      }
    }
    
    // Container-Style setzen
    container.style.overflow = 'visible';
    container.style.position = 'relative';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.width = '100%';
    
    // CSS für Widget einfügen
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .immo-widget-iframe {
        border: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        transition: height 0.3s ease !important;
        display: block !important;
      }
      .immo-widget-container {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        overflow: visible !important;
        position: relative !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Iframe URL zusammenstellen - IMMER von immoupload.com
    let iframeUrl = WIDGET_BASE_URL + '/embed';
    
    // Company-ID aus Script-Attributen hinzufügen
    const companyId = script.getAttribute('data-company') || script.getAttribute('data-company-id');
    if (companyId) {
      iframeUrl += `?company=${encodeURIComponent(companyId)}`;
    }
    
    // Custom URL überschreibung falls vorhanden
    const customUrl = script.getAttribute('data-url');
    if (customUrl) {
      iframeUrl = customUrl;
    }
    
    console.log('ImmoWidget: Loading iframe from:', iframeUrl);
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.height = '400px'; // Initial height
    iframe.style.overflow = 'visible';
    iframe.style.transition = 'height 0.3s ease';
    iframe.style.display = 'block';
    iframe.id = 'immo-widget-iframe';
    iframe.className = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('allow', 'cross-origin');
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    console.log('ImmoWidget: Iframe created and added to container');
    
    // Load Event Handler
    iframe.addEventListener('load', function() {
      console.log('ImmoWidget: Iframe loaded successfully from', iframeUrl);
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
    });
    
    // Error Handler
    iframe.addEventListener('error', function() {
      console.error('ImmoWidget: Error loading iframe from', iframeUrl);
    });
  }
  
  // DOM Ready Check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initWidget();
    });
  } else {
    initWidget();
  }
  
  // PostMessage Event Handler für Auto-Resize mit Loop Prevention
  let lastHeight = 400;
  let resizeCount = 0;
  let lastResizeTime = 0;
  const maxResizes = 5;
  const resizeDelay = 100;
  
  window.addEventListener('message', function(event) {
    const now = Date.now();
    
    // Erweiterte Sicherheits-Checks - NUR von immoupload.com akzeptieren
    const allowedOrigins = [
      'https://immoupload.com',
      'https://immoupload.lovable.app',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173'
    ];
    
    // Prüfen, ob die Ursprungs-Domain erlaubt ist
    const originAllowed = allowedOrigins.includes(event.origin);
    
    if (!originAllowed) {
      console.log('ImmoWidget: Message from unauthorized origin blocked:', event.origin);
      return;
    }
    
    console.log('ImmoWidget: Received message from authorized origin:', event.origin);
    
    // Auto-Resize Handler mit Loop Prevention
    if (event.data && event.data.type === 'RESIZE_IFRAME') {
      // Rate limiting
      if (now - lastResizeTime < resizeDelay) {
        return;
      }
      
      const iframe = document.getElementById('immo-widget-iframe');
      const container = document.getElementById('immo-widget-container');
      
      if (iframe && event.data.height) {
        const newHeight = parseInt(event.data.height);
        
        // Prevent infinite loops and unreasonable heights
        if (newHeight > 50 && newHeight < 5000 && Math.abs(newHeight - lastHeight) > 10) {
          
          // Reset counter if enough time has passed
          if (now - lastResizeTime > 2000) {
            resizeCount = 0;
          }
          
          // Check resize limit
          if (resizeCount < maxResizes) {
            console.log('ImmoWidget: Resizing iframe to height:', newHeight);
            
            // Setze iframe und container Höhe
            iframe.style.height = newHeight + 'px';
            
            if (container) {
              container.style.height = newHeight + 'px';
            }
            
            lastHeight = newHeight;
            resizeCount++;
            lastResizeTime = now;
          } else {
            console.warn('ImmoWidget: Maximum resize limit reached, preventing infinite loop');
          }
        }
      }
    }
    
    // Handling für externe Links
    if (event.data && event.data.type === 'external-link') {
      if (event.data.url) {
        window.open(event.data.url, '_blank');
      }
    }
  });
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '7.0';
  
  console.log('ImmoWidget: Script loaded, version 7.0, loading from:', WIDGET_BASE_URL);
})();
