
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
  const companyParam = company ? `?company=${company.id}` : '';
  
  // Das Basis-URL für das Embed-Widget
  const baseUrl = window.location.origin;
  const widgetUrl = `${baseUrl}/embed${companyParam}`;
  
  // Das Embed-Skript für den Einzeiler
  const singleScriptCode = `<script src="${baseUrl}/widget.js" data-target="immo-widget" data-url="${widgetUrl}"></script>
<div id="immo-widget-container"></div>`;
  
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
        <h2 className="text-xl font-semibold mb-4">Website-Integration</h2>
        <p className="text-gray-700 mb-4">
          Fügen Sie den folgenden Code an der Stelle ein, an der die Immobilien angezeigt werden sollen.
        </p>
        
        <Tabs value={embedTab} onValueChange={setEmbedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="single-script">Einzeiler-Script</TabsTrigger>
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
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hinweise</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Der Code erstellt ein responsives Widget, das sich automatisch an Ihre Website anpasst.</li>
          <li>Die Immobilien werden dynamisch aus Ihrem Konto geladen.</li>
          <li>Nur aktive Immobilien Ihres Unternehmens werden im Widget angezeigt.</li>
          <li>Alle Designänderungen im Admin-Bereich werden automatisch im Widget übernommen.</li>
          <li>Wenn Besucher auf eine Immobilie klicken, öffnet sich die Detailansicht in einem neuen Tab auf Ihrer Website.</li>
        </ul>
      </div>
    </div>
  );
};

export default EmbedCodeTab;
