
import React from 'react';
import PropertyList from './PropertyList';
import { useProperties } from '@/hooks/useProperties';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PropertyListWrapperProps {
  companyId?: string;
}

const PropertyListWrapper: React.FC<PropertyListWrapperProps> = ({ companyId }) => {
  const { 
    properties, 
    setPropertyStatus, 
    deleteProperty 
  } = useProperties();
  const navigate = useNavigate();
  
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
  
  return (
    <PropertyList
      properties={properties}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onChangeStatus={handleChangeStatus}
    />
  );
};

export default PropertyListWrapper;
