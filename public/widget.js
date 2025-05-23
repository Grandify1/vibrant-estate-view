
/**
 * ImmoUpload Widget - Vereinfachte Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 3.5 - Mit korrigierter Base URL und fehlerbehebung
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
  
  // KORREKTE BASE URL FÜR PRODUCTION - Verwende die aktuelle Domain
  const baseUrl = window.location.origin;
  
  // Konfigurationsoptionen
  const widgetHeight = script.getAttribute('data-height') || 'auto';
  const widgetWidth = script.getAttribute('data-width') || '100%';
  
  // Debug-Modus
  const debugMode = script.getAttribute('data-debug') === 'true';
  
  // Erweiterte Debug-Funktion mit Backend-Logging
  function debug(message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[ImmoWidget ${timestamp}]`;
    
    if (debugMode) {
      if (data) {
        console.log(prefix, message, data);
      } else {
        console.log(prefix, message);
      }
    }
    
    // Sende Debug-Informationen an Backend (nur bei kritischen Fehlern)
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
      try {
        fetch(`${baseUrl}/api/widget-debug`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: timestamp,
            message: message,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
          })
        }).catch(err => {
          console.warn('Debug logging failed:', err);
        });
      } catch (e) {
        // Ignoriere Fehler beim Debug-Logging
      }
    }
  }
  
  // Initialisierung des Widgets
  function initWidget() {
    debug('Widget Initialisierung gestartet');
    debug('Script Source URL:', script.src);
    debug('Base URL:', baseUrl);
    debug('Debug Mode:', debugMode);
    
    // Container identifizieren oder erstellen
    let container = document.getElementById('immo-widget-container');
    if (!container) {
      container = document.querySelector('.immo-widget-container');
    }
    
    if (!container) {
      const errorMsg = 'ImmoUpload Widget: Container mit ID "immo-widget-container" oder Klasse "immo-widget-container" nicht gefunden.';
      console.error(errorMsg);
      debug('CRITICAL ERROR: Container not found');
      return;
    }
    
    debug('Container gefunden', container);
    
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
    
    debug('Styles hinzugefügt');
    
    // Iframe URL zusammenstellen - lese aus data-url Attribut
    let iframeUrl = script.getAttribute('data-url') || (baseUrl + '/embed');
    debug('Iframe URL erstellt:', iframeUrl);
    
    // Teste Erreichbarkeit der URL
    fetch(iframeUrl, { method: 'HEAD' })
      .then(response => {
        debug('URL Test Response Status:', response.status);
        if (!response.ok) {
          debug('ERROR: URL nicht erreichbar', { status: response.status, statusText: response.statusText });
        }
      })
      .catch(error => {
        debug('ERROR: URL Test fehlgeschlagen', error);
      });
    
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
    
    debug('Iframe erstellt mit Eigenschaften:', {
      src: iframe.src,
      width: iframe.style.width,
      height: iframe.style.height,
      id: iframe.id
    });
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    debug('Iframe zum Container hinzugefügt');
    
    // Iframe Load Event Handler
    iframe.addEventListener('load', function() {
      debug('Iframe geladen - Load Event ausgelöst');
      
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
      debug('Custom Event "immo-widget-loaded" ausgelöst');
      
      // Erste Höhenanpassung nach kurzer Verzögerung
      setTimeout(() => {
        adjustIframeHeight(iframe);
        debug('Erste Höhenanpassung durchgeführt');
        
        // Periodische Höhenanpassung
        const heightInterval = setInterval(() => {
          adjustIframeHeight(iframe);
        }, 3000);
        
        // Clean up interval nach 30 Sekunden
        setTimeout(() => {
          clearInterval(heightInterval);
          debug('Automatische Höhenanpassung beendet');
        }, 30000);
      }, 1500);
    });
    
    // Iframe Error Event Handler
    iframe.addEventListener('error', function(e) {
      debug('ERROR: Iframe Load Error', e);
    });
    
    // Timeout für iframe loading
    setTimeout(() => {
      if (!iframe.contentDocument && !iframe.contentWindow) {
        debug('ERROR: Iframe failed to load within 10 seconds');
      }
    }, 10000);
  }
  
  // Funktion zur Höhenanpassung des Iframes - sicherheitsorientiert
  function adjustIframeHeight(iframe) {
    debug('Versuche Iframe-Höhe anzupassen');
    
    try {
      // Prüfe ob iframe und contentWindow verfügbar sind
      if (!iframe || !iframe.contentWindow) {
        debug('Iframe oder contentWindow nicht verfügbar');
        return;
      }
      
      // Versuche Zugriff auf das iframe-Dokument
      let iframeDoc;
      try {
        iframeDoc = iframe.contentWindow.document;
        
        if (!iframeDoc || !iframeDoc.body) {
          debug('Iframe-Dokument oder body nicht verfügbar - verwende postMessage');
          
          // Post-Message als Alternative verwenden
          try {
            debug('Sende Height-Request via postMessage');
            iframe.contentWindow.postMessage({ 
              type: 'request-height',
              source: 'immo-widget',
              timestamp: new Date().toISOString()
            }, '*');
          } catch (postMessageError) {
            debug('Post-Message blockiert', postMessageError);
          }
          
          return;
        }
      } catch (accessError) {
        debug('Cross-Origin-Zugriff verweigert - verwende postMessage', accessError);
        
        // Post-Message als Alternative verwenden
        try {
          debug('Sende Height-Request via postMessage nach Access-Error');
          iframe.contentWindow.postMessage({ 
            type: 'request-height',
            source: 'immo-widget',
            timestamp: new Date().toISOString()
          }, '*');
        } catch (postMessageError) {
          debug('Post-Message blockiert nach Access-Error', postMessageError);
        }
        
        return;
      }
      
      const height = iframeDoc.body.scrollHeight;
      if (height && height > 100) {
        debug('Neue Höhe gefunden:', height);
        iframe.style.height = height + 'px';
        debug('Iframe-Höhe erfolgreich angepasst auf:', height + 'px');
      } else {
        debug('Ungültige Höhe gefunden:', height);
      }
    } catch (e) {
      // Cross-Origin-Fehler abfangen
      debug('Unerwarteter Fehler bei Höhenanpassung', e);
      
      // Post-Message als Fallback verwenden
      try {
        debug('Fallback: Height-Request via postMessage');
        iframe.contentWindow.postMessage({ 
          type: 'request-height',
          source: 'immo-widget',
          timestamp: new Date().toISOString()
        }, '*');
      } catch (postMessageError) {
        debug('Fallback Post-Message ebenfalls fehlgeschlagen', postMessageError);
      }
    }
  }
  
  // DOM Ready Check
  if (document.readyState === 'loading') {
    debug('Dokument wird noch geladen, warte auf DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', function() {
      debug('DOMContentLoaded Event empfangen');
      initWidget();
    });
  } else {
    debug('Dokument bereits geladen, initialisiere Widget sofort');
    initWidget();
  }
  
  // Globale Event-Handler für Nachrichtenaustausch
  debug('Registriere Event-Listener für postMessage');
  window.addEventListener('message', function(e) {
    debug('PostMessage empfangen:', {
      origin: e.origin,
      data: e.data,
      source: e.source === window ? 'self' : 'external'
    });
    
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
      debug('Origin nicht erlaubt:', e.origin);
      return;
    }
    
    debug('Origin erlaubt, verarbeite Nachricht:', e.origin);
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && e.data.height) {
        iframe.style.height = e.data.height + 'px';
        debug('Iframe-Höhe via PostMessage angepasst:', e.data.height);
      }
    }
    
    // Handling für externe Links aus dem iframe
    if (e.data && e.data.type === 'external-link') {
      if (e.data.url) {
        debug('Externe URL öffnen:', e.data.url);
        window.open(e.data.url, '_blank');
      }
    }
    
    // Debug-Response senden
    if (e.data && e.data.type === 'request-height') {
      debug('Height-Request erhalten, sende Antwort zurück');
      try {
        e.source.postMessage({
          type: 'height-response',
          height: document.body.scrollHeight,
          source: 'immo-widget-parent',
          timestamp: new Date().toISOString()
        }, e.origin);
      } catch (responseError) {
        debug('Fehler beim Senden der Height-Response', responseError);
      }
    }
  });
  
  // Empty fallback functions to prevent errors
  window.drawHighlights = window.drawHighlights || function() {
    debug('drawHighlights-Fallback aufgerufen');
    // Leere Fallback-Funktion, um Fehler zu vermeiden
  };
  
  // Performance Monitoring
  window.addEventListener('load', function() {
    debug('Window Load Event - Performance Stats:', {
      loadTime: Date.now() - performance.timing.navigationStart,
      domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      timestamp: new Date().toISOString()
    });
  });
  
  // Error Handling für unbehandelte Fehler
  window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('widget.js')) {
      debug('ERROR: Unbehandelter JavaScript-Fehler im Widget', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    }
  });
  
  // Widget als initialisiert markieren
  debug('Widget wurde erfolgreich initialisiert');
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '3.5';
  window.ImmoWidget.debug = debug;
})();
