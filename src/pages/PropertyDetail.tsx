
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Calendar, ChevronLeft, ChevronRight, Home, Ruler, MapPin, Info } from "lucide-react";
import PropertyContactForm from "@/components/embed/ContactForm";
import { Lightbox } from "@/components/ui/lightbox";

export default function PropertyDetailPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { properties, loading, lastError, retryOperation } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Find property when properties load
  useEffect(() => {
    if (!loading && properties && propertyId) {
      const foundProperty = properties.find(p => p.id === propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }
  }, [propertyId, properties, loading]);
  
  // Reset image index when property changes
  useEffect(() => {
    if (property) {
      setActiveImageIndex(0);
    }
  }, [property?.id]);
  
  // Add meta tags to properly format the page
  useEffect(() => {
    if (property) {
      // Set page title
      document.title = `${property.title} | Immobilien`;
      
      // Remove any existing canonical links
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
      
      // Add canonical link
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = window.location.href;
      document.head.appendChild(canonicalLink);
      
      // Clean up when component unmounts
      return () => {
        document.title = 'Immobilien';
        if (canonicalLink.parentNode) {
          canonicalLink.parentNode.removeChild(canonicalLink);
        }
      };
    }
  }, [property]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="mt-4">Immobilie wird geladen...</span>
      </div>
    );
  }
  
  if (lastError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <p className="text-xl mb-4">Fehler beim Laden der Immobilie</p>
        <p className="mb-4">{lastError}</p>
        <Button onClick={retryOperation}>Erneut versuchen</Button>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <p className="text-xl mb-4">Immobilie nicht gefunden</p>
        <p className="mb-4">Die gesuchte Immobilie konnte nicht gefunden werden.</p>
        <Button onClick={() => window.close()}>Schließen</Button>
      </div>
    );
  }
  
  // Format price with dots as thousand separators
  const formatNumber = (value: string) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Get valid image URL or fallback
  const getValidImageUrl = (url: string | undefined): string => {
    if (!url) return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
  };

  // Get all images with validation
  const getImages = () => {
    if (!property.images || property.images.length === 0) {
      return [{
        id: "placeholder",
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
        isFeatured: true
      }];
    }
    return property.images;
  };
  
  const images = getImages();
  
  // Image component with proper error handling
  const PropertyImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    return (
      <div className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        {error ? (
          <div className={`flex items-center justify-center bg-gray-200 ${className} h-full`}>
            <span className="text-gray-500">Bild nicht verfügbar</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onError={() => setError(true)}
            onLoad={() => setLoaded(true)}
            loading="eager"
          />
        )}
      </div>
    );
  };
  
  const handlePrevClick = () => {
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };
  
  const handleNextClick = () => {
    setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };
  
  const renderDetailItem = (label: string, value: string | undefined) => {
    if (!value) return null;
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    );
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Back Button */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={() => window.close()} size="sm" className="mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Schließen
        </Button>
      </div>
      
      {/* Property Header */}
      <header className="px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
        <p className="text-gray-600 flex items-center mt-2">
          <MapPin className="h-4 w-4 mr-1" />
          {property.address}
        </p>
      </header>
      
      {/* Gallery Section */}
      <section className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl overflow-hidden">
          <div className="aspect-[16/9] relative bg-gray-100">
            <PropertyImage 
              src={getValidImageUrl(images[activeImageIndex]?.url)}
              alt={property.title}
              className="w-full h-full"
              onClick={openLightbox}
            />
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevClick}
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg z-10"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg z-10"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Price badge */}
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-md text-lg font-bold">
              {property.details.price ? `${formatNumber(property.details.price)} €` : "Auf Anfrage"}
            </div>
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex mt-2 space-x-2 overflow-x-auto py-2">
              {images.map((image, index) => (
                <button
                  key={image.id || `img-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden ${
                    index === activeImageIndex 
                      ? 'ring-2 ring-primary' 
                      : 'ring-1 ring-transparent hover:ring-gray-300'
                  }`}
                >
                  <PropertyImage
                    src={getValidImageUrl(image.url)}
                    alt={`Bild ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Lightbox */}
      <Lightbox 
        images={images.map(image => ({ id: image.id, url: getValidImageUrl(image.url) }))} 
        open={lightboxOpen} 
        initialIndex={activeImageIndex}
        onClose={() => setLightboxOpen(false)} 
      />
      
      {/* Property highlights/features */}
      {property.highlights && property.highlights.length > 0 && (
        <section className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {property.highlights.map((highlight) => (
              <Badge key={highlight.id} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {highlight.name}
              </Badge>
            ))}
          </div>
        </section>
      )}
      
      {/* Key Details */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {property.details.livingArea && (
            <div className="flex flex-col items-center text-center">
              <Ruler className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-gray-500">Wohnfläche</span>
              <span className="font-medium text-lg">{property.details.livingArea} m²</span>
            </div>
          )}
          
          {property.details.rooms && (
            <div className="flex flex-col items-center text-center">
              <Home className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-gray-500">Zimmer</span>
              <span className="font-medium text-lg">{property.details.rooms}</span>
            </div>
          )}
          
          {property.details.bedrooms && (
            <div className="flex flex-col items-center text-center">
              <Bed className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-gray-500">Schlafzimmer</span>
              <span className="font-medium text-lg">{property.details.bedrooms}</span>
            </div>
          )}
          
          {property.details.bathrooms && (
            <div className="flex flex-col items-center text-center">
              <Bath className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-gray-500">Badezimmer</span>
              <span className="font-medium text-lg">{property.details.bathrooms}</span>
            </div>
          )}
        </div>
      </section>
      
      {/* Description section */}
      {property.description && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Beschreibung</h2>
          <div className="prose max-w-none">
            {property.description.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </section>
      )}
      
      {/* Amenities section */}
      {property.amenities && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Ausstattung</h2>
          <div className="prose max-w-none">
            {property.amenities.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </section>
      )}
      
      {/* Details section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 bg-gray-50 py-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Objektdaten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-12">
          {renderDetailItem("Objekttyp", property.details.propertyType)}
          {renderDetailItem("Grundstücksfläche", property.details.plotArea ? `${property.details.plotArea} m²` : undefined)}
          {renderDetailItem("Wohnfläche", property.details.livingArea ? `${property.details.livingArea} m²` : undefined)}
          {renderDetailItem("Zimmer", property.details.rooms)}
          {renderDetailItem("Schlafzimmer", property.details.bedrooms)}
          {renderDetailItem("Badezimmer", property.details.bathrooms)}
          {renderDetailItem("Baujahr", property.details.constructionYear)}
          {renderDetailItem("Bezugsfrei ab", property.details.availableFrom)}
          {renderDetailItem("Objektzustand", property.details.condition)}
          {renderDetailItem("Heizungsart", property.details.heatingType)}
          {renderDetailItem("Energieträger", property.details.energySource)}
          {renderDetailItem("Hausgeld", property.details.maintenanceFee ? `${property.details.maintenanceFee} €` : undefined)}
        </div>
        
        {property.energy && property.energy.certificateAvailable && (
          <>
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Energieausweis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-12">
              {renderDetailItem("Energieausweis Typ", property.energy.certificateType)}
              {renderDetailItem("Endenergieverbrauch", property.energy.energyConsumption ? `${property.energy.energyConsumption} kWh/(m²·a)` : undefined)}
              {renderDetailItem("Energieeffizienzklasse", property.energy.energyEfficiencyClass)}
              {renderDetailItem("Baujahr lt. Energieausweis", property.energy.constructionYear)}
              {renderDetailItem("Gültig bis", property.energy.validUntil)}
              {renderDetailItem("Erstellt am", property.energy.createdAt)}
            </div>
          </>
        )}
      </section>
      
      {/* Floor plans */}
      {property.floorPlans && property.floorPlans.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Grundrisse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {property.floorPlans.map(plan => (
              <div key={plan.id} className="border rounded-xl overflow-hidden">
                <div className="p-3 bg-gray-50 border-b">
                  <h4 className="font-medium">{plan.name}</h4>
                </div>
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <PropertyImage
                    src={getValidImageUrl(plan.url)}
                    alt={plan.name}
                    className="w-full h-full object-contain"
                    onClick={() => {
                      setLightboxOpen(true);
                      setActiveImageIndex(images.findIndex(img => img.id === plan.id));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Location section */}
      {property.location && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Lage</h2>
          <div className="prose max-w-none mb-6">
            {property.location.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          {/* This is where you could add an interactive map */}
          <div className="aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Genaue Adresse auf Anfrage verfügbar</p>
            </div>
          </div>
        </section>
      )}
      
      {/* Contact section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 bg-gray-50 py-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Kontakt</h2>
        <PropertyContactForm propertyTitle={property.title} />
      </section>
    </div>
  );
}
