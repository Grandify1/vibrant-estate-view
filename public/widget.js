
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
  
  // Container-Style direkt setzen für Modals
  container.style.overflow = 'visible';
  container.style.position = 'relative';
  
  // Iframe erstellen
  const iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/embed';
  iframe.style.width = widgetWidth;
  iframe.style.border = 'none';
  iframe.style.minHeight = '500px'; // Optimale Anfangshöhe
  iframe.style.maxWidth = '100%';
  iframe.style.overflow = 'visible'; // Erlaubt Overflow für den Dialog
  iframe.id = 'immo-widget-iframe';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('title', 'Immobilien Übersicht');
  
  // Iframe zum Container hinzufügen
  container.appendChild(iframe);
  
  // Flag für Dialog-Status
  let isDialogOpen = false;
  
  // Modal container für absolute positioning erstellen
  const modalContainer = document.createElement('div');
  modalContainer.id = 'immo-widget-modal-container';
  modalContainer.style.display = 'none';
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.zIndex = '999999';
  modalContainer.style.pointerEvents = 'none'; // Durchsichtig für Klicks
  document.body.appendChild(modalContainer);
  
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
      // Keine Höhenanpassung wenn Dialog geöffnet ist, um Springen zu vermeiden
      if (isDialogOpen) return;
      
      // Doppelte Höhenaktualisierungen vermeiden
      if (lastHeight === e.data.height) return;
      lastHeight = e.data.height;
      
      // Resize-Events reduzieren (Debouncing)
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const iframe = document.getElementById('immo-widget-iframe');
        if (iframe) {
          // Minimale Höhe setzen ohne großen Buffer
          iframe.style.height = (e.data.height + 20) + 'px';
        }
      }, 50);
    }
    
    // Spezieller Event-Typ für Dialog-Öffnung
    if (e.data && e.data.type === 'dialog-opened') {
      isDialogOpen = true;
      
      // Wenn Dialog geöffnet ist, das Modal aktivieren
      const modalContainer = document.getElementById('immo-widget-modal-container');
      if (modalContainer) {
        modalContainer.style.display = 'block';
        modalContainer.style.pointerEvents = 'auto'; // Aktiviere Interaktion
      }

      // Modalen Hintergrund hinzufügen
      const modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'immo-widget-modal-backdrop';
      modalBackdrop.style.position = 'fixed';
      modalBackdrop.style.top = '0';
      modalBackdrop.style.left = '0';
      modalBackdrop.style.width = '100%';
      modalBackdrop.style.height = '100%';
      modalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modalBackdrop.style.zIndex = '9998';
      document.body.style.overflow = 'hidden'; // Body Scroll verhindern
      document.body.appendChild(modalBackdrop);
      
      // Alle scroll locks aufheben
      document.querySelectorAll('html, body, #root, [id^="__"], [class*="container"]').forEach(el => {
        if (el) {
          if (!el.dataset.originalOverflow) {
            el.dataset.originalOverflow = el.style.overflow || '';
          }
          el.style.overflow = 'visible';
        }
      });
    }
    
    if (e.data && e.data.type === 'dialog-closed') {
      isDialogOpen = false;
      
      // Modalen Container deaktivieren
      const modalContainer = document.getElementById('immo-widget-modal-container');
      if (modalContainer) {
        modalContainer.style.display = 'none';
        modalContainer.style.pointerEvents = 'none';
      }
      
      // Modalen Hintergrund entfernen
      const modalBackdrop = document.getElementById('immo-widget-modal-backdrop');
      if (modalBackdrop && modalBackdrop.parentNode) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
      
      document.body.style.overflow = ''; // Body Scroll wiederherstellen
      
      // Styles zurücksetzen mit Verzögerung
      setTimeout(() => {
        // Alle scroll locks zurücksetzen
        document.querySelectorAll('html, body, #root, [id^="__"], [class*="container"]').forEach(el => {
          if (el && el.dataset.originalOverflow !== undefined) {
            el.style.overflow = el.dataset.originalOverflow;
            delete el.dataset.originalOverflow;
          }
        });
        
        // Nach Dialog-Schließung Größe neu berechnen
        const iframe = document.getElementById('immo-widget-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'parent-resize' }, '*');
        }
      }, 500);
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
    }, 300);
  });
})();
