
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyImage, PropertyHighlight, PropertyDetails, EnergyDetails, FloorPlan, initialProperty } from "@/types/property";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

// Hilfsfunktion für Typumwandlungen mit Fallback-Werten
const safelyParseJson = <T extends unknown>(jsonValue: any, fallback: T): T => {
  if (!jsonValue) return fallback;
  if (Array.isArray(jsonValue)) return jsonValue as unknown as T;
  if (typeof jsonValue === 'object') return jsonValue as T;
  return fallback;
};

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "created_at" | "updated_at">) => Promise<Property | null>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  setPropertyStatus: (id: string, status: 'active' | 'sold' | 'archived') => Promise<void>;
  filterProperties: (filters: Record<string, any>) => Property[];
  loading: boolean;
  lastError: string | null;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const { company } = useAuth();
  
  // Immobilien aus Supabase laden
  const fetchProperties = async () => {
    if (!company) {
      setProperties([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setLastError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
        setLastError(`Fehler beim Laden der Immobilien: ${error.message}`);
        return;
      }
      
      if (data) {
        const parsedProperties: Property[] = data.map((item: any) => {
          const emptyHighlights: PropertyHighlight[] = [];
          const emptyImages: PropertyImage[] = [];
          const emptyFloorPlans: FloorPlan[] = [];
          const emptyDetails: PropertyDetails = {
            price: 0,
            livingArea: 0,
            plotArea: 0,
            rooms: 0,
            bathrooms: 0,
            bedrooms: 0,
            constructionYear: 0,
            lastRenovation: 0,
            availability: '',
            propertyType: '',
            floor: 0,
            totalFloors: 0,
            parkingSpaces: 0
          };
          const emptyEnergy: EnergyDetails = {
            certificateAvailable: false,
            energyClass: '',
            energyConsumptionValue: 0,
            includesWarmWater: false,
            primaryEnergyCarrier: '',
            finalEnergyDemand: 0
          };
          
          return {
            id: item.id,
            title: item.title || '',
            address: item.address || '',
            status: item.status || 'active',
            company_id: item.company_id,
            agent_id: item.agent_id,
            description: item.description || '',
            amenities: item.amenities || '',
            location: item.location || '',
            created_at: item.created_at,
            updated_at: item.updated_at,
            highlights: safelyParseJson<PropertyHighlight[]>(item.highlights, emptyHighlights),
            images: safelyParseJson<PropertyImage[]>(item.images, emptyImages),
            floorPlans: safelyParseJson<FloorPlan[]>(item.floor_plans, emptyFloorPlans),
            details: safelyParseJson<PropertyDetails>(item.details, emptyDetails),
            energy: safelyParseJson<EnergyDetails>(item.energy, emptyEnergy)
          };
        });
        
        setProperties(parsedProperties);
      }
    } catch (error: any) {
      console.error('Error in fetchProperties:', error);
      setLastError(`Fehler beim Laden der Immobilien: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Beim Laden der Komponente oder Änderung des Unternehmens Immobilien laden
  useEffect(() => {
    fetchProperties();
  }, [company]);
  
  // Neue Immobilie hinzufügen
  const addProperty = async (propertyData: Omit<Property, "id" | "created_at" | "updated_at">): Promise<Property | null> => {
    if (!company) {
      toast.error("Sie müssen einem Unternehmen angehören, um Immobilien hinzuzufügen");
      return null;
    }
    
    try {
      const dbRecord = {
        title: propertyData.title,
        address: propertyData.address,
        status: propertyData.status,
        highlights: propertyData.highlights || [],
        images: propertyData.images || [],
        floor_plans: propertyData.floorPlans || [],
        details: propertyData.details || {},
        energy: propertyData.energy || {},
        description: propertyData.description,
        amenities: propertyData.amenities,
        location: propertyData.location,
        company_id: company.id,
        agent_id: propertyData.agent_id
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert(dbRecord)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding property:", error);
        setLastError(`Fehler beim Hinzufügen der Immobilie: ${error.message}`);
        toast.error("Fehler beim Hinzufügen der Immobilie");
        return null;
      }
      
      const newProperty: Property = {
        id: data.id,
        title: data.title,
        address: data.address,
        status: data.status,
        company_id: data.company_id,
        agent_id: data.agent_id,
        description: data.description || '',
        amenities: data.amenities || '',
        location: data.location || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        highlights: safelyParseJson<PropertyHighlight[]>(data.highlights, []),
        images: safelyParseJson<PropertyImage[]>(data.images, []),
        floorPlans: safelyParseJson<FloorPlan[]>(data.floor_plans, []),
        details: safelyParseJson<PropertyDetails>(data.details, {} as PropertyDetails),
        energy: safelyParseJson<EnergyDetails>(data.energy, {} as EnergyDetails)
      };
      
      setProperties(prev => [newProperty, ...prev]);
      toast.success("Immobilie erfolgreich hinzugefügt");
      setLastError(null);
      
      return newProperty;
    } catch (error: any) {
      console.error("Error in addProperty:", error);
      setLastError(`Fehler beim Hinzufügen der Immobilie: ${error.message}`);
      toast.error("Fehler beim Hinzufügen der Immobilie");
      return null;
    }
  };
  
  // Immobilie aktualisieren
  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const dbUpdates: Record<string, any> = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.highlights) dbUpdates.highlights = updates.highlights;
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.floorPlans) dbUpdates.floor_plans = updates.floorPlans;
      if (updates.details) dbUpdates.details = updates.details;
      if (updates.energy) dbUpdates.energy = updates.energy;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.amenities) dbUpdates.amenities = updates.amenities;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.agent_id) dbUpdates.agent_id = updates.agent_id;
      
      const { error } = await supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating property:", error);
        setLastError(`Fehler beim Aktualisieren der Immobilie: ${error.message}`);
        toast.error("Fehler beim Aktualisieren der Immobilie");
        return;
      }
      
      // Lokale Zustandsaktualisierung
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? { ...property, ...updates } : property
        )
      );
      
      toast.success("Immobilie erfolgreich aktualisiert");
      setLastError(null);
    } catch (error: any) {
      console.error("Error in updateProperty:", error);
      setLastError(`Fehler beim Aktualisieren der Immobilie: ${error.message}`);
      toast.error("Fehler beim Aktualisieren der Immobilie");
    }
  };
  
  // Status einer Immobilie ändern
  const setPropertyStatus = async (id: string, status: 'active' | 'sold' | 'archived') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error("Error updating property status:", error);
        setLastError(`Fehler beim Ändern des Status: ${error.message}`);
        toast.error("Fehler beim Ändern des Status");
        return;
      }
      
      // Lokale Zustandsaktualisierung
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? { ...property, status } : property
        )
      );
      
      setLastError(null);
    } catch (error: any) {
      console.error("Error in setPropertyStatus:", error);
      setLastError(`Fehler beim Ändern des Status: ${error.message}`);
      toast.error("Fehler beim Ändern des Status");
    }
  };
  
  // Immobilie löschen
  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting property:", error);
        setLastError(`Fehler beim Löschen der Immobilie: ${error.message}`);
        toast.error("Fehler beim Löschen der Immobilie");
        return;
      }
      
      // Lokale Zustandsaktualisierung
      setProperties(prev => prev.filter(property => property.id !== id));
      toast.success("Immobilie erfolgreich gelöscht");
      setLastError(null);
    } catch (error: any) {
      console.error("Error in deleteProperty:", error);
      setLastError(`Fehler beim Löschen der Immobilie: ${error.message}`);
      toast.error("Fehler beim Löschen der Immobilie");
    }
  };
  
  // Immobilie nach ID abrufen
  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };
  
  // Immobilien filtern
  const filterProperties = (filters: Record<string, any>) => {
    let filtered = [...properties];
    
    // Filter nach Status
    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status);
    }
    
    // Weitere Filter können hier hinzugefügt werden
    
    return filtered;
  };
  
  return (
    <PropertiesContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getProperty,
        setPropertyStatus,
        filterProperties,
        loading,
        lastError
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
}
