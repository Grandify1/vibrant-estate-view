
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyForm from "@/components/admin/PropertyForm";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "sonner";

const PropertyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty, addProperty, updateProperty } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the property if we're editing an existing one
  const property = id ? getProperty(id) : undefined;
  const isEditing = Boolean(id && property);
  
  const handleSubmit = async (propertyData) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && id) {
        await updateProperty(id, propertyData);
        toast.success("Immobilie erfolgreich aktualisiert");
      } else {
        const newProperty = await addProperty(propertyData);
        if (newProperty) {
          toast.success("Immobilie erfolgreich erstellt");
        }
      }
      
      navigate('/admin');
    } catch (error) {
      console.error("Error in PropertyFormPage:", error);
      toast.error("Fehler beim Speichern der Immobilie");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <div className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Zurück zur Übersicht
          </Button>
          
          <PropertyForm 
            property={property}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyFormPage;
