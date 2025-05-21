
import { useState, useEffect } from "react";
import PropertyGrid from "@/components/embed/PropertyGrid";
import PropertyDetail from "@/components/embed/PropertyDetail";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";

const EmbedPage = () => {
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  
  // Update active properties whenever the properties list changes
  useEffect(() => {
    // Enhanced debugging
    console.log("Raw properties array:", properties);
    console.log("Properties length:", properties.length);
    
    // Check localStorage directly for debugging
    const storedProps = localStorage.getItem("properties");
    console.log("Properties in localStorage:", storedProps ? JSON.parse(storedProps) : "none");
    
    // Filter active properties with additional logging
    const active = properties.filter(property => {
      console.log(`Property ${property.id} status: ${property.status}`);
      return property.status === 'active';
    });
    
    console.log("Active properties:", active);
    console.log("All properties:", properties);
    
    setActiveProperties(active);
  }, [properties]);
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
  };
  
  // Add a debugging UI element if needed
  const debugInfo = (
    <div className="hidden">
      <p>Total properties: {properties.length}</p>
      <p>Active properties: {activeProperties.length}</p>
      <p>Properties data: {JSON.stringify(properties)}</p>
    </div>
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      {debugInfo}
      
      <PropertyGrid 
        properties={activeProperties} 
        onPropertyClick={handlePropertyClick}
      />
      
      <PropertyDetail 
        property={selectedProperty}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

export default EmbedPage;
