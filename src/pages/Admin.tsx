
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "sonner";
import LoginForm from "@/components/admin/LoginForm";
import SetPasswordForm from "@/components/admin/SetPasswordForm";
import AdminContent from "@/components/admin/AdminContent";
import { Property } from "@/types/property";

const AdminPage = () => {
  const { isAuthenticated, login, logout, setAdminPassword, hasSetPassword } = useAuth();
  const { properties, addProperty: originalAddProperty, updateProperty, deleteProperty, getProperty, setPropertyStatus, loading, lastError, retryOperation } = useProperties();
  
  // Wrap addProperty to convert its return type from Promise<Property> to Promise<void>
  const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    await originalAddProperty(propertyData);
    // No return value needed, converting Promise<Property> to Promise<void>
  };
  
  const [isOffline, setIsOffline] = useState(false);
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored, back online");
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      console.log("Connection lost, offline");
      setIsOffline(true);
      toast.error("Keine Internetverbindung. Einige Funktionen sind möglicherweise eingeschränkt.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Render flow based on auth state
  if (!hasSetPassword) {
    return <SetPasswordForm onPasswordSet={setAdminPassword} />;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <AdminContent 
      properties={properties}
      loading={loading}
      lastError={lastError}
      isOffline={isOffline}
      logout={logout}
      addProperty={addProperty}
      updateProperty={updateProperty}
      deleteProperty={deleteProperty}
      getProperty={getProperty}
      setPropertyStatus={setPropertyStatus}
      retryOperation={retryOperation}
    />
  );
};

export default AdminPage;
