
/**
 * ImmoUpload Widget
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 2.2 - Two-Part Embed System mit verbesserten Portal-Handling
 */
(function() {
  // Globales Objekt für das Widget erstellen
  window.ImmoWidget = window.ImmoWidget || {};
  
  // Widget bereits initialisiert?
  if (window.ImmoWidget.initialized) return;
  
  // Warten auf DOM Content Loaded
  function domReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  
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
  
  // Initialisierung des Portals und der Event-Handler
  domReady(function() {
    // Portal Container erstellen - für Modals und Dialoge
    let portalContainer = document.getElementById(portalId);
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = portalId;
      portalContainer.style.position = 'fixed';
      portalContainer.style.zIndex = '9999999'; // Extrem hoher z-index
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.width = '100vw'; // Wichtig: verwende viewport width
      portalContainer.style.height = '100vh'; // Wichtig: verwende viewport height
      portalContainer.style.overflow = 'visible';
      portalContainer.style.pointerEvents = 'none';
      portalContainer.style.display = 'none';
      
      // Container erst nach DOM-Ready einfügen
      if (document.body) {
        document.body.appendChild(portalContainer);
      } else {
        // Falls body noch nicht verfügbar ist (unwahrscheinlich nach domReady)
        document.addEventListener('DOMContentLoaded', function() {
          document.body.appendChild(portalContainer);
        });
      }
    }
    
    // Globale Styles hinzufügen, die für Modals benötigt werden
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      /* ImmoWidget Portal Styles */
      #${portalId} {
        --immo-modal-z-index: 9999999;
      }
      
      #${portalId}[data-modal-open="true"] {
        pointer-events: auto;
      }
      
      .immo-widget-iframe {
        width: 100%;
        border: none;
        transition: height 0.3s ease;
      }
      
      /* Verhindert Konflikte mit Website-Modals */
      body[data-immo-modal-open="true"] .immo-widget-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: var(--immo-modal-z-index);
      }
    `;
    document.head.appendChild(styleTag);
  });
  
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
      const portalContainer = document.getElementById(portalId);
      if (portalContainer) {
        portalContainer.style.display = 'block';
        portalContainer.style.pointerEvents = 'auto';
        portalContainer.setAttribute('data-modal-open', 'true');
      }
      
      // Body Scroll Lock anwenden
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      document.body.setAttribute('data-immo-modal-open', 'true');
      
      // Backdrop für Mobile hinzufügen (falls noch nicht vorhanden)
      let backdrop = document.querySelector('.immo-widget-modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'immo-widget-modal-backdrop';
        document.body.appendChild(backdrop);
      }
      
      // Alle scroll locks aufheben in der Übersicht
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
      const portalContainer = document.getElementById(portalId);
      if (portalContainer) {
        portalContainer.style.pointerEvents = 'none';
        portalContainer.removeAttribute('data-modal-open');
        setTimeout(() => {
          if (!isDialogOpen && portalContainer) {
            portalContainer.style.display = 'none';
          }
        }, 300);
      }
      
      // Body Scroll wiederherstellen
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.removeAttribute('data-immo-modal-open');
      
      // Backdrop entfernen wenn vorhanden
      const backdrop = document.querySelector('.immo-widget-modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
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
    // Sicherstellen dass DOM geladen ist
    domReady(function() {
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
      iframe.className = 'immo-widget-iframe';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('title', 'Immobilien Übersicht');
      iframe.setAttribute('loading', 'lazy');
      
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
    });
  };
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  
  // Automatisch alle Container mit der Klasse "immo-widget-container" initialisieren
  domReady(function() {
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
