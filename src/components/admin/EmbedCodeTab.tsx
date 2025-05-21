
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmbedCodeTab: React.FC = () => {
  // Define the head script code that should be placed in the <head> of the website
  const headScriptCode = `<!-- ImmoUpload Widget Initialisierungs-Script (WICHTIG: In den <head>-Bereich einfügen) -->
<script src="${window.location.origin}/widget.js" id="immo-widget" defer></script>
`;

  // Define the body embed code that should be placed where you want the widget to appear
  const bodyEmbedCode = `<!-- ImmoUpload Widget Container (In den <body>-Bereich einfügen, wo das Widget erscheinen soll) -->
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
          Fügen Sie diesen Code auf Ihrer Website ein, um die Immobilienübersicht anzuzeigen.
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
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-bold mb-1 text-yellow-700">WICHTIG: Zwei-Teilige Einbindung ist erforderlich!</p>
                <p className="text-sm text-yellow-600">
                  Sie müssen unbedingt beide Code-Teile auf Ihrer Website einbinden:
                </p>
                <ol className="list-decimal ml-5 mt-2 text-sm text-yellow-600">
                  <li>Das <strong>Script im &lt;head&gt;</strong> initialisiert das Portal-System für Dialoge.</li>
                  <li>Der <strong>Container im &lt;body&gt;</strong> zeigt die eigentlichen Immobilien an.</li>
                </ol>
                <p className="text-sm text-yellow-600 mt-2">
                  Ohne diese korrekte Einbindung werden die Dialog-Fenster nicht richtig angezeigt!
                </p>
              </div>
            
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
            <li>Dialoge werden direkt am Body-Element angehängt für maximale Kompatibilität</li>
            <li>Verwendet ein erweitertes Portal-System für korrekte Dialog-Darstellung</li>
            <li>Bietet eine hohe Z-Index-Priorität, um Überlappungsprobleme zu vermeiden</li>
            <li>Automatisches Sperren des Hintergrund-Scrollings bei geöffneten Dialogen</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          navigator.clipboard.writeText(combinedCode);
          toast.success("Kompletten Code in die Zwischenablage kopiert!");
        }}>
          Kompletten Code kopieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeTab;
