
/**
 * ImmoUpload Widget - Vereinfachte Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 3.3
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
  
  // KORRIGIERTE BASE URL FÜR PRODUCTION
  const baseUrl = 'https://immoupload.com';
  
  // Konfigurationsoptionen
  const widgetHeight = script.getAttribute('data-height') || 'auto';
  const widgetWidth = script.getAttribute('data-width') || '100%';
  
  // Debug-Modus
  const debugMode = script.getAttribute('data-debug') === 'true';
  
  // Debug-Funktion
  function debug(message, data) {
    if (debugMode) {
      const timestamp = new Date().toISOString();
      const prefix = `[ImmoWidget ${timestamp}]`;
      
      if (data) {
        console.log(prefix, message, data);
      } else {
        console.log(prefix, message);
      }
    }
  }
  
  // Initialisierung des Widgets
  function initWidget() {
    debug('Widget Initialisierung gestartet');
    
    // Container identifizieren oder erstellen
    let container = document.getElementById('immo-widget-container');
    if (!container) {
      container = document.querySelector('.immo-widget-container');
    }
    
    if (!container) {
      console.error('ImmoUpload Widget: Container mit ID "immo-widget-container" oder Klasse "immo-widget-container" nicht gefunden.');
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
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/embed';
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
    
    debug('Iframe erstellt mit URL:', iframe.src);
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    // Nach dem Laden eine erste Höhenanpassung vornehmen
    iframe.addEventListener('load', function() {
      debug('Iframe geladen, Event wird ausgelöst');
      
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded');
      document.dispatchEvent(event);
      
      // Warten bis das iframe vollständig geladen ist
      setTimeout(() => {
        adjustIframeHeight(iframe);
        debug('Erste Höhenanpassung durchgeführt');
        
        // Periodisch die Höhe anpassen
        const heightInterval = setInterval(() => {
          adjustIframeHeight(iframe);
        }, 2000);
        
        // Clean up interval nach 30 Sekunden
        setTimeout(() => {
          clearInterval(heightInterval);
          debug('Automatische Höhenanpassung beendet');
        }, 30000);
      }, 1000);
    });
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
          debug('Iframe-Dokument oder body nicht verfügbar');
          
          // Post-Message als Alternative verwenden
          try {
            debug('Versuche Height-Request via postMessage');
            iframe.contentWindow.postMessage({ type: 'request-height' }, '*');
          } catch (postMessageError) {
            debug('Post-Message blockiert', postMessageError);
          }
          
          return;
        }
      } catch (accessError) {
        debug('Cross-Origin-Zugriff verweigert', accessError);
        
        // Post-Message als Alternative verwenden
        try {
          debug('Versuche Height-Request via postMessage nach Access-Error');
          iframe.contentWindow.postMessage({ type: 'request-height' }, '*');
        } catch (postMessageError) {
          debug('Post-Message blockiert nach Access-Error', postMessageError);
        }
        
        return;
      }
      
      const height = iframeDoc.body.scrollHeight;
      if (height && height > 100) {
        debug('Neue Höhe gefunden:', height);
        iframe.style.height = height + 'px';
        console.log('Iframe-Höhe angepasst:', height + 'px');
      } else {
        debug('Ungültige Höhe gefunden:', height);
      }
    } catch (e) {
      // Cross-Origin-Fehler abfangen
      debug('Cross-Origin-Einschränkung - automatische Größenanpassung deaktiviert', e);
      
      // Post-Message als Alternative verwenden
      try {
        debug('Versuche Height-Request via postMessage nach Error');
        iframe.contentWindow.postMessage({ type: 'request-height' }, '*');
      } catch (postMessageError) {
        debug('Post-Message ebenfalls blockiert', postMessageError);
      }
    }
  }
  
  // Warten auf DOM Content Loaded
  if (document.readyState === 'loading') {
    debug('Dokument wird noch geladen, warte auf DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    debug('Dokument bereits geladen, initialisiere Widget sofort');
    initWidget();
  }
  
  // Globale Event-Handler für Nachrichtenaustausch
  debug('Event-Listener für postMessage registrieren');
  window.addEventListener('message', function(e) {
    debug('Nachricht empfangen:', e.data);
    
    // Sicherheits-Check - erlauben Sie auch die Produktions-Domain
    const allowedOrigins = [
      'https://immoupload.com',
      'https://immoupload.lovable.app',
      'https://kmzlkfwxeghvlgtilzjh.supabase.co',
      'https://as-immobilien.info'
    ];
    
    // Prüfen, ob die Ursprungs-Domain erlaubt ist
    const originAllowed = allowedOrigins.some(origin => e.origin.includes(origin)) || 
                         e.origin.includes('localhost') || 
                         e.origin.includes('127.0.0.1');
    
    if (!originAllowed) {
      debug('Origin nicht erlaubt:', e.origin);
      return;
    }
    
    debug('Origin erlaubt:', e.origin);
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && e.data.height) {
        iframe.style.height = e.data.height + 'px';
        debug('Iframe-Höhe via Post-Message angepasst:', e.data.height);
      }
    }
    
    // Handling für externe Links aus dem iframe
    if (e.data && e.data.type === 'external-link') {
      if (e.data.url) {
        debug('Externe URL öffnen:', e.data.url);
        window.open(e.data.url, '_blank');
      }
    }
  });
  
  // Fix für drawHighlights-Fehler
  window.drawHighlights = window.drawHighlights || function() {
    debug('drawHighlights-Fallback aufgerufen');
    // Leere Fallback-Funktion, um Fehler zu vermeiden
  };
  
  // Widget als initialisiert markieren
  debug('Widget wurde erfolgreich initialisiert');
  window.ImmoWidget.initialized = true;
})();
