
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmbedCodeTab: React.FC = () => {
  // Define the head script code that should be placed in the <head> of the website
  const headScriptCode = `<!-- ImmoUpload Widget Initialisierungs-Script (In den <head>-Bereich einfügen) -->
<script src="${window.location.origin}/widget.js" id="immo-widget" defer></script>
`;

  // Define the body embed code that should be placed where you want the widget to appear
  const bodyEmbedCode = `<!-- ImmoUpload Widget Container (Dort einfügen, wo das Widget erscheinen soll) -->
<div id="immo-widget-container" class="immo-widget-container"></div>
`;

  // Define the combined code for easy use
  const combinedCode = `${headScriptCode}

${bodyEmbedCode}`;

  // Define the manual initialization for advanced users
  const manualInitCode = `<!-- Manuelle Widget-Initialisierung (Für fortgeschrittene Nutzer) -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Widget mit der Container-ID initialisieren
    if (window.ImmoWidget && window.ImmoWidget.initialize) {
      window.ImmoWidget.initialize('mein-eigener-container');
    }
  });
</script>
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
        <Tabs defaultValue="standard">
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Schritt 1: Fügen Sie diesen Code im &lt;head&gt; Ihrer Website ein</p>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  <pre className="text-sm"><code>{headScriptCode}</code></pre>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(headScriptCode);
                    toast.success("Head-Script in die Zwischenablage kopiert!");
                  }}
                >
                  Head-Script kopieren
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Schritt 2: Fügen Sie diesen Code an der Stelle ein, wo die Immobilien angezeigt werden sollen</p>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  <pre className="text-sm"><code>{bodyEmbedCode}</code></pre>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(bodyEmbedCode);
                    toast.success("Container-Code in die Zwischenablage kopiert!");
                  }}
                >
                  Container-Code kopieren
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
                <p className="text-sm font-medium mb-1 text-blue-700">Wichtiger Hinweis zur Einbindung:</p>
                <p className="text-sm text-blue-600">
                  Bitte verwenden Sie unbedingt das <strong>zwei-teilige Einbindungssystem</strong>: Das Script im Head-Bereich
                  lädt den Widget-Code, der Container im Body-Bereich zeigt die Immobilien an. Dies ist entscheidend für eine korrekte
                  Darstellung in allen Umgebungen.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Kompletter Code (alles zusammen)</p>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  <pre className="text-sm"><code>{combinedCode}</code></pre>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(combinedCode);
                    toast.success("Kompletten Code in die Zwischenablage kopiert!");
                  }}
                >
                  Kompletten Code kopieren
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Manuelle Initialisierung (für fortgeschrittene Nutzer)</p>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  <pre className="text-sm"><code>{manualInitCode}</code></pre>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(manualInitCode);
                    toast.success("Manuellen Initialisierungscode in die Zwischenablage kopiert!");
                  }}
                >
                  Manuellen Code kopieren
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">Widget Information:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Fügt ein responsives Widget ein, das sich automatisch an die Höhe des Inhalts anpasst</li>
            <li>Funktioniert auf allen Websites ohne Kompatibilitätsprobleme</li>
            <li>Optimiert für Mobilgeräte und Desktop</li>
            <li>Modals werden direkt am Body-Element angehängt für maximale Kompatibilität</li>
            <li>Verwendet ein zwei-teiliges Einbindungssystem für optimale Kompatibilität mit Baukastensystemen</li>
          </ul>
        </div>
        <div className="mt-4">
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
          navigator.clipboard.writeText(combinedCode);
          toast.success("Kompletten Code in die Zwischenablage kopiert!");
        }}>
          In Zwischenablage kopieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeTab;
