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
  
  // KRITISCH: Feste Production-Domain - NIEMALS ändern!
  const PRODUCTION_DOMAIN = 'immoupload.com';
  const WIDGET_BASE_URL = `https://${PRODUCTION_DOMAIN}`;
  
  // Das Auto-Resize Embed-Skript mit fester Production-Domain
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
    console.error('Check if ${PRODUCTION_DOMAIN} is accessible');
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
        <p className="text-gray-700 mb-2">
          Das Widget lädt von <strong className="text-green-600">{PRODUCTION_DOMAIN}</strong> und funktioniert auf jeder Kundenwebsite!
        </p>
        <p className="text-sm text-blue-600 font-medium">
          ✅ Garantiert: Lädt IMMER von der festen Production-Domain
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
      
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold mb-2 text-green-800">🔧 PROBLEM GELÖST - Feste Domain!</h3>
        <ul className="list-disc list-inside space-y-2 text-green-700">
          <li><strong>Widget lädt IMMER von {PRODUCTION_DOMAIN}:</strong> Keine 404-Fehler mehr</li>
          <li><strong>Feste Production-Domain:</strong> Unabhängig von Lovable-URLs</li>
          <li><strong>Funktioniert auf jeder Kundenwebsite:</strong> Keine Domain-Probleme</li>
          <li><strong>Sichere Cross-Origin-Kommunikation:</strong> Nur von {PRODUCTION_DOMAIN} erlaubt</li>
          <li><strong>Automatische Firmen-ID:</strong> Wird automatisch übertragen</li>
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
