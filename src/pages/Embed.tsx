
import { useState, useEffect } from "react";
import PropertyGrid from "@/components/embed/PropertyGrid";
import PropertyDetail from "@/components/embed/PropertyDetail";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";

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
    
    // Wenn keine aktiven Properties gefunden wurden, verwenden wir die Demo-Properties
    const propertiesToDisplay = active.length > 0 ? active : demoProperties;
    console.log("Properties to display:", propertiesToDisplay);
    
    setActiveProperties(propertiesToDisplay);
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
