
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyGrid from "@/components/embed/PropertyGrid";
import { Property } from "@/types/property";
import { useSearchParams } from "react-router-dom";

const EmbedPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  // Unternehmen-ID aus den Suchparametern holen
  const companyId = searchParams.get('company');

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        setError(null);
        
        // Erstelle die Basisabfrage
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
          
        // Wenn eine Firmen-ID vorhanden ist, filtere nach dieser
        if (companyId) {
          query = query.eq('company_id', companyId);
        }
        
        // Führe die Abfrage aus
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Konvertiere die Supabase-Daten in das Frontend-Format
        const convertedProperties = data.map((item) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          status: item.status,
          highlights: item.highlights || [],
          images: item.images || [],
          floorPlans: item.floor_plans || [],
          details: item.details || {},
          energy: item.energy || { certificateAvailable: false },
          description: item.description || '',
          amenities: item.amenities || '',
          location: item.location || '',
          agent_id: item.agent_id || null,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        setProperties(convertedProperties);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'Fehler beim Laden der Immobilien');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [companyId]);

  return (
    <div className="w-full h-full">
      <PropertyGrid
        properties={properties}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default EmbedPage;
