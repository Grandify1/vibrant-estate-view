
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Property } from "@/types/property";
import { Separator } from "@/components/ui/separator";
import { Bath, Bed, Calendar, Home, MapPin, Ruler } from "lucide-react";
import PropertyContactForm from "./ContactForm";

interface PropertyDetailProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetail({ property, isOpen, onClose }: PropertyDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  
  // Reset values when property changes
  useEffect(() => {
    if (property && property.images) {
      setActiveImageIndex(0);
      setImagesLoaded(Array(property.images.length).fill(false));
    }
  }, [property?.id]);
  
  if (!property) return null;
  
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
  
  // Simplified image component with proper error handling
  const PropertyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    
    return (
      <div className="relative w-full h-full">
        {!loaded && !error && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {error ? (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Bild nicht verfügbar</span>
          </div>
        ) : (
          <img 
            src={src}
            alt={alt}
            className={className}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ display: loaded ? 'block' : 'none' }}
          />
        )}
      </div>
    );
  };
  
  // Custom button component for image navigation
  const NavButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 ${direction === 'prev' ? 'left-2' : 'right-2'} 
                   bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10`}
        aria-label={direction === 'prev' ? 'Vorheriges Bild' : 'Nächstes Bild'}
      >
        {direction === 'prev' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        )}
      </button>
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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Linke Spalte - Bildgalerie */}
          <div className="md:col-span-2 relative">
            {/* Hauptbild */}
            <div className="aspect-[4/3] bg-gray-100 relative">
              <PropertyImage 
                src={getValidImageUrl(images[activeImageIndex]?.url)}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigationsbuttons */}
              {images.length > 1 && (
                <>
                  <NavButton direction="prev" onClick={handlePrevClick} />
                  <NavButton direction="next" onClick={handleNextClick} />
                </>
              )}
            </div>
            
            {/* Miniaturbilder */}
            {images.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id || `img-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden ${
                      index === activeImageIndex 
                        ? 'ring-2 ring-estate' 
                        : 'ring-1 ring-transparent'
                    }`}
                  >
                    <PropertyImage
                      src={getValidImageUrl(image.url)}
                      alt={`Bild ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Rechte Spalte - Immobiliendetails */}
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold">{property.title}</h2>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}
            </p>
            
            <div className="mt-4">
              <div className="text-2xl font-bold text-estate">
                {property.details.price ? `${formatNumber(property.details.price)} €` : "Auf Anfrage"}
              </div>
            </div>
            
            {property.highlights && property.highlights.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">Highlights</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {property.highlights.map((highlight) => (
                    <span key={highlight.id} className="estate-badge bg-estate/10 text-estate">
                      {highlight.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-6 mt-6">
              {property.details.livingArea && (
                <div className="flex flex-col items-center">
                  <Ruler className="h-6 w-6 text-estate" />
                  <span className="text-sm text-gray-500 mt-1">Wohnfläche</span>
                  <span className="font-medium">{property.details.livingArea} m²</span>
                </div>
              )}
              
              {property.details.rooms && (
                <div className="flex flex-col items-center">
                  <Home className="h-6 w-6 text-estate" />
                  <span className="text-sm text-gray-500 mt-1">Zimmer</span>
                  <span className="font-medium">{property.details.rooms}</span>
                </div>
              )}
              
              {property.details.bedrooms && (
                <div className="flex flex-col items-center">
                  <Bed className="h-6 w-6 text-estate" />
                  <span className="text-sm text-gray-500 mt-1">Schlafzimmer</span>
                  <span className="font-medium">{property.details.bedrooms}</span>
                </div>
              )}
              
              {property.details.bathrooms && (
                <div className="flex flex-col items-center">
                  <Bath className="h-6 w-6 text-estate" />
                  <span className="text-sm text-gray-500 mt-1">Badezimmer</span>
                  <span className="font-medium">{property.details.bathrooms}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Vertikal gestapelte Abschnitte */}
        <div className="p-4 md:p-6 space-y-8">
          {/* Details-Abschnitt */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                <div>
                  <h4 className="font-medium mb-4">Energieausweis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {renderDetailItem("Energieausweis Typ", property.energy.certificateType)}
                    {renderDetailItem("Endenergieverbrauch", property.energy.energyConsumption ? `${property.energy.energyConsumption} kWh/(m²·a)` : undefined)}
                    {renderDetailItem("Energieeffizienzklasse", property.energy.energyEfficiencyClass)}
                    {renderDetailItem("Baujahr lt. Energieausweis", property.energy.constructionYear)}
                    {renderDetailItem("Gültig bis", property.energy.validUntil)}
                    {renderDetailItem("Erstellt am", property.energy.createdAt)}
                  </div>
                </div>
              </>
            )}
            
            {property.floorPlans && property.floorPlans.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-medium mb-4">Grundrisse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.floorPlans.map(plan => (
                      <div key={plan.id} className="border rounded-lg overflow-hidden">
                        <div className="p-2 bg-gray-50 border-b">
                          <h4 className="font-medium">{plan.name}</h4>
                        </div>
                        <div className="aspect-property bg-gray-100 relative h-48">
                          <PropertyImage
                            src={getValidImageUrl(plan.url)}
                            alt={plan.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Beschreibungsabschnitt */}
          {property.description && (
            <div className="bg-gray-50 rounded-lg p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Beschreibung</h3>
              <div className="prose max-w-none">
                {property.description.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Ausstattungsabschnitt */}
          {property.amenities && (
            <div className="bg-gray-50 rounded-lg p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Ausstattung</h3>
              <div className="prose max-w-none">
                {property.amenities.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Standortabschnitt */}
          {property.location && (
            <div className="bg-gray-50 rounded-lg p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Lage</h3>
              <div className="prose max-w-none">
                {property.location.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Kontaktabschnitt */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-4">Kontakt</h3>
            <PropertyContactForm propertyTitle={property.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
