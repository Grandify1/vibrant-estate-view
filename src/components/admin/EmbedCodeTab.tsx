
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EmbedCodeTab: React.FC = () => {
  // Define the embed code with dynamic height adjustment using JavaScript Widget
  const embedCode = `<!-- ImmoUpload Widget -->
<div id="immo-widget-container"></div>
<script src="${window.location.origin}/widget.js" id="immo-widget" data-height="auto" data-width="100%"></script>
`;

  // Define the JavaScript widget code for reference
  const widgetCode = `
(function() {
  // Widget configuration
  const script = document.getElementById('immo-widget');
  const container = document.getElementById('immo-widget-container');
  const baseUrl = script.src.split('/widget.js')[0];
  const widgetHeight = script.getAttribute('data-height') || 'auto';
  const widgetWidth = script.getAttribute('data-width') || '100%';
  
  // Create widget iframe
  const iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/embed';
  iframe.style.width = widgetWidth;
  iframe.style.border = 'none';
  iframe.style.minHeight = '500px';
  iframe.style.maxWidth = '100%';
  iframe.id = 'immo-widget-iframe';
  iframe.setAttribute('scrolling', 'no');
  container.appendChild(iframe);
  
  // Handle resize messages from iframe content
  let resizeTimeout;
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'resize-iframe') {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const iframe = document.getElementById('immo-widget-iframe');
        if (iframe) {
          // Add a small buffer to avoid scrollbars
          iframe.style.height = (e.data.height + 20) + 'px';
        }
      }, 50);
    }
  });
  
  // Handle window resize events
  let windowResizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(windowResizeTimeout);
    windowResizeTimeout = setTimeout(() => {
      // Trigger a recalculation in the iframe
      const iframe = document.getElementById('immo-widget-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'parent-resize' }, '*');
      }
    }, 100);
  });
})();
`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Kopieren Sie diesen Code und fügen Sie ihn auf Ihrer Website ein, um die Immobilienübersicht anzuzeigen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md overflow-auto">
          <pre className="text-sm"><code>{embedCode}</code></pre>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Widget Information:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Fügt ein responsives Widget ein, das sich automatisch an die Höhe des Inhalts anpasst</li>
            <li>Funktioniert auf allen Websites ohne Kompatibilitätsprobleme</li>
            <li>Optimiert für Mobilgeräte und Desktop</li>
            <li>Keine zusätzlichen Abhängigkeiten erforderlich</li>
          </ul>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Widget-Anpassungen:</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <code className="text-xs">
              data-height="auto" {/* Standard: automatisch anpassen */}<br/>
              data-width="100%" {/* Standard: volle Breite */}
            </code>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          navigator.clipboard.writeText(embedCode);
          toast.success("Code in die Zwischenablage kopiert!");
        }}>
          In Zwischenablage kopieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeTab;
