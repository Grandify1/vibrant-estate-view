
import React, { useState, useEffect } from "react";
import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import PropertyDetail from "./PropertyDetail";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, loading, error }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Reset selection when properties change
  useEffect(() => {
    setSelectedProperty(null);
    setIsModalOpen(false);
  }, [properties]);
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 font-medium">Fehler beim Laden der Daten</div>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">Keine Immobilien gefunden</h3>
        <p className="text-gray-500 mt-2">
          Derzeit sind keine aktiven Immobilienangebote verfügbar.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {properties.map(property => (
          <PropertyCard 
            key={property.id}
            property={property}
            onClick={() => handlePropertyClick(property)}
          />
        ))}
      </div>

      <PropertyDetail
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PropertyGrid;
