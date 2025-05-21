
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyGrid from '@/components/embed/PropertyGrid';
import { Property } from '@/types/property';
import { useSearchParams } from 'react-router-dom';

export default function Embed() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
        
        // Wenn eine Firmen-ID vorhanden ist, nach dieser filtern
        if (companyId) {
          query = query.eq('company_id', companyId);
        }
          
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching properties:', error);
          setError(error.message);
          return;
        }
        
        // Konvertiere die Daten in das korrekte Format
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

    fetchProperties();
  }, [companyId]);

  return (
    <div className="w-full bg-white py-2">
      <PropertyGrid properties={properties} loading={loading} error={error} />
    </div>
  );
}
