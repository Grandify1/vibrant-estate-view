import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '@/utils/imageCompression';

interface UsePropertiesProps {
  companyId?: string;
}

interface PropertyFilter {
  searchTerm?: string;
  status?: 'active' | 'sold' | 'archived' | 'all';
}

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
          setProperties(data as Property[]);
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
  
  const addProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'image_urls'>, images: File[]): Promise<Property | null> => {
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
      
      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...property, company_id: user.company_id, image_urls: imageUrls }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProperties(prevProperties => [...prevProperties, data as Property]);
      return data as Property;
    } catch (err) {
      console.error("Error adding property:", err);
      toast.error("Fehler beim Hinzufügen der Immobilie");
      return null;
    }
  };
  
  const updateProperty = async (id: string, updates: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>, newImages?: File[]): Promise<Property | null> => {
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
      
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProperties(prevProperties =>
        prevProperties.map(property => (property.id === id ? { ...property, ...data } : property))
      );
      
      return data as Property;
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
      const compressedResult = await compressImage(file);
      
      // Here's the fixed part - make sure we're using the correct structure
      // from the compression result
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, compressedResult, {
          contentType: `image/${compressedResult.type.split('/')[1]}`,
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
