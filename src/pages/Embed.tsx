
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
  
  // Netzwerkstatus prüfen
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      retryOperation(); // Properties abrufen, wenn wieder online
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
  
  // Aktive Properties aktualisieren, wenn sich die Properties-Liste ändert
  useEffect(() => {
    if (!loading && properties && properties.length > 0) {
      // Filtern Sie nur aktive Properties
      const active = properties.filter(property => property.status === 'active');
      
      // Setzen Sie aktive Properties aus der gefilterten Liste
      setActiveProperties(active);
    } else {
      setActiveProperties([]);
    }
  }, [properties, loading]);
  
  const handlePropertyClick = (property: Property) => {
    // Vorbereitung vor dem Öffnen des Dialogs
    setSelectedProperty(null); // Zurücksetzen des alten Property
    
    // Verzögerung, um die Komponente vollständig zurückzusetzen
    setTimeout(() => {
      setSelectedProperty(property);
      setDetailOpen(true);
    }, 10);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    // Erst nach dem Schließen des Dialogs setSelectedProperty zurücksetzen
    setTimeout(() => {
      setSelectedProperty(null);
    }, 300);
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
