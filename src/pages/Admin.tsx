
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
import { Button } from "@/components/ui/button";
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
  const [authTimeout, setAuthTimeout] = useState(false);
  
  // Add a timeout for authentication to prevent infinite loading
  useEffect(() => {
    if (loadingAuth) {
      const timer = setTimeout(() => {
        setAuthTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    } else {
      setAuthTimeout(false);
    }
  }, [loadingAuth]);
  
  // Display appropriate UI based on auth state
  useEffect(() => {
    console.log("Admin: Auth Status:", { isAuthenticated, loadingAuth, user });
    
    if (!loadingAuth) {
      if (!isAuthenticated) {
        console.log("Admin: Nicht authentifiziert, leite zur Auth-Seite weiter");
      } else if (user && !user.company_id) {
        console.log("Admin: Authentifiziert aber kein Unternehmen, leite zur Unternehmenseinrichtung weiter");
      } else {
        console.log("Admin: Authentifiziert mit Unternehmen", user?.company_id);
      }
    }
  }, [isAuthenticated, loadingAuth, user]);
  
  // If auth is taking too long, show a helpful message
  if (authTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-orange-50 border border-orange-200 rounded-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Authentifizierung dauert zu lange</h2>
          <p className="mb-4">Es scheint ein Problem mit der Authentifizierung zu geben. Bitte versuchen Sie, sich erneut anzumelden.</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full"
          >
            Zur Anmeldeseite
          </Button>
        </div>
      </div>
    );
  }
  
  // If auth is still loading, show loading state
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg font-medium text-gray-700">Authentifizierung...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user has no company, redirect to company setup
  if (isAuthenticated && user && !user.company_id) {
    console.log("Admin: Weiterleitung zur Unternehmenseinrichtung");
    return <Navigate to="/company-setup" replace />;
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
