
import { useState } from "react";
import PropertyGrid from "@/components/embed/PropertyGrid";
import PropertyDetail from "@/components/embed/PropertyDetail";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";

const EmbedPage = () => {
  const { getActiveProperties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const activeProperties = getActiveProperties();
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
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
