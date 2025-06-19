
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
  const companyId = searchParams.get('company') || searchParams.get('companyId');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔥 EMBED: Starting with company ID:', companyId);
  console.log('🔥 EMBED: Full URL params:', window.location.search);
  console.log('🔥 EMBED: All search params:', Object.fromEntries(searchParams.entries()));

  // Auto-Resize System
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let lastSentHeight = 0;
    
    const calculateAndSendHeight = () => {
      clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        const body = document.body;
        const html = document.documentElement;
        
        const contentHeight = Math.min(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        
        const finalHeight = Math.max(contentHeight, 200);
        
        if (Math.abs(finalHeight - lastSentHeight) > 5) {
          console.log('📏 EMBED: Sending height:', finalHeight);
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

    if (!loading) {
      calculateAndSendHeight();
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateAndSendHeight, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, properties.length]);

  // Load properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('🚀 EMBED: Starting property fetch...');
        setLoading(true);
        setError(null);
        
        // First, let's try to get ALL properties to see what's in the database
        console.log('🔍 EMBED: Fetching ALL properties first for debugging...');
        const { data: allData, error: allError } = await supabase
          .from('properties')
          .select('*');
        
        console.log('📊 EMBED: ALL properties in database:', allData?.length || 0);
        console.log('📊 EMBED: ALL properties data:', allData);
        
        if (allError) {
          console.error('❌ EMBED: Error fetching all properties:', allError);
        }

        // Now let's build our actual query
        let query = supabase
          .from('properties')
          .select('*');
        
        console.log('🔍 EMBED: Building query with company filter...');
        
        if (companyId) {
          console.log('🔍 EMBED: Adding company filter for:', companyId);
          query = query.eq('company_id', companyId);
        } else {
          console.log('⚠️ EMBED: NO COMPANY ID - will fetch all properties');
        }

        // Let's try WITHOUT status filter first
        console.log('🔍 EMBED: Executing query WITHOUT status filter...');
        const { data: dataWithoutStatus, error: errorWithoutStatus } = await query;
        
        console.log('📊 EMBED: Properties without status filter:', dataWithoutStatus?.length || 0);
        console.log('📊 EMBED: Properties without status filter data:', dataWithoutStatus);
        
        if (errorWithoutStatus) {
          console.error('❌ EMBED: Error without status filter:', errorWithoutStatus);
        }

        // Now with status filter
        console.log('🔍 EMBED: Executing query WITH status=active filter...');
        query = query.eq('status', 'active');
        const { data, error } = await query;
        
        console.log('📊 EMBED: Final query result count:', data?.length || 0);
        console.log('📊 EMBED: Final query result data:', data);
        console.log('📊 EMBED: Final query error:', error);
        
        if (error) {
          console.error('❌ EMBED: Supabase error:', error);
          setError(error.message);
          return;
        }
        
        if (!data || data.length === 0) {
          console.log('⚠️ EMBED: No properties found');
          
          // Let's check what company IDs exist in the database
          const { data: companyData, error: companyError } = await supabase
            .from('properties')
            .select('company_id')
            .not('company_id', 'is', null);
          
          console.log('🏢 EMBED: Company IDs in database:', companyData?.map(p => p.company_id));
          console.log('🏢 EMBED: Looking for company ID:', companyId);
          
          setProperties([]);
          setLoading(false);
          return;
        }
        
        console.log('✅ EMBED: Processing properties...');
        
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
        
        const formattedData: Property[] = data.map((item: any, index: number) => {
          console.log(`🏠 EMBED: Processing property ${index + 1}:`, item.title);
          
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
        
        console.log('✅ EMBED: Formatted properties:', formattedData.length);
        console.log('✅ EMBED: Setting properties and finishing load...');
        
        setProperties(formattedData);
      } catch (error: any) {
        console.error('💥 EMBED: Catch block error:', error);
        setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
      } finally {
        console.log('🏁 EMBED: Setting loading to false');
        setLoading(false);
      }
    };

    console.log('🎯 EMBED: useEffect triggered, calling fetchProperties');
    fetchProperties();
  }, [companyId]);

  console.log('🖼️ EMBED: Rendering with state:', { 
    loading, 
    error, 
    propertiesCount: properties.length,
    companyId 
  });

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
