
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyGrid from '@/components/embed/PropertyGrid';
import PropertyDetail from '@/components/embed/PropertyDetail';
import { Property, PropertyHighlight, PropertyImage, PropertyDetails, EnergyDetails, FloorPlan } from '@/types/property';
import { useSearchParams, useLocation, useParams } from 'react-router-dom';
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
  const location = useLocation();
  const { propertyId } = useParams<{ propertyId?: string }>();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Determine if we're on a property detail route
  const isPropertyDetailRoute = location.pathname.startsWith('/embed/property/');

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

    // Only load properties on the main embed page
    if (!isPropertyDetailRoute) {
      fetchProperties();
    }
  }, [companyId, isPropertyDetailRoute]);

  // Load a specific property for the detail view
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
        
        if (error) {
          console.error('Error fetching property details:', error);
          setError(error.message);
          return;
        }
        
        if (!data) {
          setError('Immobilie nicht gefunden');
          return;
        }
        
        // Default empty values for safe parsing
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
        
        // Format the property data
        const formattedProperty: Property = {
          id: data.id,
          title: data.title || '',
          address: data.address || '',
          description: data.description || '',
          amenities: data.amenities || '',
          location: data.location || '',
          status: data.status as 'active' | 'sold' | 'archived',
          company_id: data.company_id,
          agent_id: data.agent_id,
          highlights: safelyParseJson<PropertyHighlight[]>(data.highlights, emptyHighlights),
          images: safelyParseJson<PropertyImage[]>(data.images, emptyImages),
          floorPlans: safelyParseJson<FloorPlan[]>(data.floor_plans, emptyFloorPlans),
          details: safelyParseJson<PropertyDetails>(data.details, emptyDetails),
          energy: safelyParseJson<EnergyDetails>(data.energy, emptyEnergy),
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setCurrentProperty(formattedProperty);
        setDetailOpen(true);
      } catch (error: any) {
        console.error('Error in fetchProperty:', error);
        setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch the property details when on a detail route
    if (isPropertyDetailRoute && propertyId) {
      fetchProperty();
    } else {
      setDetailOpen(false);
      setCurrentProperty(null);
    }
  }, [propertyId, isPropertyDetailRoute]);

  // Render either the grid or the detail view
  return (
    <div className="w-full bg-white py-2">
      {!isPropertyDetailRoute ? (
        <PropertyGrid properties={properties} loading={loading} error={error} />
      ) : (
        <PropertyDetail 
          property={currentProperty} 
          isOpen={detailOpen} 
          onClose={() => setDetailOpen(false)} 
        />
      )}
    </div>
  );
}
