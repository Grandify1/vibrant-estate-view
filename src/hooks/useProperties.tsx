
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyImage, PropertyHighlight, PropertyDetails, EnergyDetails, FloorPlan, initialProperty } from "@/types/property";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Helper function for type conversions with fallback values
const safelyParseJson = <T extends unknown>(jsonValue: any, fallback: T): T => {
  if (!jsonValue) return fallback;
  if (Array.isArray(jsonValue)) return jsonValue as unknown as T;
  if (typeof jsonValue === 'object') return jsonValue as T;
  return fallback;
};

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<Property | null>;
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
  
  // Load properties from Supabase
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
            price: '',
            livingArea: '',
            plotArea: '',
            rooms: '',
            bathrooms: '',
            bedrooms: '',
            constructionYear: '',
            lastRenovation: '',
            availability: '',
            propertyType: '',
            floor: '',
            totalFloors: '',
            parkingSpaces: '',
            availableFrom: '',
            maintenanceFee: '',
            condition: '',
            heatingType: '',
            energySource: ''
          };
          const emptyEnergy: EnergyDetails = {
            certificateAvailable: false,
            certificateType: '',
            energyConsumption: '',
            energyEfficiencyClass: '',
            includesWarmWater: false,
            primaryEnergyCarrier: '',
            finalEnergyDemand: '',
            constructionYear: '',
            validUntil: '',
            createdAt: ''
          };
          
          return {
            id: item.id,
            title: item.title || '',
            address: item.address || '',
            status: item.status || 'active' as 'active' | 'sold' | 'archived',
            company_id: item.company_id,
            agent_id: item.agent_id,
            description: item.description || '',
            amenities: item.amenities || '',
            location: item.location || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
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
  
  // Load properties when component loads or company changes
  useEffect(() => {
    fetchProperties();
  }, [company]);
  
  // Add a new property
  const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property | null> => {
    if (!company) {
      toast.error("Sie müssen einem Unternehmen angehören, um Immobilien hinzuzufügen");
      return null;
    }
    
    try {
      // Convert our Property type to the database schema expected format
      const dbRecord = {
        title: propertyData.title,
        address: propertyData.address,
        status: propertyData.status,
        highlights: propertyData.highlights as unknown as Json,
        images: propertyData.images as unknown as Json,
        floor_plans: propertyData.floorPlans as unknown as Json,
        details: propertyData.details as unknown as Json,
        energy: propertyData.energy as unknown as Json,
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
        status: data.status as 'active' | 'sold' | 'archived',
        company_id: data.company_id,
        agent_id: data.agent_id,
        description: data.description || '',
        amenities: data.amenities || '',
        location: data.location || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
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
  
  // Update a property
  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const dbUpdates: Record<string, any> = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.highlights) dbUpdates.highlights = updates.highlights as unknown as Json;
      if (updates.images) dbUpdates.images = updates.images as unknown as Json;
      if (updates.floorPlans) dbUpdates.floor_plans = updates.floorPlans as unknown as Json;
      if (updates.details) dbUpdates.details = updates.details as unknown as Json;
      if (updates.energy) dbUpdates.energy = updates.energy as unknown as Json;
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
      
      // Update local state
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? { ...property, ...updates, updatedAt: new Date().toISOString() } : property
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
  
  // Set property status
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
      
      // Update local state
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? { ...property, status, updatedAt: new Date().toISOString() } : property
        )
      );
      
      setLastError(null);
    } catch (error: any) {
      console.error("Error in setPropertyStatus:", error);
      setLastError(`Fehler beim Ändern des Status: ${error.message}`);
      toast.error("Fehler beim Ändern des Status");
    }
  };
  
  // Delete a property
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
      
      // Update local state
      setProperties(prev => prev.filter(property => property.id !== id));
      toast.success("Immobilie erfolgreich gelöscht");
      setLastError(null);
    } catch (error: any) {
      console.error("Error in deleteProperty:", error);
      setLastError(`Fehler beim Löschen der Immobilie: ${error.message}`);
      toast.error("Fehler beim Löschen der Immobilie");
    }
  };
  
  // Get property by ID
  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };
  
  // Filter properties
  const filterProperties = (filters: Record<string, any>) => {
    let filtered = [...properties];
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status);
    }
    
    // Additional filters can be added here
    
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
