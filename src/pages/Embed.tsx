
import { useState, useEffect } from "react";
import PropertyGrid from "@/components/embed/PropertyGrid";
import PropertyDetail from "@/components/embed/PropertyDetail";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";
import { PropertiesProvider } from "@/hooks/useProperties"; 

const EmbedPageContent = () => {
  const { properties, loading, lastError, retryOperation } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored, back online");
      setIsOffline(false);
      retryOperation(); // Fetch properties when back online
    };
    
    const handleOffline = () => {
      console.log("Connection lost, offline");
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [retryOperation]);
  
  // Update active properties whenever the properties list changes
  useEffect(() => {
    // Enhanced debugging
    console.log("Raw properties array:", properties);
    console.log("Properties length:", properties.length);
    console.log("Loading state:", loading);
    
    // Check if images have valid URLs (not blob urls)
    properties.forEach((property, index) => {
      console.log(`Property ${index} (${property.id}) images:`, property.images);
      if (property.images && property.images.length > 0) {
        property.images.forEach((img, i) => {
          console.log(`Image ${i} URL: ${img.url}, isFeatured: ${img.isFeatured}`);
        });
      } else {
        console.log(`Property ${index} has no images.`);
      }
    });
    
    // Filter for only active properties with additional logging
    const active = properties.filter(property => {
      console.log(`Property ${property.id} status: ${property.status}`);
      return property.status === 'active';
    });
    
    console.log("Active properties:", active);
    
    // Set active properties from filtered list, never show demo properties
    setActiveProperties(loading ? [] : active);
  }, [properties, loading]);
  
  const handlePropertyClick = (property: Property) => {
    console.log("Property clicked:", property);
    console.log("Property images:", property.images);
    setSelectedProperty(property);
    setDetailOpen(true);
  };

  const handleRetry = () => {
    retryOperation();
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {isOffline ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl mb-4">Keine Internetverbindung</p>
          <p className="mb-4">Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          <span className="ml-3">Immobilien werden geladen...</span>
        </div>
      ) : lastError ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl mb-4">Fehler beim Laden der Immobilien</p>
          <p className="mb-4">{lastError}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      ) : activeProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl mb-4">Derzeit alle Immobilien verkauft</p>
          <p>Aktuell sind alle Immobilien verkauft oder reserviert.</p>
        </div>
      ) : (
        <PropertyGrid 
          properties={activeProperties} 
          onPropertyClick={handlePropertyClick}
        />
      )}
      
      <PropertyDetail 
        property={selectedProperty}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

// Wrap the component with the PropertiesProvider
const EmbedPage = () => {
  return (
    <PropertiesProvider>
      <EmbedPageContent />
    </PropertiesProvider>
  );
};

export default EmbedPage;
