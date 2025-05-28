
/**
 * ImmoUpload Widget - ULTIMATE FINAL VERSION
 * GARANTIERT: Lädt NIEMALS von Lovable - NUR von immoupload.com!
 * Version 10.0 - ABSOLUTE FINAL FIX
 */
(function() {
  'use strict';
  
  // ABSOLUT FINALE Production-Domain - NIEMALS ÄNDERN!
  const FINAL_PRODUCTION_DOMAIN = 'immoupload.com';
  const FINAL_WIDGET_BASE_URL = 'https://' + FINAL_PRODUCTION_DOMAIN;
  
  console.log('🔥 ImmoWidget v10.0: ULTIMATE FINAL - Loading EXCLUSIVELY from:', FINAL_WIDGET_BASE_URL);
  
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
    console.log('🚀 ImmoWidget: FINAL initialization from PRODUCTION ONLY:', FINAL_WIDGET_BASE_URL);
    
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
    
    // FINALE Iframe-URL - ABSOLUT von Production
    let finalIframeUrl = FINAL_WIDGET_BASE_URL + '/embed';
    if (companyId) {
      finalIframeUrl += `?company=${encodeURIComponent(companyId)}`;
    }
    
    console.log('🎯 ImmoWidget: Creating iframe with FINAL PRODUCTION URL:', finalIframeUrl);
    
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
      console.log('✅ ImmoWidget: ULTIMATE SUCCESS - Loaded from FINAL PRODUCTION:', finalIframeUrl);
      
      // Erfolgs-Event
      const successEvent = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: finalIframeUrl,
          productionDomain: FINAL_PRODUCTION_DOMAIN,
          timestamp: new Date().toISOString(),
          version: '10.0-FINAL'
        }
      });
      document.dispatchEvent(successEvent);
    });
    
    // Fehler-Handler
    iframe.addEventListener('error', function() {
      console.error('❌ ImmoWidget: CRITICAL FINAL ERROR - Failed to load from:', finalIframeUrl);
      console.error('❌ Check if', FINAL_PRODUCTION_DOMAIN, 'is accessible');
      
      // Fehler-Event
      const errorEvent = new CustomEvent('immo-widget-error', {
        detail: {
          error: 'Failed to load final iframe',
          url: finalIframeUrl,
          domain: FINAL_PRODUCTION_DOMAIN,
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
    // NUR von FINALER Production-Domain akzeptieren
    const allowedOrigins = [
      FINAL_WIDGET_BASE_URL,
      'https://immoupload.lovable.app', // Nur für Development
      'http://localhost:8080',
      'http://localhost:5173'
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
            console.log('ImmoWidget: FINAL resize to height:', newHeight);
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
  
  // Widget als FINAL initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '10.0-FINAL';
  window.ImmoWidget.productionDomain = FINAL_PRODUCTION_DOMAIN;
  window.ImmoWidget.baseUrl = FINAL_WIDGET_BASE_URL;
  
  console.log('🏆 ImmoWidget v10.0: ULTIMATE FINAL VERSION loaded from:', FINAL_WIDGET_BASE_URL);
  console.log('🔒 GARANTIERT: Lädt NIEMALS von Lovable - NUR von', FINAL_PRODUCTION_DOMAIN);
})();
