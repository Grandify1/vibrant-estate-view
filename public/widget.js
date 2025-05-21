
/**
 * ImmoUpload Widget - Vereinfachte Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 3.0
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
  
  const baseUrl = script.src.split('/widget.js')[0];
  
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
    
    if (!container) {
      console.error('ImmoUpload Widget: Container mit ID "immo-widget-container" oder Klasse "immo-widget-container" nicht gefunden.');
      return;
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
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/embed';
    iframe.style.width = widgetWidth;
    iframe.style.border = 'none';
    iframe.style.minHeight = '500px';
    iframe.style.height = 'auto';
    iframe.style.maxWidth = '100%';
    iframe.id = 'immo-widget-iframe';
    iframe.className = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    iframe.setAttribute('loading', 'eager'); // Eager loading für schnelleres Laden
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    // Nach dem Laden eine erste Höhenanpassung vornehmen
    iframe.addEventListener('load', function() {
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded');
      document.dispatchEvent(event);
      
      // Höhenanpassung
      adjustIframeHeight(iframe);
      
      // Periodisch die Höhe anpassen
      setInterval(() => adjustIframeHeight(iframe), 1000);
      
      // Links innerhalb des iframes abfangen und in neuem Tab öffnen
      try {
        const iframeContent = iframe.contentWindow;
        
        if (iframeContent) {
          iframeContent.addEventListener('click', function(e) {
            // Wenn es ein Link-Element ist
            if (e.target.closest('a')) {
              const link = e.target.closest('a');
              const href = link.getAttribute('href');
              
              // Wenn es ein interner Property-Link ist
              if (href && href.startsWith('/property/')) {
                e.preventDefault();
                window.open(baseUrl + href, '_blank');
              }
            }
          });
        }
      } catch (e) {
        console.log('Konnte keine Click-Handler im iframe registrieren (CORS)');
      }
    });
  }
  
  // Funktion zur Höhenanpassung des Iframes
  function adjustIframeHeight(iframe) {
    try {
      if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.body) {
        const height = iframe.contentWindow.document.body.scrollHeight;
        if (height > 100) { // Nur sinnvolle Höhen verwenden
          iframe.style.height = (height + 20) + 'px'; // Ein bisschen Extra-Platz
        }
      }
    } catch (e) {
      // Cross-Origin-Fehler abfangen
      console.log('Cross-Origin-Einschränkung - automatische Größenanpassung deaktiviert');
      
      // Post-Message als Alternative verwenden
      iframe.contentWindow.postMessage({ type: 'request-height' }, '*');
    }
  }
  
  // Warten auf DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
  
  // Globale Event-Handler für Nachrichtenaustausch
  window.addEventListener('message', function(e) {
    // Sicherheits-Check
    const allowedOrigins = [baseUrl, 'https://kmzlkfwxeghvlgtilzjh.supabase.co'];
    if (!allowedOrigins.some(origin => e.origin.includes(origin)) && 
        !e.origin.includes('localhost') && 
        !e.origin.includes('127.0.0.1')) {
      return;
    }
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe) {
        iframe.style.height = (e.data.height + 5) + 'px';
      }
    }
  });
  
  // Disable tracking and analytics requests to avoid CORS issues
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    
    xhr.open = function() {
      const url = arguments[1];
      // Skip requests to analytics/tracking endpoints that might cause CORS issues
      if (typeof url === 'string' && (
          url.includes('/cdn-cgi/rum') || 
          url.includes('dash.immoupload.com')
      )) {
        // Cancel the request by pointing it to a data URL
        arguments[1] = 'data:text/plain,{}';
      }
      return originalOpen.apply(this, arguments);
    };
    
    return xhr;
  };
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
})();
