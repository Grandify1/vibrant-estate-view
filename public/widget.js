
/**
 * ImmoUpload Widget - Production Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 8.0 - FIXED Domain Loading - ALWAYS from immoupload.com
 */
(function() {
  'use strict';
  
  // Globales Objekt für das Widget erstellen
  window.ImmoWidget = window.ImmoWidget || {};
  
  // Widget bereits initialisiert?
  if (window.ImmoWidget.initialized) return;
  
  // KRITISCH: Feste Production-Domain - NIEMALS ändern!
  const PRODUCTION_DOMAIN = 'immoupload.com';
  const WIDGET_BASE_URL = 'https://' + PRODUCTION_DOMAIN;
  
  console.log('ImmoWidget v8.0: Loading from FIXED domain:', WIDGET_BASE_URL);
  
  // Aktuelles Script identifizieren
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Initialisierung des Widgets
  function initWidget() {
    console.log('ImmoWidget: Initializing widget from PRODUCTION domain:', WIDGET_BASE_URL);
    
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
    
    // Company-ID aus Script-Attributen extrahieren
    const companyId = script.getAttribute('data-company') || script.getAttribute('data-company-id');
    
    // Iframe URL - IMMER von Production-Domain
    let iframeUrl = WIDGET_BASE_URL + '/embed';
    if (companyId) {
      iframeUrl += `?company=${encodeURIComponent(companyId)}`;
    }
    
    console.log('ImmoWidget: Creating iframe with URL:', iframeUrl);
    
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
    
    console.log('ImmoWidget: Iframe created and loading from:', iframeUrl);
    
    // Load Event Handler
    iframe.addEventListener('load', function() {
      console.log('ImmoWidget: SUCCESS - Iframe loaded from:', iframeUrl);
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          timestamp: new Date().toISOString(),
          version: '8.0'
        }
      });
      document.dispatchEvent(event);
    });
    
    // Error Handler
    iframe.addEventListener('error', function() {
      console.error('ImmoWidget: ERROR - Failed to load iframe from:', iframeUrl);
      console.error('ImmoWidget: Check if', PRODUCTION_DOMAIN, 'is accessible');
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
  
  // PostMessage Event Handler für Auto-Resize
  let lastHeight = 400;
  let resizeCount = 0;
  let lastResizeTime = 0;
  const maxResizes = 5;
  const resizeDelay = 100;
  
  window.addEventListener('message', function(event) {
    const now = Date.now();
    
    // Sicherheits-Checks - NUR von Production-Domain akzeptieren
    const allowedOrigins = [
      WIDGET_BASE_URL,
      'https://immoupload.lovable.app', // Development fallback
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173'
    ];
    
    const originAllowed = allowedOrigins.includes(event.origin);
    
    if (!originAllowed) {
      console.log('ImmoWidget: Message from unauthorized origin blocked:', event.origin);
      return;
    }
    
    console.log('ImmoWidget: Received message from authorized origin:', event.origin);
    
    // Auto-Resize Handler
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
  window.ImmoWidget.version = '8.0';
  window.ImmoWidget.productionDomain = PRODUCTION_DOMAIN;
  
  console.log('ImmoWidget v8.0: Script loaded from PRODUCTION domain:', WIDGET_BASE_URL);
})();
