
/**
 * ImmoUpload Widget - Production Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 4.0 - Production Ready (Debug-free)
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
    
    // Container-Style setzen
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    
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
    `;
    document.head.appendChild(styleTag);
    
    // Iframe URL zusammenstellen - lese aus data-url Attribut
    let iframeUrl = script.getAttribute('data-url') || (baseUrl + '/embed');
    
    // Stellen Sie sicher, dass die company-ID hinzugefügt wird, wenn sie fehlt
    if (script.getAttribute('data-company') && !iframeUrl.includes('company=') && !iframeUrl.includes('companyId=')) {
      const separator = iframeUrl.includes('?') ? '&' : '?';
      iframeUrl += `${separator}company=${script.getAttribute('data-company')}`;
    }
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = widgetWidth;
    iframe.style.border = 'none';
    iframe.style.minHeight = '350px';
    iframe.style.height = 'auto';
    iframe.style.maxWidth = '100%';
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
        
        // Periodische Höhenanpassung
        const heightInterval = setInterval(() => {
          adjustIframeHeight(iframe);
        }, 3000);
        
        // Clean up interval nach 30 Sekunden
        setTimeout(() => {
          clearInterval(heightInterval);
        }, 30000);
      }, 1500);
    });
  }
  
  // Funktion zur Höhenanpassung des Iframes - sicherheitsorientiert
  function adjustIframeHeight(iframe) {
    try {
      // Prüfe ob iframe und contentWindow verfügbar sind
      if (!iframe || !iframe.contentWindow) {
        return;
      }
      
      // Versuche Zugriff auf das iframe-Dokument
      let iframeDoc;
      try {
        iframeDoc = iframe.contentWindow.document;
        
        if (!iframeDoc || !iframeDoc.body) {
          // Post-Message als Alternative verwenden
          try {
            iframe.contentWindow.postMessage({ 
              type: 'request-height',
              source: 'immo-widget',
              timestamp: new Date().toISOString()
            }, '*');
          } catch (postMessageError) {
            // Silent fail
          }
          
          return;
        }
      } catch (accessError) {
        // Post-Message als Alternative verwenden
        try {
          iframe.contentWindow.postMessage({ 
            type: 'request-height',
            source: 'immo-widget',
            timestamp: new Date().toISOString()
          }, '*');
        } catch (postMessageError) {
          // Silent fail
        }
        
        return;
      }
      
      const height = iframeDoc.body.scrollHeight;
      if (height && height > 100) {
        iframe.style.height = height + 'px';
      }
    } catch (e) {
      // Post-Message als Fallback verwenden
      try {
        iframe.contentWindow.postMessage({ 
          type: 'request-height',
          source: 'immo-widget',
          timestamp: new Date().toISOString()
        }, '*');
      } catch (postMessageError) {
        // Silent fail
      }
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
  
  // Globale Event-Handler für Nachrichtenaustausch
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
                         e.origin.includes('127.0.0.1');
    
    if (!originAllowed) {
      return;
    }
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && e.data.height) {
        iframe.style.height = e.data.height + 'px';
      }
    }
    
    // Handling für externe Links aus dem iframe
    if (e.data && e.data.type === 'external-link') {
      if (e.data.url) {
        window.open(e.data.url, '_blank');
      }
    }
    
    // Debug-Response senden
    if (e.data && e.data.type === 'request-height') {
      try {
        e.source.postMessage({
          type: 'height-response',
          height: document.body.scrollHeight,
          source: 'immo-widget-parent',
          timestamp: new Date().toISOString()
        }, e.origin);
      } catch (responseError) {
        // Silent fail
      }
    }
  });
  
  // Empty fallback functions to prevent errors
  window.drawHighlights = window.drawHighlights || function() {
    // Leere Fallback-Funktion, um Fehler zu vermeiden
  };
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '4.0';
})();
