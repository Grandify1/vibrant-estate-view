
/**
 * ImmoUpload Widget - Vereinfachte Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 3.2
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
    
    // Nach dem Laden eine erste Höhenanpassung vornehmen
    iframe.addEventListener('load', function() {
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded');
      document.dispatchEvent(event);
      
      // Warten bis das iframe vollständig geladen ist
      setTimeout(() => {
        adjustIframeHeight(iframe);
        
        // Periodisch die Höhe anpassen
        const heightInterval = setInterval(() => {
          adjustIframeHeight(iframe);
        }, 2000);
        
        // Clean up interval nach 30 Sekunden
        setTimeout(() => {
          clearInterval(heightInterval);
        }, 30000);
      }, 1000);
    });
  }
  
  // Funktion zur Höhenanpassung des Iframes - sicherheitsorientiert
  function adjustIframeHeight(iframe) {
    try {
      // Prüfe ob iframe und contentWindow verfügbar sind
      if (!iframe || !iframe.contentWindow) {
        console.log('Iframe oder contentWindow nicht verfügbar');
        return;
      }
      
      // Versuche Zugriff auf das iframe-Dokument
      const iframeDoc = iframe.contentWindow.document;
      if (!iframeDoc || !iframeDoc.body) {
        console.log('Iframe-Dokument oder body nicht verfügbar');
        return;
      }
      
      const height = iframeDoc.body.scrollHeight;
      if (height && height > 100) {
        iframe.style.height = height + 'px';
        console.log('Iframe-Höhe angepasst:', height + 'px');
      }
    } catch (e) {
      // Cross-Origin-Fehler abfangen
      console.log('Cross-Origin-Einschränkung - automatische Größenanpassung deaktiviert');
      
      // Post-Message als Alternative verwenden
      try {
        iframe.contentWindow.postMessage({ type: 'request-height' }, '*');
      } catch (postMessageError) {
        console.log('Post-Message ebenfalls blockiert');
      }
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
    // Sicherheits-Check - erlauben Sie auch die Produktions-Domain
    const allowedOrigins = [
      'https://immoupload.com',
      'https://immoupload.lovable.app',
      'https://kmzlkfwxeghvlgtilzjh.supabase.co',
      'https://as-immobilien.info'
    ];
    
    // Prüfen, ob die Ursprungs-Domain erlaubt ist
    if (!allowedOrigins.some(origin => e.origin.includes(origin)) && 
        !e.origin.includes('localhost') && 
        !e.origin.includes('127.0.0.1')) {
      return;
    }
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && e.data.height) {
        iframe.style.height = e.data.height + 'px';
        console.log('Iframe-Höhe via Post-Message angepasst:', e.data.height + 'px');
      }
    }
    
    // Handling für externe Links aus dem iframe
    if (e.data && e.data.type === 'external-link') {
      if (e.data.url) {
        window.open(e.data.url, '_blank');
      }
    }
  });
  
  // Fix für drawHighlights-Fehler
  window.drawHighlights = window.drawHighlights || function() {
    console.log('drawHighlights-Fallback aufgerufen');
    // Leere Fallback-Funktion, um Fehler zu vermeiden
  };
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
})();
