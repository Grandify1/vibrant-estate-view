
import React, { useState } from 'react';
import PropertyList from './PropertyList';
import { useProperties } from '@/hooks/useProperties';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PropertyListWrapper: React.FC = () => {
  const { 
    properties, 
    setPropertyStatus, 
    deleteProperty,
    loading,
    lastError
  } = useProperties();
  const { company } = useAuth();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  
  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Es wurde kein Unternehmen gefunden. 
            Bitte erstellen Sie zuerst ein Unternehmen im Einstellungen-Tab.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate('/admin', { state: { activeTab: 'settings' } })}>
              Zu den Einstellungen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleEdit = (id: string) => {
    navigate(`/admin/properties/edit/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      toast.success("Immobilie erfolgreich gelöscht");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Fehler beim Löschen der Immobilie");
    }
  };
  
  const handleChangeStatus = async (id: string, status: 'active' | 'sold' | 'archived') => {
    try {
      await setPropertyStatus(id, status);
      const statusMessages = {
        active: "Immobilie ist jetzt aktiv",
        sold: "Immobilie als verkauft markiert",
        archived: "Immobilie archiviert"
      };
      toast.success(statusMessages[status]);
    } catch (error) {
      console.error("Error changing property status:", error);
      toast.error("Fehler beim Ändern des Status");
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/properties/new');
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button onClick={handleCreateNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Neue Immobilie
        </Button>
      </div>
      <PropertyList
        properties={properties}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
        loading={loading}
        error={lastError}
      />
    </>
  );
};

export default PropertyListWrapper;
