
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EmbedCodeTab: React.FC = () => {
  // Vereinfachter Embed-Code
  const embedCode = `<!-- ImmoUpload Widget - Kopieren Sie diesen Code und fügen Sie ihn dort ein, wo Sie Immobilien darstellen möchten -->
<div id="immo-widget-container" class="immo-widget-container"></div>
<script src="${window.location.origin}/widget.js"></script>`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Fügen Sie diesen Code auf Ihrer Website ein, um die Immobilienübersicht darzustellen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-bold mb-1 text-yellow-700">WICHTIG: Hinweise zur Einbindung</p>
            <ol className="list-decimal ml-5 mt-2 text-sm text-yellow-600">
              <li>Platzieren Sie den Code an der Stelle, wo die Immobilien angezeigt werden sollen.</li>
              <li>Das Widget passt sich automatisch an die Breite des Containers an.</li>
              <li>Sie können die Höhe des Widgets über die <code>data-height</code> Eigenschaft anpassen.</li>
            </ol>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Vollständiger Code</p>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto">
              <pre className="text-sm"><code>{embedCode}</code></pre>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("Code in die Zwischenablage kopiert!");
              }}
            >
              Code kopieren
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">Widget Information:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Fügt ein responsives Widget ein, das sich automatisch an die Größe des Inhalts anpasst</li>
            <li>Funktioniert auf allen Websites ohne Kompatibilitätsprobleme</li>
            <li>Optimiert für Mobilgeräte und Desktop</li>
            <li>Links zu Immobiliendetails öffnen sich in einem neuen Tab</li>
            <li>Keine Konflikte mit vorhandenen Styles auf Ihrer Website</li>
            <li>Automatische Größenanpassung ohne Scrollbalken</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          navigator.clipboard.writeText(embedCode);
          toast.success("Code in die Zwischenablage kopiert!");
        }}>
          Code kopieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeTab;
