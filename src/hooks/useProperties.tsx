
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '@/utils/imageCompression';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        if (!user?.company_id) {
          setProperties([]);
          return;
        }
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('company_id', user.company_id);
        
        if (error) {
          setError(error);
          console.error("Failed to fetch properties:", error);
        } else {
          // Transform database format to match our Property type
          const transformedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            address: item.address,
            status: item.status as 'active' | 'sold' | 'archived',
            highlights: item.highlights || [],
            images: item.images || [],
            floorPlans: item.floor_plans || [],
            details: item.details || {},
            energy: item.energy || {},
            description: item.description || '',
            amenities: item.amenities || '',
            location: item.location || '',
            agent_id: item.agent_id,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
          setProperties(transformedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [user?.company_id]);
  
  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>, images: File[]): Promise<Property | null> => {
    try {
      if (!user?.company_id) {
        throw new Error("User must be associated with a company to add properties.");
      }
      
      // Upload images and get URLs
      const imageUrls = [];
      for (const image of images) {
        const url = await uploadImage(image);
        imageUrls.push(url);
      }
      
      // Transform our Property type to match database schema
      const dbProperty = {
        title: property.title,
        address: property.address,
        status: property.status,
        highlights: property.highlights,
        images: property.images,
        floor_plans: property.floorPlans,
        details: property.details,
        energy: property.energy,
        description: property.description,
        amenities: property.amenities,
        location: property.location,
        agent_id: property.agent_id,
        company_id: user.company_id,
        image_urls: imageUrls
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert(dbProperty)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform response back to our Property type
      const newProperty: Property = {
        id: data.id,
        title: data.title,
        address: data.address,
        status: data.status as 'active' | 'sold' | 'archived',
        highlights: data.highlights || [],
        images: data.images || [],
        floorPlans: data.floor_plans || [],
        details: data.details || {},
        energy: data.energy || {},
        description: data.description || '',
        amenities: data.amenities || '',
        location: data.location || '',
        agent_id: data.agent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setProperties(prevProperties => [...prevProperties, newProperty]);
      return newProperty;
    } catch (err) {
      console.error("Error adding property:", err);
      toast.error("Fehler beim Hinzufügen der Immobilie");
      return null;
    }
  };
  
  const updateProperty = async (id: string, updates: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>, newImages?: File[]): Promise<Property | null> => {
    try {
      // Upload new images if provided
      let imageUrls: string[] | undefined = undefined;
      if (newImages && newImages.length > 0) {
        imageUrls = [];
        for (const image of newImages) {
          const url = await uploadImage(image);
          imageUrls.push(url);
        }
      }
      
      // Transform our Property type to match database schema
      const dbUpdates: any = {};
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
      if (imageUrls) dbUpdates.image_urls = imageUrls;
      
      const { data, error } = await supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform response back to our Property type
      const updatedProperty: Property = {
        id: data.id,
        title: data.title,
        address: data.address,
        status: data.status as 'active' | 'sold' | 'archived',
        highlights: data.highlights || [],
        images: data.images || [],
        floorPlans: data.floor_plans || [],
        details: data.details || {},
        energy: data.energy || {},
        description: data.description || '',
        amenities: data.amenities || '',
        location: data.location || '',
        agent_id: data.agent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setProperties(prevProperties =>
        prevProperties.map(property => (property.id === id ? updatedProperty : property))
      );
      
      return updatedProperty;
    } catch (err) {
      console.error("Error updating property:", err);
      toast.error("Fehler beim Aktualisieren der Immobilie");
      return null;
    }
  };
  
  const deleteProperty = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setProperties(prevProperties => prevProperties.filter(property => property.id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Fehler beim Löschen der Immobilie");
    }
  };
  
  const setPropertyStatus = async (id: string, status: 'active' | 'sold' | 'archived'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setProperties(prevProperties =>
        prevProperties.map(property => (property.id === id ? { ...property, status } : property))
      );
    } catch (err) {
      console.error("Error updating property status:", err);
      toast.error("Fehler beim Aktualisieren des Immobilienstatus");
    }
  };

  // Fix the image upload function to correctly handle the compressed image result
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      // Compress the image before uploading
      const compressedBlob = await compressImage(file);
      
      // Upload the compressed image to Supabase storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, compressedBlob, {
          contentType: `image/${file.type.split('/')[1] || 'jpeg'}`,
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    setPropertyStatus
  };
}

// Create a Provider component for useProperties
import { createContext, useContext, ReactNode } from 'react';

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  error: Error | null;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>, images: File[]) => Promise<Property | null>;
  updateProperty: (id: string, updates: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>, newImages?: File[]) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<void>;
  setPropertyStatus: (id: string, status: 'active' | 'sold' | 'archived') => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const propertiesData = useProperties();
  
  return (
    <PropertiesContext.Provider value={propertiesData}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function usePropertiesContext() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('usePropertiesContext must be used within a PropertiesProvider');
  }
  return context;
}
