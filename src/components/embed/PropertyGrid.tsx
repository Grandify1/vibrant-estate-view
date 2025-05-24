
import React, { useState, useEffect } from "react";
import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8" style={{ margin: '0', padding: '32px 0' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 px-4" style={{ margin: '0' }}>
        <div className="text-red-500 font-medium">Fehler beim Laden der Daten</div>
        <p className="text-gray-600 mt-1">{error}</p>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-8 px-4" style={{ margin: '0' }}>
        <h3 className="text-lg font-medium text-gray-700">Keine Immobilien gefunden</h3>
        <p className="text-gray-500 mt-1">
          Derzeit sind keine aktiven Immobilienangebote verfügbar.
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full" style={{ 
      padding: '16px 8px 20px 8px', 
      margin: '0',
      minHeight: 'auto'
    }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ 
        marginBottom: '0'
      }}>
        {properties.map(property => (
          <a 
            key={property.id} 
            href={`https://immoupload.com/property/${property.id}`}
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
