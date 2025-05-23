
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

  // Optimized height calculation and communication with parent
  useEffect(() => {
    const sendHeightToParent = () => {
      // Warte kurz, damit das Layout gerendert ist
      setTimeout(() => {
        const contentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        
        // Berechne die Anzahl der Reihen basierend auf der Bildschirmbreite und Anzahl Properties
        const screenWidth = window.innerWidth;
        let cardsPerRow = 1;
        
        if (screenWidth >= 1024) cardsPerRow = 3; // lg
        else if (screenWidth >= 640) cardsPerRow = 2; // sm
        
        const numberOfRows = Math.ceil(properties.length / cardsPerRow);
        
        // Geschätzte Kartenhöhe: 280px pro Karte + 12px gap zwischen Reihen + padding
        const estimatedCardHeight = 280;
        const gapBetweenRows = 12;
        const basePadding = 16; // 8px oben + 8px unten
        
        const estimatedHeight = (numberOfRows * estimatedCardHeight) + ((numberOfRows - 1) * gapBetweenRows) + basePadding;
        
        // Verwende die größere der beiden Höhen, aber füge einen kleinen Puffer hinzu
        const finalHeight = Math.max(contentHeight, estimatedHeight) + 20;
        
        window.parent.postMessage({ 
          type: 'resize-iframe', 
          height: finalHeight,
          source: 'immo-embed'
        }, '*');
      }, 100);
    };

    // Send initial height after content is rendered
    if (!loading && properties.length > 0) {
      sendHeightToParent();
    }

    // Listen for resize events
    window.addEventListener('resize', sendHeightToParent);
    
    // Listen for postMessage requests from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'request-height') {
        sendHeightToParent();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('resize', sendHeightToParent);
      window.removeEventListener('message', handleMessage);
    };
  }, [loading, properties.length]);

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
          setError(error.message);
          return;
        }
        
        if (!data || data.length === 0) {
          setProperties([]);
          setLoading(false);
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
