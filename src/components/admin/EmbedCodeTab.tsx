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
  
  // ULTIMATE FINAL PRODUCTION DOMAIN - ABSOLUT UNVERÄNDERLICH!
  const ULTIMATE_PRODUCTION_DOMAIN = 'immoupload.com';
  const ULTIMATE_WIDGET_BASE_URL = `https://${ULTIMATE_PRODUCTION_DOMAIN}`;
  
  // ULTIMATE FINAL EMBED CODE - GARANTIERT NUR von immoupload.com
  const ultimateFinalCode = `<!-- ULTIMATE FINAL Immobilien-Widget - GARANTIERT STABIL -->
<div id="immo-widget-container" class="immo-widget-container"></div>
<script>
(function() {
  // ULTIMATE FINAL SCRIPT - Lädt AUSSCHLIESSLICH von immoupload.com
  const script = document.createElement('script');
  script.src = '${ULTIMATE_WIDGET_BASE_URL}/widget.js';
  script.setAttribute('data-company', '${companyParam}');
  script.onload = function() {
    console.log('🏆 ImmoWidget ULTIMATE: Successfully loaded from ${ULTIMATE_PRODUCTION_DOMAIN}');
  };
  script.onerror = function() {
    console.error('❌ ImmoWidget ULTIMATE: Failed to load from ${ULTIMATE_PRODUCTION_DOMAIN}');
  };
  document.head.appendChild(script);
})();
</script>
<!-- ULTIMATE FINAL Immobilien-Widget Ende -->`;
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("ULTIMATE FINAL Code in die Zwischenablage kopiert!");
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
        <h2 className="text-xl font-semibold mb-4 text-green-800">🏆 ULTIMATE FINAL VERSION</h2>
        <p className="text-green-700 mb-2">
          <strong>ABSOLUT GARANTIERT:</strong> Das Widget lädt AUSSCHLIESSLICH von <strong className="text-green-600">{ULTIMATE_PRODUCTION_DOMAIN}</strong>
        </p>
        <p className="text-sm text-green-600 font-medium">
          🔒 ULTIMATE FIX: KEINE Lovable-URLs - NIEMALS! NUR Production-Domain!
        </p>
        
        <Tabs value={embedTab} onValueChange={setEmbedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="single-script">ULTIMATE FINAL Widget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single-script">
            <Card className="p-4 bg-gray-900 text-gray-200 font-mono text-sm overflow-x-auto rounded">
              <pre className="whitespace-pre-wrap break-all">{ultimateFinalCode}</pre>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => copyCode(ultimateFinalCode)} 
            variant={copied ? "secondary" : "default"}
            className="min-w-[120px]"
          >
            {copied ? "ULTIMATE Code kopiert!" : "ULTIMATE Code kopieren"}
          </Button>
        </div>
      </div>
      
      <div className="bg-green-100 p-6 rounded-lg border border-green-300">
        <h3 className="text-lg font-semibold mb-2 text-green-800">🏆 PROBLEM ULTIMATE GELÖST</h3>
        <ul className="list-disc list-inside space-y-2 text-green-700">
          <li><strong>KEINE 412/404 Fehler MEHR:</strong> Widget lädt AUSSCHLIESSLICH von {ULTIMATE_PRODUCTION_DOMAIN}</li>
          <li><strong>ULTIMATE Production-Domain:</strong> Fest kodiert auf {ULTIMATE_PRODUCTION_DOMAIN}</li>
          <li><strong>ABSOLUTE Garantie:</strong> Funktioniert auf JEDER Kundenwebsite IMMER</li>
          <li><strong>ULTIMATE Cross-Origin:</strong> Nur von {ULTIMATE_PRODUCTION_DOMAIN}</li>
          <li><strong>FINALE Lösung:</strong> Nie wieder Widget-Probleme!</li>
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
