
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";
import PropertyListWrapper from "@/components/admin/PropertyListWrapper";
import AgentTab from "@/components/admin/AgentTab";
import EmbedCodeTab from "@/components/admin/EmbedCodeTab";
import SettingsTab from "@/components/admin/SettingsTab";
import { toast } from "sonner";

// Property Tab Komponente 
const PropertyTab = () => {
  const { company } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Immobilien verwalten</h2>
      </div>
      
      {company?.id ? (
        <PropertyListWrapper companyId={company.id} />
      ) : (
        <div className="text-center py-8">
          <p>Kein Unternehmen gefunden. Bitte erstellen Sie zuerst ein Unternehmen.</p>
        </div>
      )}
    </div>
  );
};

export default function Admin() {
  const { isAuthenticated, loadingAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  
  // Verbesserte Authentifizierungs-Überprüfung mit Logs
  useEffect(() => {
    console.log("Admin: Auth Status:", { isAuthenticated, loadingAuth, user });
    
    if (!loadingAuth) {
      if (!isAuthenticated) {
        console.log("Admin: Nicht authentifiziert, leite zur Auth-Seite weiter");
        navigate('/auth');
      } else if (isAuthenticated && user && !user.company_id) {
        console.log("Admin: Authentifiziert aber kein Unternehmen, leite zur Unternehmenseinrichtung weiter");
        navigate('/company-setup');
      } else {
        console.log("Admin: Authentifiziert mit Unternehmen", user?.company_id);
      }
    }
  }, [isAuthenticated, loadingAuth, user, navigate]);
  
  // Verbesserte Fehlerbehandlung mit Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingAuth) {
        console.log("Admin: Authentifizierung dauert zu lange, zeige Fehler");
        setShowError(true);
      }
    }, 5000); // 5 Sekunden warten, bevor ein Fehler angezeigt wird
    
    return () => clearTimeout(timer);
  }, [loadingAuth]);
  
  // Wenn die Authentifizierung noch lädt, zeige einen verbesserten Ladebildschirm
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg font-medium text-gray-700">Authentifizierung...</p>
          
          {showError && (
            <div className="mt-6 p-4 border border-red-300 rounded bg-red-50 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="font-medium">Die Anmeldung dauert länger als erwartet</p>
              </div>
              <p className="mt-2 text-sm">Versuchen Sie, die Seite zu aktualisieren oder sich erneut anzumelden.</p>
              <button 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={() => {
                  toast.info("Weiterleitung zur Anmeldeseite...");
                  navigate('/auth');
                }}
              >
                Zur Anmeldeseite
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Wenn der Nutzer nicht eingeloggt ist, zur Auth-Seite weiterleiten
  if (!isAuthenticated) {
    console.log("Admin: Weiterleitung zur Auth-Seite");
    return <Navigate to="/auth" />;
  }
  
  // Wenn der Nutzer noch kein Unternehmen hat, zur Unternehmenseinrichtung weiterleiten
  if (isAuthenticated && user && !user.company_id) {
    console.log("Admin: Weiterleitung zur Unternehmenseinrichtung");
    return <Navigate to="/company-setup" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <div className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="properties">Immobilien</TabsTrigger>
              <TabsTrigger value="agents">Makler</TabsTrigger>
              <TabsTrigger value="embedcode">Embed-Code</TabsTrigger>
              <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties">
              <PropertyTab />
            </TabsContent>
            
            <TabsContent value="agents">
              <AgentTab />
            </TabsContent>
            
            <TabsContent value="embedcode">
              <EmbedCodeTab />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
