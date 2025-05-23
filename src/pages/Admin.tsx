
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";
import PropertyListWrapper from "@/components/admin/PropertyListWrapper";
import AgentTab from "@/components/admin/AgentTab";
import EmbedCodeTab from "@/components/admin/EmbedCodeTab";
import SettingsTab from "@/components/admin/SettingsTab";
import AdminTab from "@/components/admin/AdminTab";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Property Tab Komponente 
const PropertyTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Immobilien verwalten</h2>
      </div>
      
      <PropertyListWrapper />
    </div>
  );
};

export default function Admin() {
  const { isAuthenticated, loadingAuth, company, user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const navigate = useNavigate();
  const location = useLocation();
  const [authTimeout, setAuthTimeout] = useState(false);
  const [userChangedTab, setUserChangedTab] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.email === 'dustin.althaus@me.com';
  
  // Check for redirects from location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setUserChangedTab(true);
      // Clear the state to prevent unexpected redirects on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Add a timeout for authentication to prevent infinite loading
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (loadingAuth) {
      timer = setTimeout(() => {
        setAuthTimeout(true);
      }, 5000); // 5 seconds timeout
    } else {
      setAuthTimeout(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadingAuth]);
  
  // Track when initial load is complete
  useEffect(() => {
    if (!loadingAuth && company !== undefined) {
      // Mark initial load as complete once we have auth and company status
      setInitialLoadComplete(true);
    }
  }, [loadingAuth, company]);
  
  // Handle tab changes based on user selection
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUserChangedTab(true);
  };
  
  // Separate useEffect to handle tab changes based on company status
  useEffect(() => {
    // Only run this effect after initial load is complete to prevent flash messages
    if (initialLoadComplete && !loadingAuth && isAuthenticated) {
      if (!company && activeTab === "properties" && !userChangedTab) {
        setActiveTab("settings");
        toast.info("Bitte erstellen Sie zuerst ein Unternehmen, um Immobilien zu verwalten");
      } else if (company && activeTab === "settings" && !userChangedTab && 
                location.state?.activeTab !== "settings") {
        setActiveTab("properties");
      }
    }
  }, [initialLoadComplete, isAuthenticated, company, activeTab, loadingAuth, userChangedTab]);
  
  // Render loading state, error state, or redirect based on auth status
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
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Main component render - only happens when authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <div className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-8">
              <TabsTrigger value="properties">Immobilien</TabsTrigger>
              <TabsTrigger value="agents">Makler</TabsTrigger>
              <TabsTrigger value="embedcode">Embed-Code</TabsTrigger>
              <TabsTrigger value="settings">Einstellungen</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
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

            {isAdmin && (
              <TabsContent value="admin">
                <AdminTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
