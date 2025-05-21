import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Property, initialProperty } from "../types/property";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<Property>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  getActiveProperties: () => Property[];
  setPropertyStatus: (id: string, status: 'active' | 'sold' | 'archived') => Promise<void>;
  loading: boolean;
  retryOperation: () => Promise<void>;
  lastError: string | null;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

// Helper functions to convert between our frontend model and Supabase model
const toSupabaseProperty = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
  // Convert specific properties to the expected Json type for Supabase
  const supabaseProperty = {
    title: property.title,
    address: property.address,
    status: property.status || 'active',
    highlights: property.highlights as unknown as Json,
    images: property.images as unknown as Json,
    floor_plans: property.floorPlans as unknown as Json,
    details: property.details as unknown as Json,
    energy: property.energy as unknown as Json,
    description: property.description || '',
    amenities: property.amenities || '',
    location: property.location || ''
  };
  
  console.log("Converting to Supabase format:", supabaseProperty);
  return supabaseProperty;
};

const fromSupabaseProperty = (dbProperty: any): Property => {
  console.log("Converting from Supabase:", dbProperty);
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
  const [lastError, setLastError] = useState<string | null>(null);
  // Update the type to accept any Promise-returning function
  const [pendingOperation, setPendingOperation] = useState<(() => Promise<any>) | null>(null);
  
  // Check network status
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored, back online");
      setIsOnline(true);
      // Try to retry pending operation if any
      if (pendingOperation) {
        retryOperation();
      }
    };
    
    const handleOffline = () => {
      console.log("Connection lost, offline");
      setIsOnline(false);
      toast.error("Verbindung verloren. Bitte überprüfen Sie Ihre Internetverbindung.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingOperation]);
  
  // Load properties from Supabase on component mount
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setLastError(null);
      console.log("Fetching properties from Supabase...");
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
        setLastError(`Fehler beim Laden der Immobilien: ${error.message}`);
        toast.error("Fehler beim Laden der Immobilien");
        return;
      }
      
      console.log("Fetched properties from Supabase:", data);
      const mappedProperties = data.map(fromSupabaseProperty);
      setProperties(mappedProperties);
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      setLastError(`Unbekannter Fehler beim Laden der Immobilien: ${error}`);
      toast.error("Fehler beim Laden der Immobilien");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const retryOperation = async () => {
    if (pendingOperation) {
      try {
        await pendingOperation();
        setPendingOperation(null);
        setLastError(null);
      } catch (error) {
        console.error("Retry operation failed:", error);
        toast.error("Erneuter Versuch fehlgeschlagen");
      }
    } else {
      await fetchProperties();
    }
  };
  
  const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (!isOnline) {
        toast.error("Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
        // Fix: Wrap in a void function to match the expected type
        setPendingOperation(() => async () => {
          const result = await addProperty(propertyData);
          return result;
        });
        throw new Error("Keine Internetverbindung");
      }
      
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
      
      // Convert to Supabase format
      const supabaseData = toSupabaseProperty(propertyToAdd);
      console.log("Converted to Supabase format:", supabaseData);
      
      // Enhanced error handling for the network request
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      let data;
      let error;
      
      while (retries <= maxRetries && !success) {
        try {
          const response = await supabase
            .from('properties')
            .insert(supabaseData)
            .select('*')
            .single();
          
          data = response.data;
          error = response.error;
          
          if (!error) {
            success = true;
          } else {
            console.log(`Attempt ${retries + 1} failed, retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          }
        } catch (e) {
          console.error(`Network error on attempt ${retries + 1}:`, e);
          retries++;
          
          if (retries > maxRetries) {
            throw e;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
        }
      }
      
      if (error) {
        console.error("Error adding property to Supabase after retries:", error);
        setLastError(`Fehler beim Erstellen der Immobilie: ${error.message}`);
        toast.error("Fehler beim Erstellen der Immobilie: " + error.message);
        throw error;
      }
      
      if (!data) {
        console.error("No data returned after insert");
        setLastError("Fehler beim Erstellen der Immobilie: Keine Daten zurückgegeben");
        toast.error("Fehler beim Erstellen der Immobilie: Keine Daten zurückgegeben");
        throw new Error("No data returned after insert");
      }
      
      console.log("New property added to Supabase:", data);
      
      const newProperty = fromSupabaseProperty(data);
      setProperties(prev => [newProperty, ...prev]);
      toast.success("Immobilie erfolgreich erstellt");
      setLastError(null);
      return newProperty;
    } catch (error: any) {
      console.error("Error in addProperty:", error);
      const errorMessage = error?.message || "Unbekannter Fehler";
      setLastError(`Fehler beim Erstellen der Immobilie: ${errorMessage}`);
      toast.error("Fehler beim Erstellen der Immobilie");
      
      // Fix: Wrap in a void function to match the expected type
      if (!isOnline) {
        setPendingOperation(() => async () => {
          const result = await addProperty(propertyData);
          return result;
        });
      }
      
      throw error;
    }
  };
  
  const updateProperty = async (id: string, propertyUpdate: Partial<Property>) => {
    try {
      if (!isOnline) {
        toast.error("Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
        setPendingOperation(() => () => updateProperty(id, propertyUpdate));
        throw new Error("Keine Internetverbindung");
      }
      
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
      if (propertyUpdate.highlights !== undefined) supabaseUpdate.highlights = propertyUpdate.highlights as unknown as Json;
      if (propertyUpdate.images !== undefined) supabaseUpdate.images = propertyUpdate.images as unknown as Json;
      if (propertyUpdate.floorPlans !== undefined) supabaseUpdate.floor_plans = propertyUpdate.floorPlans as unknown as Json;
      if (propertyUpdate.details !== undefined) supabaseUpdate.details = propertyUpdate.details as unknown as Json;
      if (propertyUpdate.energy !== undefined) supabaseUpdate.energy = propertyUpdate.energy as unknown as Json;
      if (propertyUpdate.description !== undefined) supabaseUpdate.description = propertyUpdate.description;
      if (propertyUpdate.amenities !== undefined) supabaseUpdate.amenities = propertyUpdate.amenities;
      if (propertyUpdate.location !== undefined) supabaseUpdate.location = propertyUpdate.location;
      
      console.log("Updating property:", id, "with update:", supabaseUpdate);
      
      // Enhanced error handling for the network request
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      let updateError;
      
      while (retries <= maxRetries && !success) {
        try {
          const { error } = await supabase
            .from('properties')
            .update(supabaseUpdate)
            .eq('id', id);
          
          updateError = error;
          
          if (!error) {
            success = true;
          } else {
            console.log(`Update attempt ${retries + 1} failed, retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          }
        } catch (e) {
          console.error(`Network error on update attempt ${retries + 1}:`, e);
          retries++;
          
          if (retries > maxRetries) {
            throw e;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
        }
      }
      
      if (updateError) {
        console.error("Error updating property in Supabase:", updateError);
        setLastError(`Fehler beim Aktualisieren der Immobilie: ${updateError.message}`);
        toast.error("Fehler beim Aktualisieren der Immobilie: " + updateError.message);
        throw updateError;
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
      setLastError(null);
      toast.success("Immobilie aktualisiert");
    } catch (error: any) {
      console.error("Error in updateProperty:", error);
      const errorMessage = error?.message || "Unbekannter Fehler";
      setLastError(`Fehler beim Aktualisieren der Immobilie: ${errorMessage}`);
      toast.error("Fehler beim Aktualisieren der Immobilie");
      
      // Save the operation for later retry
      if (!isOnline) {
        setPendingOperation(() => () => updateProperty(id, propertyUpdate));
      }
      
      throw error;
    }
  };
  
  const deleteProperty = async (id: string) => {
    try {
      if (!isOnline) {
        toast.error("Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
        setPendingOperation(() => () => deleteProperty(id));
        throw new Error("Keine Internetverbindung");
      }
      
      // Enhanced error handling for the network request
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      let deleteError;
      
      while (retries <= maxRetries && !success) {
        try {
          const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id);
          
          deleteError = error;
          
          if (!error) {
            success = true;
          } else {
            console.log(`Delete attempt ${retries + 1} failed, retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          }
        } catch (e) {
          console.error(`Network error on delete attempt ${retries + 1}:`, e);
          retries++;
          
          if (retries > maxRetries) {
            throw e;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
        }
      }
      
      if (deleteError) {
        console.error("Error deleting property from Supabase:", deleteError);
        setLastError(`Fehler beim Löschen der Immobilie: ${deleteError.message}`);
        toast.error("Fehler beim Löschen der Immobilie: " + deleteError.message);
        throw deleteError;
      }
      
      setProperties(prev => prev.filter(property => property.id !== id));
      setLastError(null);
      toast.success("Immobilie gelöscht");
    } catch (error: any) {
      console.error("Error in deleteProperty:", error);
      const errorMessage = error?.message || "Unbekannter Fehler";
      setLastError(`Fehler beim Löschen der Immobilie: ${errorMessage}`);
      toast.error("Fehler beim Löschen der Immobilie");
      
      // Save the operation for later retry
      if (!isOnline) {
        setPendingOperation(() => () => deleteProperty(id));
      }
      
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
        loading,
        retryOperation,
        lastError
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
