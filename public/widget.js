
/**
 * ImmoUpload Widget - Production Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 4.2 - Fixed Spacing Issues
 */
(function() {
  // Globales Objekt für das Widget erstellen
  window.ImmoWidget = window.ImmoWidget || {};
  
  // Widget bereits initialisiert?
  if (window.ImmoWidget.initialized) return;
  
  // Basis-URL ermitteln (woher das Script geladen wurde)
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Base URL für Production
  const baseUrl = window.location.origin;
  
  // Konfigurationsoptionen
  const widgetHeight = script.getAttribute('data-height') || 'auto';
  const widgetWidth = script.getAttribute('data-width') || '100%';
  
  // Initialisierung des Widgets
  function initWidget() {
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
    
    // Container-Style setzen mit minimalem Overflow-Handling
    container.style.overflow = 'visible';
    container.style.position = 'relative';
    container.style.minHeight = '200px';
    
    // CSS für Hover-Effekte einfügen
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .property-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .property-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .estate-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .immo-widget-iframe {
        border: none !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Iframe URL zusammenstellen - lese aus data-url Attribut
    let iframeUrl = script.getAttribute('data-url') || (baseUrl + '/embed');
    
    // Stellen Sie sicher, dass die company-ID hinzugefügt wird, wenn sie fehlt
    if (script.getAttribute('data-company') && !iframeUrl.includes('company=') && !iframeUrl.includes('companyId=')) {
      const separator = iframeUrl.includes('?') ? '&' : '?';
      iframeUrl += `${separator}company=${script.getAttribute('data-company')}`;
    }
    
    // Iframe erstellen mit optimierter Höhenbehandlung
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = widgetWidth;
    iframe.style.border = 'none';
    iframe.style.minHeight = '200px';
    iframe.style.height = 'auto';
    iframe.style.maxWidth = '100%';
    iframe.style.overflow = 'visible';
    iframe.id = 'immo-widget-iframe';
    iframe.className = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    iframe.setAttribute('loading', 'eager');
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    // Iframe Load Event Handler
    iframe.addEventListener('load', function() {
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
      
      // Erste Höhenanpassung nach kurzer Verzögerung
      setTimeout(() => {
        adjustIframeHeight(iframe);
      }, 200);
    });
  }
  
  // Optimierte Funktion zur Höhenanpassung des Iframes
  function adjustIframeHeight(iframe) {
    try {
      // Prüfe ob iframe und contentWindow verfügbar sind
      if (!iframe || !iframe.contentWindow) {
        return;
      }
      
      // Post-Message verwenden für Cross-Origin-Kommunikation
      try {
        iframe.contentWindow.postMessage({ 
          type: 'request-height',
          source: 'immo-widget',
          timestamp: new Date().toISOString()
        }, '*');
      } catch (postMessageError) {
        // Silent fail
      }
    } catch (e) {
      // Silent fail
    }
  }
  
  // DOM Ready Check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initWidget();
    });
  } else {
    initWidget();
  }
  
  // Optimierte Event-Handler für Nachrichtenaustausch
  window.addEventListener('message', function(e) {
    // Erweiterte Sicherheits-Checks
    const allowedOrigins = [
      'https://immoupload.com',
      'https://immoupload.lovable.app',
      'https://kmzlkfwxeghvlgtilzjh.supabase.co',
      'https://as-immobilien.info',
      window.location.origin
    ];
    
    // Prüfen, ob die Ursprungs-Domain erlaubt ist
    const originAllowed = allowedOrigins.some(origin => e.origin.includes(origin)) || 
                         e.origin.includes('localhost') || 
                         e.origin.includes('127.0.0.1') ||
                         e.origin.includes('lovableproject.com');
    
    if (!originAllowed) {
      return;
    }
    
    // Behandlung von Resize-Events für das iframe mit minimaler Höhenbehandlung
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && e.data.height) {
        // Mindesthöhe von 200px und minimal Padding
        const newHeight = Math.max(e.data.height, 200);
        iframe.style.height = newHeight + 'px';
        
        // Container-Höhe ebenfalls anpassen
        const container = iframe.parentElement;
        if (container) {
          container.style.minHeight = newHeight + 'px';
        }
      }
    }
    
    // Handling für externe Links aus dem iframe
    if (e.data && e.data.type === 'external-link') {
      if (e.data.url) {
        window.open(e.data.url, '_blank');
      }
    }
    
    // Height-Response verarbeiten
    if (e.data && e.data.type === 'height-response') {
      try {
        e.source.postMessage({
          type: 'height-received',
          height: document.body.scrollHeight,
          source: 'immo-widget-parent',
          timestamp: new Date().toISOString()
        }, e.origin);
      } catch (responseError) {
        // Silent fail
      }
    }
  });
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '4.2';
})();
