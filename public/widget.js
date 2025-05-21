
/**
 * ImmoUpload Widget
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 */
(function() {
  // Widget Konfiguration auslesen
  const script = document.getElementById('immo-widget');
  const container = document.getElementById('immo-widget-container');
  
  // Basis-URL ermitteln (woher das Script geladen wurde)
  const baseUrl = script.src.split('/widget.js')[0];
  
  // Konfigurationsoptionen
  const widgetHeight = script.getAttribute('data-height') || 'auto';
  const widgetWidth = script.getAttribute('data-width') || '100%';
  
  // Fehlerbehandlung: Container prüfen
  if (!container) {
    console.error('ImmoUpload Widget: Container mit ID "immo-widget-container" nicht gefunden.');
    return;
  }
  
  // Iframe erstellen
  const iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/embed';
  iframe.style.width = widgetWidth;
  iframe.style.border = 'none';
  iframe.style.minHeight = '600px'; // Erhöhte Mindesthöhe für bessere Darstellung
  iframe.style.maxWidth = '100%';
  iframe.style.overflow = 'hidden';
  iframe.id = 'immo-widget-iframe';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('title', 'Immobilien Übersicht');
  
  // Iframe zum Container hinzufügen
  container.appendChild(iframe);
  
  // Höhenanpassung durch Nachrichtenaustausch
  let resizeTimeout;
  let lastHeight = 0;
  
  window.addEventListener('message', function(e) {
    // Sicherheits-Check: Origin überprüfen
    if (e.origin !== baseUrl && baseUrl !== '') {
      // Toleranter Modus für lokale Entwicklung
      if (!baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
        console.warn('ImmoUpload Widget: Nachricht von nicht vertrauenswürdiger Quelle ignoriert.');
        return;
      }
    }
    
    if (e.data && e.data.type === 'resize-iframe') {
      // Doppelte Höhenaktualisierungen vermeiden
      if (lastHeight === e.data.height) return;
      lastHeight = e.data.height;
      
      // Resize-Events reduzieren (Debouncing)
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const iframe = document.getElementById('immo-widget-iframe');
        if (iframe) {
          // Puffer hinzufügen, um Scrollbars zu vermeiden
          // Größerer Puffer für Detail-Ansichten
          const newHeight = Math.max(e.data.height + 40, 600);
          iframe.style.height = newHeight + 'px';
          
          // Event auslösen, damit die Website auf die Größenänderung reagieren kann
          const event = new CustomEvent('immo-widget-resize', { 
            detail: { height: newHeight }
          });
          document.dispatchEvent(event);
          
          console.log('ImmoUpload Widget: Höhe angepasst auf ' + newHeight + 'px');
        }
      }, 50);
    }
  });
  
  // Fenstergrößenänderungen behandeln
  let windowResizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(windowResizeTimeout);
    windowResizeTimeout = setTimeout(() => {
      // Neuberechnung im Iframe auslösen
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'parent-resize' }, '*');
      }
    }, 100);
  });
  
  // Ereignis auslösen, wenn Widget fertig geladen ist
  iframe.addEventListener('load', function() {
    // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
    const event = new CustomEvent('immo-widget-loaded');
    document.dispatchEvent(event);
    
    // Nach dem Laden eine erste Höhenanpassung vornehmen
    setTimeout(() => {
      iframe.contentWindow.postMessage({ type: 'parent-resize' }, '*');
    }, 500);
  });
})();
