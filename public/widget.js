
/**
 * ImmoUpload Widget
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 2.0 - Two-Part Embed System
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
  
  // Definitionen für Portal-Verwaltung
  const portalId = 'immo-widget-portal-container';
  
  // Portal Container erstellen - für Modals und Dialoge
  let portalContainer = document.getElementById(portalId);
  if (!portalContainer) {
    portalContainer = document.createElement('div');
    portalContainer.id = portalId;
    portalContainer.style.position = 'fixed';
    portalContainer.style.zIndex = '999999';
    portalContainer.style.top = '0';
    portalContainer.style.left = '0';
    portalContainer.style.width = '100%';
    portalContainer.style.height = '100%';
    portalContainer.style.overflow = 'visible';
    portalContainer.style.pointerEvents = 'none';
    portalContainer.style.display = 'none';
    document.body.appendChild(portalContainer);
  }
  
  // Flag für Dialog-Status
  let isDialogOpen = false;
  
  // Globale Event-Handler für Nachrichtenaustausch
  window.addEventListener('message', function(e) {
    // Sicherheits-Check: Origin für lokale Entwicklung toleranter behandeln
    if (e.origin !== baseUrl && baseUrl !== '') {
      if (!baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
        // Nur im Produktionsmodus strikt prüfen
        console.warn('ImmoWidget: Nachricht von nicht vertrauenswürdiger Quelle ignoriert.');
        return;
      }
    }
    
    // Behandlung von Resize-Events für das iframe
    if (e.data && e.data.type === 'resize-iframe') {
      // Keine Höhenanpassung wenn Dialog geöffnet ist, um Springen zu vermeiden
      if (isDialogOpen) return;
      
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe) {
        iframe.style.height = (e.data.height + 5) + 'px';
      }
    }
    
    // Behandlung Dialog geöffnet
    if (e.data && e.data.type === 'dialog-opened') {
      isDialogOpen = true;
      
      // Portal-Container aktivieren
      portalContainer.style.display = 'block';
      portalContainer.style.pointerEvents = 'auto';
      
      // Body Scroll Lock anwenden
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      // Alle scroll locks aufheben in der Übersiecht
      document.querySelectorAll('html, body, #root, [id^="__"], [class*="container"]').forEach(el => {
        if (el) {
          if (!el.dataset.originalOverflow) {
            el.dataset.originalOverflow = el.style.overflow || '';
            el.dataset.originalPosition = el.style.position || '';
          }
          el.style.overflow = 'visible';
        }
      });
    }
    
    // Behandlung Dialog geschlossen
    if (e.data && e.data.type === 'dialog-closed') {
      isDialogOpen = false;
      
      // Portal-Container deaktivieren
      portalContainer.style.pointerEvents = 'none';
      setTimeout(() => {
        if (!isDialogOpen) {
          portalContainer.style.display = 'none';
        }
      }, 300);
      
      // Body Scroll wiederherstellen
      document.body.style.overflow = '';
      document.body.style.position = '';
      
      // Styles zurücksetzen mit Verzögerung
      setTimeout(() => {
        // Alle scroll locks zurücksetzen
        document.querySelectorAll('html, body, #root, [id^="__"], [class*="container"]').forEach(el => {
          if (el) {
            if (el.dataset.originalOverflow !== undefined) {
              el.style.overflow = el.dataset.originalOverflow;
              el.style.position = el.dataset.originalPosition || '';
              delete el.dataset.originalOverflow;
              delete el.dataset.originalPosition;
            }
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
  
  // Initialisierungsfunktion für das Widget
  window.ImmoWidget.initialize = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('ImmoUpload Widget: Container mit ID "' + containerId + '" nicht gefunden.');
      return;
    }
    
    // Container-Style setzen
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/embed';
    iframe.style.width = widgetWidth;
    iframe.style.border = 'none';
    iframe.style.minHeight = '500px';
    iframe.style.maxWidth = '100%';
    iframe.id = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    // Nach dem Laden eine erste Höhenanpassung vornehmen
    iframe.addEventListener('load', function() {
      // Event auslösen, damit die Website weiß, dass das Widget geladen wurde
      const event = new CustomEvent('immo-widget-loaded');
      document.dispatchEvent(event);
      
      setTimeout(() => {
        iframe.contentWindow.postMessage({ type: 'parent-resize' }, '*');
      }, 300);
    });
  };
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  
  // Automatisch alle Container mit der Klasse "immo-widget-container" initialisieren
  document.addEventListener('DOMContentLoaded', function() {
    const autoContainers = document.querySelectorAll('.immo-widget-container');
    autoContainers.forEach(function(container, index) {
      const containerId = container.id || 'immo-widget-container-' + index;
      if (!container.id) {
        container.id = containerId;
      }
      window.ImmoWidget.initialize(containerId);
    });
  });
})();
