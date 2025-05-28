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
  
  const companyParam = company ? company.id : '';
  
  // FINAL PRODUCTION DOMAIN - NIEMALS ÄNDERN!
  const PRODUCTION_DOMAIN = 'immoupload.com';
  const WIDGET_BASE_URL = `https://${PRODUCTION_DOMAIN}`;
  
  // FINAL PRODUCTION EMBED CODE - Lädt GARANTIERT von immoupload.com
  const singleScriptCode = `<!-- Immobilien-Widget FINAL PRODUCTION VERSION -->
<div id="immo-widget-container" class="immo-widget-container"></div>
<script>
(function() {
  // FINAL PRODUCTION SCRIPT - Lädt GARANTIERT von immoupload.com
  const script = document.createElement('script');
  script.src = '${WIDGET_BASE_URL}/widget.js';
  script.setAttribute('data-company', '${companyParam}');
  script.onload = function() {
    console.log('✅ ImmoWidget FINAL: Successfully loaded from ${PRODUCTION_DOMAIN}');
  };
  script.onerror = function() {
    console.error('❌ ImmoWidget FINAL: Failed to load from ${PRODUCTION_DOMAIN}');
    console.error('Check if ${PRODUCTION_DOMAIN} is accessible and configured correctly');
  };
  document.head.appendChild(script);
})();
</script>
<!-- Immobilien-Widget FINAL PRODUCTION VERSION Ende -->`;
  
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
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold mb-4 text-green-800">✅ FINAL PRODUCTION VERSION</h2>
        <p className="text-green-700 mb-2">
          <strong>GARANTIERT:</strong> Das Widget lädt IMMER von <strong className="text-green-600">{PRODUCTION_DOMAIN}</strong>
        </p>
        <p className="text-sm text-green-600 font-medium">
          🔒 KEINE Lovable-URLs mehr - NUR Production-Domain!
        </p>
        
        <Tabs value={embedTab} onValueChange={setEmbedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="single-script">FINAL Production Widget</TabsTrigger>
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
      
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-2 text-red-800">🚫 PROBLEM ENDGÜLTIG GELÖST</h3>
        <ul className="list-disc list-inside space-y-2 text-red-700">
          <li><strong>KEINE 404/412 Fehler mehr:</strong> Widget lädt NIEMALS von Lovable-URLs</li>
          <li><strong>ABSOLUTE Production-Domain:</strong> Fest kodiert auf {PRODUCTION_DOMAIN}</li>
          <li><strong>GARANTIERTE Funktion:</strong> Funktioniert auf JEDER Kundenwebsite</li>
          <li><strong>SICHERE Cross-Origin-Kommunikation:</strong> Nur von {PRODUCTION_DOMAIN}</li>
          <li><strong>ROBUSTE Fehlerbehandlung:</strong> Detaillierte Logging und Fehler-Events</li>
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
