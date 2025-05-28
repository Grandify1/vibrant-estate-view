import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const EmbedCodeTab: React.FC = () => {
  const { company } = useAuth();
  const [copied, setCopied] = useState(false);
  const [embedTab, setEmbedTab] = useState('single-script');
  
  // Die Firmen-ID als Parameter für das Embed-Skript
  const companyParam = company ? company.id : '';
  
  // WICHTIG: Feste Domain für Production - IMMER immoupload.com
  const WIDGET_BASE_URL = 'https://immoupload.com';
  
  // Das Auto-Resize Embed-Skript mit korrekter Domain
  const singleScriptCode = `<!-- Immobilien-Widget mit Auto-Resize Start -->
<div id="immo-widget-container" class="immo-widget-container"></div>
<script>
(function() {
  const script = document.createElement('script');
  script.src = '${WIDGET_BASE_URL}/widget.js';
  script.setAttribute('data-company', '${companyParam}');
  script.onload = function() {
    console.log('ImmoWidget script loaded successfully from ${WIDGET_BASE_URL}');
  };
  script.onerror = function() {
    console.error('Failed to load ImmoWidget script from:', script.src);
  };
  document.head.appendChild(script);
})();
</script>
<!-- Immobilien-Widget Ende -->`;
  
  // Funktion zum Kopieren des Codes
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code in die Zwischenablage kopiert!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Fehler beim Kopieren:', err);
        toast.error("Fehler beim Kopieren in die Zwischenablage");
      });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Website-Integration mit Auto-Resize</h2>
        <p className="text-gray-700 mb-4">
          Das Widget lädt von <strong>immoupload.com</strong> und funktioniert auf jeder Kundenwebsite!
        </p>
        
        <Tabs value={embedTab} onValueChange={setEmbedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="single-script">Auto-Resize Widget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single-script">
            <Card className="p-4 bg-gray-900 text-gray-200 font-mono text-sm overflow-x-auto rounded">
              <pre className="whitespace-pre-wrap break-all">{singleScriptCode}</pre>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => copyCode(singleScriptCode)} 
            variant={copied ? "secondary" : "default"}
            className="min-w-[120px]"
          >
            {copied ? "Kopiert!" : "Code kopieren"}
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Domain-Setup für Kunden</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li><strong>Widget lädt IMMER von immoupload.com:</strong> Keine 404-Fehler mehr</li>
          <li><strong>Funktioniert auf jeder Domain:</strong> Keine Konfiguration nötig</li>
          <li><strong>Sichere Cross-Origin-Kommunikation:</strong> Nur von immoupload.com erlaubt</li>
          <li><strong>Automatische Firmen-ID:</strong> Wird automatisch übertragen</li>
          <li><strong>Keine lokalen Abhängigkeiten:</strong> Alles wird zentral geladen</li>
        </ul>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Vorteile des Auto-Resize Systems</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Dynamische Höhe:</strong> Widget passt sich automatisch an 0-X Immobilien an</li>
          <li><strong>Kein Whitespace:</strong> Keine leeren Bereiche unter den Immobilien</li>
          <li><strong>Keine abgeschnittenen Karten:</strong> Alle Immobilien werden vollständig angezeigt</li>
          <li><strong>Responsive Design:</strong> Funktioniert auf allen Geräten perfekt</li>
          <li><strong>Smooth Transitions:</strong> Sanfte Übergänge bei Größenänderungen</li>
          <li><strong>Echte Content-Höhe:</strong> Berechnet die tatsächliche Höhe des Inhalts</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Technische Details</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>Das Widget verwendet PostMessage API für sichere Cross-Origin-Kommunikation</li>
          <li>Die Höhe wird automatisch berechnet und an das Parent-Window gesendet</li>
          <li>Reagiert auf Fenster-Größenänderungen und passt sich entsprechend an</li>
          <li>Minimaler JavaScript-Overhead für optimale Performance</li>
          <li>Automatischer Fallback bei Ladeproblemen</li>
        </ul>
      </div>
    </div>
  );
};

export default EmbedCodeTab;
