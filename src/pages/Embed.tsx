
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
      return fallback;
    }
  }
  
  return fallback;
};

export default function Embed() {
  const [searchParams] = useSearchParams();
  // Support both 'company' and 'companyId' parameters for backward compatibility
  const companyId = searchParams.get('company') || searchParams.get('companyId');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DEBUG: Log company ID immediately
  console.log('🔍 EMBED DEBUG: Received company ID:', companyId);
  console.log('🔍 EMBED DEBUG: Search params:', Object.fromEntries(searchParams.entries()));

  // Optimized PostMessage Auto-Resize System
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let lastSentHeight = 0;
    
    const calculateAndSendHeight = () => {
      // Clear previous timeout
      clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        // Berechne die tatsächliche Content-Höhe ohne unnötige Margins
        const body = document.body;
        const html = document.documentElement;
        
        // Verwende nur die tatsächliche Scroll-Höhe ohne Buffer
        const contentHeight = Math.min(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        
        // Minimale sinnvolle Höhe
        const finalHeight = Math.max(contentHeight, 200);
        
        // Sende nur wenn sich die Höhe signifikant geändert hat
        if (Math.abs(finalHeight - lastSentHeight) > 5) {
          console.log('Embed: Sending optimized height:', finalHeight);
          
          // Sende Höhe an Parent Window ohne zusätzlichen Buffer
          window.parent.postMessage({
            type: 'RESIZE_IFRAME',
            height: finalHeight,
            source: 'immo-embed',
            timestamp: Date.now()
          }, '*');
          
          lastSentHeight = finalHeight;
        }
      }, 50);
    };

    // Nach dem Laden der Properties
    if (!loading) {
      calculateAndSendHeight();
    }

    // Bei Window Resize (debounced)
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateAndSendHeight, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, properties.length]);

  // Load properties for the grid
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 EMBED DEBUG: Starting fetchProperties...');
        console.log('🔍 EMBED DEBUG: Company ID to filter by:', companyId);
        
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
        
        console.log('🔍 EMBED DEBUG: Base query created (status = active)');
        
        // Filter by company if companyId is present
        if (companyId) {
          query = query.eq('company_id', companyId);
          console.log('🔍 EMBED DEBUG: Added company_id filter:', companyId);
        } else {
          console.log('🔍 EMBED DEBUG: NO company ID provided - will fetch ALL active properties!');
        }
          
        console.log('🔍 EMBED DEBUG: Executing Supabase query...');
        const { data, error } = await query;
        
        console.log('🔍 EMBED DEBUG: Supabase response received');
        console.log('🔍 EMBED DEBUG: Error:', error);
        console.log('🔍 EMBED DEBUG: Data length:', data?.length || 0);
        console.log('🔍 EMBED DEBUG: Raw data:', data);
        
        if (error) {
          console.error('🔍 EMBED DEBUG: Supabase error:', error);
          setError(error.message);
          return;
        }
        
        if (!data || data.length === 0) {
          console.log('🔍 EMBED DEBUG: No properties found in database');
          console.log('🔍 EMBED DEBUG: This could mean:');
          console.log('🔍 EMBED DEBUG: 1. No properties exist for company_id:', companyId);
          console.log('🔍 EMBED DEBUG: 2. Properties exist but have wrong status (not "active")');
          console.log('🔍 EMBED DEBUG: 3. Company ID mismatch');
          setProperties([]);
          setLoading(false);
          return;
        }
        
        console.log('🔍 EMBED DEBUG: Found', data.length, 'properties, formatting...');
        
        // Format the data
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
        
        const formattedData: Property[] = data.map((item: any) => {
          console.log('🔍 EMBED DEBUG: Formatting property:', item.id, 'title:', item.title);
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
        
        console.log('🔍 EMBED DEBUG: Formatted', formattedData.length, 'properties successfully');
        console.log('🔍 EMBED DEBUG: Final properties:', formattedData.map(p => ({ id: p.id, title: p.title, company_id: p.company_id, status: p.status })));
        
        setProperties(formattedData);
      } catch (error: any) {
        console.error('🔍 EMBED DEBUG: Catch block error:', error);
        setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
      } finally {
        setLoading(false);
        console.log('🔍 EMBED DEBUG: fetchProperties completed');
      }
    };

    fetchProperties();
  }, [companyId]);

  return (
    <div className="w-full bg-white" style={{ 
      padding: '0', 
      margin: '0', 
      minHeight: 'auto',
      overflow: 'visible'
    }}>
      <PropertyGrid properties={properties} loading={loading} error={error} />
    </div>
  );
}
