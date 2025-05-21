
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
