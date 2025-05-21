
import { useState, useEffect } from "react";
import PropertyGrid from "@/components/embed/PropertyGrid";
import PropertyDetail from "@/components/embed/PropertyDetail";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";
import { PropertiesProvider } from "@/hooks/useProperties"; 

// Demo-Eigenschaften für den Fall, dass keine Immobilien gefunden werden
const demoProperties: Property[] = [
  {
    id: "demo1",
    title: "Moderne Villa mit Seeblick",
    address: "Seestraße 123, 10115 Berlin",
    status: "active",
    highlights: [
      { id: "h1", name: "Seeblick" },
      { id: "h2", name: "Garten" },
      { id: "h3", name: "Terrasse" }
    ],
    images: [
      { 
        id: "img1", 
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop", 
        isFeatured: true 
      },
      { 
        id: "img2", 
        url: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&auto=format&fit=crop", 
        isFeatured: false 
      }
    ],
    floorPlans: [
      {
        id: "fp1",
        name: "Erdgeschoss",
        url: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop"
      }
    ],
    details: {
      price: "1250000",
      livingArea: "280",
      plotArea: "1200",
      rooms: "8",
      bathrooms: "3",
      bedrooms: "4",
      propertyType: "Villa",
      availableFrom: "Sofort",
      maintenanceFee: "450",
      constructionYear: "2018",
      condition: "Neuwertig",
      heatingType: "Fußbodenheizung",
      energySource: "Erdwärme"
    },
    energy: {
      certificateAvailable: true,
      certificateType: "Bedarfsausweis",
      energyConsumption: "45",
      energyEfficiencyClass: "A",
      constructionYear: "2018",
      validUntil: "2028-05-15",
      createdAt: "2018-06-01"
    },
    description: "Diese luxuriöse Villa bietet einen atemberaubenden Blick auf den See und verfügt über modernste Ausstattung. Mit 8 großzügigen Zimmern, einer offenen Küche und einem weitläufigen Wohnbereich ist dieses Anwesen ideal für anspruchsvolle Familien.\n\nDie bodentiefen Fenster lassen viel Tageslicht herein und bieten einen ungehinderten Blick auf die malerische Umgebung.",
    amenities: "- Hochwertige Einbauküche\n- Fußbodenheizung in allen Räumen\n- Smart Home System\n- Doppelgarage mit Elektro-Ladestation\n- Saunabereich mit Ruheraum\n- Weinkeller\n- Alarmanlage und Videoüberwachung",
    location: "Die Villa befindet sich in einer exklusiven Wohngegend mit direktem Seezugang. Einkaufsmöglichkeiten, Restaurants und Schulen sind in wenigen Minuten erreichbar. Der Anschluss zur Autobahn ist nur 5 Minuten entfernt, die Innenstadt erreichen Sie in 15 Minuten.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "demo2",
    title: "Penthouse mit Dachterrasse",
    address: "Stadtplatz 45, 10117 Berlin",
    status: "active",
    highlights: [
      { id: "h1", name: "Dachterrasse" },
      { id: "h2", name: "Aufzug" },
      { id: "h3", name: "Einbauküche" }
    ],
    images: [
      { 
        id: "img1", 
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop", 
        isFeatured: true 
      },
      { 
        id: "img2", 
        url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop", 
        isFeatured: false 
      }
    ],
    floorPlans: [],
    details: {
      price: "850000",
      livingArea: "150",
      plotArea: "",
      rooms: "4",
      bathrooms: "2",
      bedrooms: "3",
      propertyType: "Penthouse",
      availableFrom: "01.08.2025",
      maintenanceFee: "350",
      constructionYear: "2020",
      condition: "Neuwertig",
      heatingType: "Zentralheizung",
      energySource: "Gas"
    },
    energy: {
      certificateAvailable: true,
      certificateType: "Verbrauchsausweis",
      energyConsumption: "75",
      energyEfficiencyClass: "B",
      constructionYear: "2020",
      validUntil: "2030-03-21",
      createdAt: "2020-04-15"
    },
    description: "Dieses exklusive Penthouse im Herzen der Stadt bietet einen atemberaubenden Panoramablick über die Skyline. Die großzügige Dachterrasse ist perfekt für Entspannung und Unterhaltung unter freiem Himmel.",
    amenities: "- Hochwertige Designerküche\n- Fußbodenheizung\n- Klimaanlage\n- Elektrische Rollläden\n- Tiefgaragenstellplatz\n- Kamin\n- Einbauschränke",
    location: "Zentrale Lage mit perfekter Anbindung an öffentliche Verkehrsmittel. Alle Annehmlichkeiten des städtischen Lebens wie Restaurants, Cafés, Theater und Einkaufsmöglichkeiten sind fußläufig erreichbar.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

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
    
    // Check image URLs in properties
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
    
    // Filter active properties with additional logging
    const active = properties.filter(property => {
      console.log(`Property ${property.id} status: ${property.status}`);
      return property.status === 'active';
    });
    
    console.log("Active properties:", active);
    console.log("All properties:", properties);
    
    // Wenn keine aktiven Properties gefunden wurden und nicht mehr im Ladezustand sind, verwenden wir die Demo-Properties
    // IMPORTANT: We'll check property.images.length to NOT use demo properties if real ones exist without images
    const shouldUseDemoProperties = 
      !loading && 
      (active.length === 0 || (active.length > 0 && active.every(p => !p.images || p.images.length === 0)));
    
    const propertiesToDisplay = loading ? [] : (shouldUseDemoProperties ? demoProperties : active);
    console.log("Properties to display:", propertiesToDisplay);
    
    setActiveProperties(propertiesToDisplay);
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
          <p className="text-xl mb-4">Keine aktiven Immobilien gefunden.</p>
          <p>Entweder wurden noch keine Immobilien hinzugefügt oder alle sind als verkauft/archiviert markiert.</p>
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
