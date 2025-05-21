
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Property, initialProperty } from "../types/property";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<Property>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  getActiveProperties: () => Property[];
  setPropertyStatus: (id: string, status: 'active' | 'sold' | 'archived') => Promise<void>;
  loading: boolean;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

// Helper functions to convert between our frontend model and Supabase model
const toSupabaseProperty = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
  return {
    title: property.title,
    address: property.address,
    status: property.status || 'active',
    highlights: property.highlights || [],
    images: property.images || [],
    floor_plans: property.floorPlans || [],
    details: property.details || {},
    energy: property.energy || {},
    description: property.description || '',
    amenities: property.amenities || '',
    location: property.location || ''
  };
};

const fromSupabaseProperty = (dbProperty: any): Property => {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    address: dbProperty.address,
    status: dbProperty.status as 'active' | 'sold' | 'archived',
    highlights: dbProperty.highlights || [],
    images: dbProperty.images || [],
    floorPlans: dbProperty.floor_plans || [],
    details: dbProperty.details || initialProperty.details,
    energy: dbProperty.energy || initialProperty.energy,
    description: dbProperty.description || '',
    amenities: dbProperty.amenities || '',
    location: dbProperty.location || '',
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at
  };
};

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load properties from Supabase on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties:', error);
          toast.error("Fehler beim Laden der Immobilien");
          return;
        }
        
        console.log("Fetched properties from Supabase:", data);
        const mappedProperties = data.map(fromSupabaseProperty);
        setProperties(mappedProperties);
      } catch (error) {
        console.error('Error in fetchProperties:', error);
        toast.error("Fehler beim Laden der Immobilien");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Ensure at least one image is marked as featured
      const images = [...(propertyData.images || [])];
      if (images.length > 0 && !images.some(img => img.isFeatured)) {
        images[0].isFeatured = true;
      }
      
      // Set default status to 'active' if not provided
      const status = propertyData.status || 'active';
      const propertyToAdd = {
        ...propertyData,
        status,
        images
      };
      
      console.log("Adding new property with status:", propertyToAdd.status);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert(toSupabaseProperty(propertyToAdd))
        .select('*')
        .single();
      
      if (error) {
        console.error("Error adding property to Supabase:", error);
        toast.error("Fehler beim Erstellen der Immobilie");
        throw error;
      }
      
      const newProperty = fromSupabaseProperty(data);
      setProperties(prev => [newProperty, ...prev]);
      toast.success("Immobilie erfolgreich erstellt");
      return newProperty;
    } catch (error) {
      console.error("Error in addProperty:", error);
      toast.error("Fehler beim Erstellen der Immobilie");
      throw error;
    }
  };
  
  const updateProperty = async (id: string, propertyUpdate: Partial<Property>) => {
    try {
      // Ensure at least one image is marked as featured if images are being updated
      if (propertyUpdate.images && propertyUpdate.images.length > 0) {
        if (!propertyUpdate.images.some(img => img.isFeatured)) {
          propertyUpdate.images[0].isFeatured = true;
        }
      }
      
      // Convert to Supabase format - only include fields that exist in the Supabase table
      const supabaseUpdate: any = {};
      
      if (propertyUpdate.title !== undefined) supabaseUpdate.title = propertyUpdate.title;
      if (propertyUpdate.address !== undefined) supabaseUpdate.address = propertyUpdate.address;
      if (propertyUpdate.status !== undefined) supabaseUpdate.status = propertyUpdate.status;
      if (propertyUpdate.highlights !== undefined) supabaseUpdate.highlights = propertyUpdate.highlights;
      if (propertyUpdate.images !== undefined) supabaseUpdate.images = propertyUpdate.images;
      if (propertyUpdate.floorPlans !== undefined) supabaseUpdate.floor_plans = propertyUpdate.floorPlans;
      if (propertyUpdate.details !== undefined) supabaseUpdate.details = propertyUpdate.details;
      if (propertyUpdate.energy !== undefined) supabaseUpdate.energy = propertyUpdate.energy;
      if (propertyUpdate.description !== undefined) supabaseUpdate.description = propertyUpdate.description;
      if (propertyUpdate.amenities !== undefined) supabaseUpdate.amenities = propertyUpdate.amenities;
      if (propertyUpdate.location !== undefined) supabaseUpdate.location = propertyUpdate.location;
      
      console.log("Updating property:", id, "with update:", supabaseUpdate);
      
      const { error } = await supabase
        .from('properties')
        .update(supabaseUpdate)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating property in Supabase:", error);
        toast.error("Fehler beim Aktualisieren der Immobilie");
        throw error;
      }
      
      // Get the updated property from the database
      const { data: updatedData, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching updated property:", fetchError);
      }
      
      const updatedProperty = fromSupabaseProperty(updatedData);
      
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? updatedProperty : property
        )
      );
      toast.success("Immobilie aktualisiert");
    } catch (error) {
      console.error("Error in updateProperty:", error);
      toast.error("Fehler beim Aktualisieren der Immobilie");
      throw error;
    }
  };
  
  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting property from Supabase:", error);
        toast.error("Fehler beim Löschen der Immobilie");
        throw error;
      }
      
      setProperties(prev => prev.filter(property => property.id !== id));
      toast.success("Immobilie gelöscht");
    } catch (error) {
      console.error("Error in deleteProperty:", error);
      toast.error("Fehler beim Löschen der Immobilie");
      throw error;
    }
  };
  
  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };
  
  const getActiveProperties = () => {
    const active = properties.filter(property => property.status === 'active');
    console.log("Active properties from getActiveProperties:", active);
    return active;
  };
  
  const setPropertyStatus = async (id: string, status: 'active' | 'sold' | 'archived') => {
    try {
      console.log("Setting property status:", id, "to:", status);
      await updateProperty(id, { status });
      
      const statusMessages = {
        active: "Immobilie ist jetzt aktiv",
        sold: "Immobilie als verkauft markiert",
        archived: "Immobilie archiviert"
      };
      
      toast.success(statusMessages[status]);
    } catch (error) {
      console.error("Error in setPropertyStatus:", error);
      throw error;
    }
  };
  
  return (
    <PropertiesContext.Provider 
      value={{ 
        properties, 
        addProperty, 
        updateProperty, 
        deleteProperty, 
        getProperty,
        getActiveProperties,
        setPropertyStatus,
        loading
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
}
