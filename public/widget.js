
/**
 * ImmoUpload Widget - ULTIMATE FINAL VERSION
 * GARANTIERT: Lädt NIEMALS von Lovable - NUR von Replit!
 * Version 10.1 - REPLIT DOMAIN FIX
 */
(function() {
  'use strict';
  
  // Dynamic domain detection for Replit deployment
  const getCurrentDomain = () => {
    if (window.location.hostname.includes('replit.dev') || window.location.hostname.includes('repl.co')) {
      return window.location.origin;
    }
    // Fallback to immoupload.com if not on Replit
    return 'https://immoupload.com';
  };
  
  const FINAL_WIDGET_BASE_URL = getCurrentDomain();
  console.log('🔥 ImmoWidget v10.1: REPLIT FIX - Loading EXCLUSIVELY from:', FINAL_WIDGET_BASE_URL);
  
  // Prüfe ob bereits initialisiert
  if (window.ImmoWidget && window.ImmoWidget.initialized) {
    console.log('ImmoWidget: Already initialized, skipping...');
    return;
  }
  
  // Globales Widget-Objekt
  window.ImmoWidget = window.ImmoWidget || {};
  
  // Script-Element identifizieren
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Widget initialisieren
  function initializeWidget() {
    console.log('🚀 ImmoWidget: REPLIT initialization from:', FINAL_WIDGET_BASE_URL);
    
    // Container finden oder erstellen
    let container = document.getElementById('immo-widget-container');
    if (!container) {
      container = document.querySelector('.immo-widget-container');
    }
    
    if (!container) {
      console.log('ImmoWidget: Creating new container');
      container = document.createElement('div');
      container.id = 'immo-widget-container';
      container.className = 'immo-widget-container';
      
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }
    
    // Container-Styling
    container.style.cssText = `
      overflow: visible !important;
      position: relative !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    `;
    
    // Widget-CSS hinzufügen
    if (!document.getElementById('immo-widget-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'immo-widget-styles';
      styleElement.textContent = `
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
      document.head.appendChild(styleElement);
      console.log('ImmoWidget: Styles injected');
    }
    
    // Company-ID extrahieren
    const companyId = currentScript.getAttribute('data-company') || currentScript.getAttribute('data-company-id');
    console.log('ImmoWidget: Company ID:', companyId);
    
    // FINALE Iframe-URL - ABSOLUT von Replit
    let finalIframeUrl = FINAL_WIDGET_BASE_URL + '/embed';
    if (companyId) {
      finalIframeUrl += `?company=${encodeURIComponent(companyId)}`;
    }
    
    console.log('🎯 ImmoWidget: Creating iframe with REPLIT URL:', finalIframeUrl);
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = finalIframeUrl;
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
    
    // Erfolgs-Handler
    iframe.addEventListener('load', function() {
      console.log('✅ ImmoWidget: REPLIT SUCCESS - Loaded from:', finalIframeUrl);
      
      // Erfolgs-Event
      const successEvent = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: finalIframeUrl,
          baseUrl: FINAL_WIDGET_BASE_URL,
          timestamp: new Date().toISOString(),
          version: '10.1-REPLIT'
        }
      });
      document.dispatchEvent(successEvent);
    });
    
    // Fehler-Handler
    iframe.addEventListener('error', function() {
      console.error('❌ ImmoWidget: REPLIT ERROR - Failed to load from:', finalIframeUrl);
      console.error('❌ Check if', FINAL_WIDGET_BASE_URL, 'is accessible');
      
      // Fehler-Event
      const errorEvent = new CustomEvent('immo-widget-error', {
        detail: {
          error: 'Failed to load iframe',
          url: finalIframeUrl,
          baseUrl: FINAL_WIDGET_BASE_URL,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(errorEvent);
    });
    
    // Iframe einbetten
    container.appendChild(iframe);
    console.log('ImmoWidget: Iframe added to container');
  }
  
  // DOM-Ready-Check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
  
  // PostMessage-Handler für Auto-Resize (nur von erlaubten Domains)
  let lastKnownHeight = 400;
  let resizeDebounceTimer;
  
  window.addEventListener('message', function(event) {
    // Erlaubte Domains für Replit
    const allowedOrigins = [
      FINAL_WIDGET_BASE_URL,
      'http://localhost:8080',
      'http://localhost:5173',
      window.location.origin
    ];
    
    if (!allowedOrigins.includes(event.origin)) {
      console.log('ImmoWidget: Blocked message from unauthorized origin:', event.origin);
      return;
    }
    
    // Auto-Resize-Handler
    if (event.data && event.data.type === 'RESIZE_IFRAME') {
      const iframe = document.getElementById('immo-widget-iframe');
      
      if (iframe && event.data.height) {
        const newHeight = parseInt(event.data.height);
        
        if (newHeight > 50 && newHeight < 5000 && Math.abs(newHeight - lastKnownHeight) > 10) {
          clearTimeout(resizeDebounceTimer);
          resizeDebounceTimer = setTimeout(() => {
            console.log('ImmoWidget: REPLIT resize to height:', newHeight);
            iframe.style.height = newHeight + 'px';
            lastKnownHeight = newHeight;
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
  window.ImmoWidget.version = '10.1-REPLIT';
  window.ImmoWidget.baseUrl = FINAL_WIDGET_BASE_URL;
  
  console.log('🏆 ImmoWidget v10.1: REPLIT VERSION loaded from:', FINAL_WIDGET_BASE_URL);
  console.log('🔒 GARANTIERT: Lädt von Replit, nicht von Lovable!');
})();
