
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Property, initialProperty } from "../types/property";
import { toast } from "sonner";

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Property;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  getActiveProperties: () => Property[];
  setPropertyStatus: (id: string, status: 'active' | 'sold' | 'archived') => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useLocalStorage<Property[]>("properties", []);
  
  // Logging the properties for debugging
  useEffect(() => {
    console.log("Properties in PropertiesProvider:", properties);
  }, [properties]);
  
  const addProperty = (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    // Ensure at least one image is marked as featured
    const images = [...propertyData.images];
    if (images.length > 0 && !images.some(img => img.isFeatured)) {
      images[0].isFeatured = true;
    }
    
    // Set default status to 'active' if not provided
    const status = propertyData.status || 'active';
    
    const newProperty: Property = {
      ...propertyData,
      status,
      images: images,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProperties(prev => [newProperty, ...prev]);
    toast.success("Immobilie erfolgreich erstellt");
    return newProperty;
  };
  
  const updateProperty = (id: string, propertyUpdate: Partial<Property>) => {
    // Ensure at least one image is marked as featured if images are being updated
    if (propertyUpdate.images && propertyUpdate.images.length > 0) {
      if (!propertyUpdate.images.some(img => img.isFeatured)) {
        propertyUpdate.images[0].isFeatured = true;
      }
    }
    
    setProperties(prev => 
      prev.map(property => 
        property.id === id 
          ? { ...property, ...propertyUpdate, updatedAt: new Date().toISOString() } 
          : property
      )
    );
    toast.success("Immobilie aktualisiert");
  };
  
  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    toast.success("Immobilie gelöscht");
  };
  
  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };
  
  const getActiveProperties = () => {
    const active = properties.filter(property => property.status === 'active');
    console.log("Active properties from getActiveProperties:", active);
    return active;
  };
  
  const setPropertyStatus = (id: string, status: 'active' | 'sold' | 'archived') => {
    updateProperty(id, { status });
    
    const statusMessages = {
      active: "Immobilie ist jetzt aktiv",
      sold: "Immobilie als verkauft markiert",
      archived: "Immobilie archiviert"
    };
    
    toast.success(statusMessages[status]);
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
        setPropertyStatus
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
