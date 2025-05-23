
/**
 * ImmoUpload Widget - Production Version
 * Dynamisches Widget zur Einbindung von Immobilienübersichten
 * Version 5.0 - PostMessage Auto-Resize
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
    container.style.overflow = 'visible';
    container.style.position = 'relative';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.width = '100%';
    
    // CSS für Widget einfügen
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .property-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .property-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .immo-widget-iframe {
        border: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        transition: height 0.3s ease !important;
      }
      .immo-widget-container {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Iframe URL zusammenstellen
    let iframeUrl = script.getAttribute('data-url') || (baseUrl + '/embed');
    
    // Company-ID hinzufügen wenn vorhanden
    if (script.getAttribute('data-company') && !iframeUrl.includes('company=') && !iframeUrl.includes('companyId=')) {
      const separator = iframeUrl.includes('?') ? '&' : '?';
      iframeUrl += `${separator}company=${script.getAttribute('data-company')}`;
    }
    
    // Iframe erstellen
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.height = '400px'; // Initial height
    iframe.style.overflow = 'visible';
    iframe.style.transition = 'height 0.3s ease';
    iframe.id = 'immo-widget-iframe';
    iframe.className = 'immo-widget-iframe';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Immobilien Übersicht');
    iframe.setAttribute('loading', 'eager');
    
    // Iframe zum Container hinzufügen
    container.appendChild(iframe);
    
    // Load Event Handler
    iframe.addEventListener('load', function() {
      const event = new CustomEvent('immo-widget-loaded', {
        detail: {
          iframeUrl: iframeUrl,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
    });
  }
  
  // DOM Ready Check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initWidget();
    });
  } else {
    initWidget();
  }
  
  // PostMessage Event Handler für Auto-Resize
  window.addEventListener('message', function(event) {
    // Erweiterte Sicherheits-Checks
    const allowedOrigins = [
      'https://immoupload.com',
      'https://immoupload.lovable.app',
      'https://kmzlkfwxeghvlgtilzjh.supabase.co',
      'https://as-immobilien.info',
      window.location.origin
    ];
    
    // Prüfen, ob die Ursprungs-Domain erlaubt ist
    const originAllowed = allowedOrigins.some(origin => event.origin.includes(origin)) || 
                         event.origin.includes('localhost') || 
                         event.origin.includes('127.0.0.1') ||
                         event.origin.includes('lovableproject.com');
    
    if (!originAllowed) {
      return;
    }
    
    // Auto-Resize Handler
    if (event.data && event.data.type === 'RESIZE_IFRAME') {
      const iframe = document.getElementById('immo-widget-iframe');
      const container = document.getElementById('immo-widget-container');
      
      if (iframe && event.data.height) {
        console.log('Resizing iframe to height:', event.data.height);
        
        // Setze iframe und container Höhe
        iframe.style.height = event.data.height + 'px';
        
        if (container) {
          container.style.height = event.data.height + 'px';
        }
      }
    }
    
    // Handling für externe Links
    if (event.data && event.data.type === 'external-link') {
      if (event.data.url) {
        window.open(event.data.url, '_blank');
      }
    }
  });
  
  // Widget als initialisiert markieren
  window.ImmoWidget.initialized = true;
  window.ImmoWidget.version = '5.0';
})();
