
import { useState, useEffect, useRef } from "react";
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
  
  // Reference to container for height calculation
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      retryOperation(); // Get properties again when back online
    };
    
    const handleOffline = () => {
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
  
  // Update active properties when properties list changes
  useEffect(() => {
    if (!loading && properties && properties.length > 0) {
      // Filter only active properties
      const active = properties.filter(property => property.status === 'active');
      
      // Set active properties from filtered list
      setActiveProperties(active);
    } else {
      setActiveProperties([]);
    }
  }, [properties, loading]);

  // Update parent iframe height when content changes
  useEffect(() => {
    const updateFrameHeight = () => {
      if (containerRef.current && window.parent !== window) {
        const height = containerRef.current.offsetHeight;
        window.parent.postMessage({ type: 'resize-iframe', height: height + 16 }, '*');
      }
    };

    // Update height initially and when properties or detail state changes
    updateFrameHeight();
    
    // Add a small delay to account for content rendering
    const timer = setTimeout(updateFrameHeight, 100);

    // Add resize event listener
    window.addEventListener('resize', updateFrameHeight);
    
    // Listen for messages from parent window
    const handleParentMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'parent-resize') {
        updateFrameHeight();
      }
    };
    window.addEventListener('message', handleParentMessage);

    // Create MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      updateFrameHeight();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true 
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateFrameHeight);
      window.removeEventListener('message', handleParentMessage);
      observer.disconnect();
    };
  }, [activeProperties, loading, detailOpen, lastError, isOffline]);
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };
  
  const handleRetry = () => {
    retryOperation();
  };
  
  return (
    <div ref={containerRef} className="embed-container py-6 px-4">
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
      
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty}
          isOpen={detailOpen}
          onClose={handleDetailClose}
        />
      )}
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
