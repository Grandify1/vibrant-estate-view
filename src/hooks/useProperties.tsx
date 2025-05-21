
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
  
  const addProperty = (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const newProperty: Property = {
      ...propertyData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProperties(prev => [newProperty, ...prev]);
    toast.success("Immobilie erfolgreich erstellt");
    return newProperty;
  };
  
  const updateProperty = (id: string, propertyUpdate: Partial<Property>) => {
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
    return properties.filter(property => property.status === 'active');
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
