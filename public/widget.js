
/**
 * ImmoUpload Widget - FINAL Production Version
 * GARANTIERT: Lädt IMMER von immoupload.com - KEINE Lovable URLs mehr!
 * Version 9.0 - ULTIMATE FIX
 */
(function() {
  'use strict';
  
  // KRITISCH: Absolute Production-Domain - NIEMALS Lovable URLs!
  const PRODUCTION_DOMAIN = 'immoupload.com';
  const WIDGET_BASE_URL = 'https://' + PRODUCTION_DOMAIN;
  
  // Widget bereits initialisiert?
  if (window.ImmoWidget && window.ImmoWidget.initialized) {
    console.log('ImmoWidget: Already initialized, skipping...');
    return;
  }
  
  // Globales Objekt für das Widget erstellen
  window.ImmoWidget = window.ImmoWidget || {};
  
  console.log('ImmoWidget v9.0: FINAL FIX - Loading ONLY from:', WIDGET_BASE_URL);
  
  // Aktuelles Script identifizieren
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Widget Initialisierung
  function initWidget() {
    console.log('ImmoWidget: Starting initialization from PRODUCTION:', WIDGET_BASE_URL);
    
    // Container finden oder erstellen
    let container = document.getElementById('immo-widget-container');
    if (!container) {
      container = document.querySelector('.immo-widget-container');
    }
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'immo-widget-container';
      container.className = 'immo-widget-container';
      
      if (script.parentNode) {
        script.parentNode.insertBefore(container, script.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }
    
    // Container-Styles
    container.style.cssText = `
      overflow: visible !important;
      position: relative !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    `;
    
    // Widget CSS
    if (!document.getElementById('immo-widget-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'immo-widget-styles';
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
    }
    
    // Company-ID extrahieren
    const companyId = script.getAttribute('data-company') || script.getAttribute('data-company-id');
    
    // Iframe URL - ABSOLUT von Production-Domain
    let iframeUrl = WIDGET_BASE_URL + '/embed';
    if (companyId) {
      iframeUrl += `?company=${encodeURIComponent(companyId)}`;
    }
    
    console.log('ImmoWidget: Creating iframe with PRODUCTION URL:', iframeUrl);
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.id = 'immo-widget-iframe';
    iframe.className = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('allow', 'cross-origin');
    
    iframe.style.cssText = `
      width: 100% !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 400px !important;
      overflow: visible !important;
      transition: height 0.3s ease !important;
      display: block !important;
    `;
    
    // Load Handler
    iframe.addEventListener('load', function() {
      console.log('ImmoWidget: SUCCESS - Iframe loaded from PRODUCTION:', iframeUrl);
      
      // Custom Event
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          productionDomain: PRODUCTION_DOMAIN,
          timestamp: new Date().toISOString(),
          version: '9.0'
        }
      });
      document.dispatchEvent(event);
    });
    
    // Error Handler
    iframe.addEventListener('error', function() {
      console.error('ImmoWidget: CRITICAL ERROR - Failed to load from PRODUCTION:', iframeUrl);
      console.error('ImmoWidget: Check if', PRODUCTION_DOMAIN, 'is accessible and configured correctly');
      
      // Error Event
      const errorEvent = new CustomEvent('immo-widget-error', {
        detail: {
          error: 'Failed to load iframe',
          url: iframeUrl,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(errorEvent);
    });
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
  }
  
  // DOM Ready Check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
  
  // PostMessage Handler für Auto-Resize
  let lastHeight = 400;
  let resizeTimeout;
  
  window.addEventListener('message', function(event) {
    // Nur von Production-Domain akzeptieren
    const allowedOrigins = [
      WIDGET_BASE_URL,
      'https://immoupload.lovable.app', // Development fallback
      'http://localhost:8080',
      'http://localhost:5173'
    ];
    
    if (!allowedOrigins.includes(event.origin)) {
      console.log('ImmoWidget: Message from unauthorized origin blocked:', event.origin);
      return;
    }
    
    // Auto-Resize
    if (event.data && event.data.type === 'RESIZE_IFRAME') {
      const iframe = document.getElementById('immo-widget-iframe');
      
      if (iframe && event.data.height) {
        const newHeight = parseInt(event.data.height);
        
        if (newHeight > 50 && newHeight < 5000 && Math.abs(newHeight - lastHeight) > 10) {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            console.log('ImmoWidget: Resizing to height:', newHeight);
            iframe.style.height = newHeight + 'px';
            lastHeight = newHeight;
          }, 50);
        }
      }
    }
    
    // Externe Links
    if (event.data && event.data.type === 'external-link' && event.data.url) {
      window.open(event.data.url, '_blank', 'noopener,noreferrer');
    }
  });
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '9.0';
  window.ImmoWidget.productionDomain = PRODUCTION_DOMAIN;
  window.ImmoWidget.baseUrl = WIDGET_BASE_URL;
  
  console.log('ImmoWidget v9.0: FINAL PRODUCTION SCRIPT loaded from:', WIDGET_BASE_URL);
})();
