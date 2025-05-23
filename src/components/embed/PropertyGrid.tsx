
import React, { useState, useEffect } from "react";
import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, loading, error }) => {
  // Pre-calculate external URLs to avoid recalculation on each render
  const [externalUrls, setExternalUrls] = useState<Record<string, string>>({});
  
  // Calculate external URLs once when properties change
  useEffect(() => {
    if (properties && properties.length > 0) {
      const urls: Record<string, string> = {};
      const baseUrl = getBaseUrl();
      
      properties.forEach(property => {
        urls[property.id] = `${baseUrl}/property/${property.id}`;
      });
      
      setExternalUrls(urls);
    }
  }, [properties]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-red-500 font-medium">Fehler beim Laden der Daten</div>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <h3 className="text-lg font-medium text-gray-700">Keine Immobilien gefunden</h3>
        <p className="text-gray-500 mt-2">
          Derzeit sind keine aktiven Immobilienangebote verfügbar.
        </p>
      </div>
    );
  }
  
  // Function to get the base URL for external links
  function getBaseUrl(): string {
    // Get the current hostname but not localhost
    const hostname = window.location.hostname === 'localhost' ? 'as-immobilien.info' : window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}`;
  }
  
  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(property => (
          <a 
            key={property.id} 
            href={externalUrls[property.id] || `${getBaseUrl()}/property/${property.id}`} 
            className="no-underline text-inherit block"
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Öffne Details zu ${property.title}`}
          >
            <PropertyCard property={property} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
