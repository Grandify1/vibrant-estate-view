
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyList from "@/components/admin/PropertyList";
import PropertyForm from "@/components/admin/PropertyForm";
import EmbedCodeTab from "@/components/admin/EmbedCodeTab";
import AdminHeader from "@/components/admin/AdminHeader";
import AgentTab from "@/components/admin/AgentTab"; 
import { Property } from "@/types/property";
import { toast } from "sonner";

enum AdminView {
  LIST = "list",
  CREATE = "create",
  EDIT = "edit",
}

interface AdminContentProps {
  properties: Property[];
  loading: boolean;
  lastError: string | null;
  isOffline: boolean;
  logout: () => void;
  addProperty: (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProperty: (id: string, propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  setPropertyStatus: (id: string, status: string) => Promise<void>;
  retryOperation: () => void;
}

const AdminContent: React.FC<AdminContentProps> = ({
  properties,
  loading,
  lastError,
  isOffline,
  logout,
  addProperty,
  updateProperty,
  deleteProperty,
  getProperty,
  setPropertyStatus,
  retryOperation,
}) => {
  const [adminView, setAdminView] = useState<AdminView>(AdminView.LIST);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePropertySubmit = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    if (isOffline) {
      toast.error("Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Ensure propertyData contains the status field
      const dataWithStatus = {
        ...propertyData,
        status: propertyData.status || 'active'
      };
      
      console.log("Property data before saving:", dataWithStatus);
      
      if (adminView === AdminView.CREATE) {
        console.log("Adding new property:", dataWithStatus);
        await addProperty(dataWithStatus);
      } else if (adminView === AdminView.EDIT && editPropertyId) {
        console.log("Updating property:", editPropertyId, dataWithStatus);
        await updateProperty(editPropertyId, dataWithStatus);
      }
      setAdminView(AdminView.LIST);
      setEditPropertyId(null);
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditProperty = (id: string) => {
    setEditPropertyId(id);
    setAdminView(AdminView.EDIT);
  };
  
  const handleDeleteProperty = async (id: string) => {
    if (isOffline) {
      toast.error("Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
      return;
    }
    
    try {
      await deleteProperty(id);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
  
  const getEditProperty = () => {
    if (!editPropertyId) return undefined;
    return getProperty(editPropertyId);
  };
  
  const handleCancel = () => {
    setAdminView(AdminView.LIST);
    setEditPropertyId(null);
  };
  
  const handleCreateNew = () => {
    setAdminView(AdminView.CREATE);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader 
        onCreateNew={handleCreateNew}
        onLogout={logout}
        isListView={adminView === AdminView.LIST}
        isOffline={isOffline}
        lastError={lastError}
        onRetry={retryOperation}
      />
      
      {loading && adminView === AdminView.LIST ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : adminView === AdminView.LIST && (
        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Immobilien</TabsTrigger>
            <TabsTrigger value="agents">Makler</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <PropertyList 
              properties={properties} 
              onEdit={handleEditProperty} 
              onDelete={handleDeleteProperty}
              onChangeStatus={setPropertyStatus}
            />
          </TabsContent>
          
          <TabsContent value="agents">
            <AgentTab />
          </TabsContent>
          
          <TabsContent value="embed">
            <EmbedCodeTab />
          </TabsContent>
        </Tabs>
      )}
      
      {(adminView === AdminView.CREATE || adminView === AdminView.EDIT) && (
        <>
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="mr-4"
            >
              ← Zurück zur Übersicht
            </Button>
            <h2 className="text-2xl font-bold">
              {adminView === AdminView.CREATE ? 'Neue Immobilie erstellen' : 'Immobilie bearbeiten'}
            </h2>
          </div>
          <PropertyForm 
            property={getEditProperty()}
            onSubmit={handlePropertySubmit}
            onCancel={handleCancel}
            isEditing={adminView === AdminView.EDIT}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
};

export default AdminContent;
