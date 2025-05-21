
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyGrid from '@/components/embed/PropertyGrid';
import PropertyDetail from '@/components/embed/PropertyDetail';
import { Property } from '@/types/property';
import { useSearchParams, useLocation, useParams } from 'react-router-dom';

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
            highlights: item.highlights || [],
            images: item.images || [],
            floorPlans: item.floorPlans || [],
            details: item.details || {},
            energy: item.energy || {
              certificateAvailable: false
            },
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
          highlights: data.highlights || [],
          images: data.images || [],
          floorPlans: data.floorPlans || [],
          details: data.details || {},
          energy: data.energy || {
            certificateAvailable: false
          },
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
