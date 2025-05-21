
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyGrid from '@/components/embed/PropertyGrid';
import { Property, PropertyHighlight, PropertyImage, PropertyDetails, EnergyDetails, FloorPlan } from '@/types/property';
import { useSearchParams } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';

// Helper function to safely parse JSON data
const safelyParseJson = <T extends unknown>(jsonValue: Json | null, fallback: T): T => {
  if (!jsonValue) return fallback;
  
  if (typeof jsonValue === 'object') {
    return jsonValue as unknown as T;
  }
  
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue) as T;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return fallback;
    }
  }
  
  return fallback;
};

export default function Embed() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load properties for the grid
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
        
        // Filter by company if companyId is present
        if (companyId) {
          query = query.eq('company_id', companyId);
        }
          
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching properties:', error);
          setError(error.message);
          return;
        }
        
        // Format the data
        const formattedData: Property[] = data.map((item: any) => {
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
            propertyType: '',
            availableFrom: '',
            maintenanceFee: '',
            constructionYear: '',
            condition: '',
            heatingType: '',
            energySource: '',
            floor: '',
            totalFloors: '',
            parkingSpaces: ''
          };
          const emptyEnergy: EnergyDetails = {
            certificateAvailable: false,
            includesWarmWater: false
          };
          
          return {
            id: item.id,
            title: item.title || '',
            address: item.address || '',
            description: item.description || '',
            amenities: item.amenities || '',
            location: item.location || '',
            status: item.status as 'active' | 'sold' | 'archived',
            company_id: item.company_id,
            agent_id: item.agent_id,
            highlights: safelyParseJson<PropertyHighlight[]>(item.highlights, emptyHighlights),
            images: safelyParseJson<PropertyImage[]>(item.images, emptyImages),
            floorPlans: safelyParseJson<FloorPlan[]>(item.floor_plans, emptyFloorPlans),
            details: safelyParseJson<PropertyDetails>(item.details, emptyDetails),
            energy: safelyParseJson<EnergyDetails>(item.energy, emptyEnergy),
            createdAt: item.created_at,
            updatedAt: item.updated_at
          };
        });
        
        setProperties(formattedData);
      } catch (error: any) {
        console.error('Error in fetchProperties:', error);
        setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [companyId]);

  // Render only the grid in the embed view
  return (
    <div className="w-full bg-white py-2">
      <PropertyGrid properties={properties} loading={loading} error={error} />
    </div>
  );
}
