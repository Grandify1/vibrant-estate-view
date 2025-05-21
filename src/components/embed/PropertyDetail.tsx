
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Property } from "@/types/property";
import { Separator } from "@/components/ui/separator";
import { Bath, Bed, Calendar, Home, MapPin, Ruler } from "lucide-react";
import PropertyContactForm from "./ContactForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PropertyDetailProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetail({ property, isOpen, onClose }: PropertyDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Reset active image index when property changes
    setActiveImageIndex(0);
    setImagesLoaded({});
  }, [property?.id]);
  
  if (!property) return null;
  
  const formatNumber = (value: string) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Enhanced image handling
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      console.log('Invalid detail image URL detected, using placeholder');
      return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
    }
    
    // Check if image URL is valid
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (e) {
      console.log('Invalid detail image URL format:', imageUrl);
      return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
    }
  };
  
  // Get all images, ensuring we have at least one
  const getImages = () => {
    if (!property.images || property.images.length === 0) {
      return [{
        id: "placeholder",
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
        isFeatured: true
      }];
    }
    
    // Sort images to put featured one first
    return [...property.images].sort((a, b) => {
      if (a.isFeatured) return -1;
      if (b.isFeatured) return 1;
      return 0;
    });
  };
  
  // Progressive image component with loading state
  const ImageWithFallback = ({ src, alt, className, onLoad }: { 
    src: string; 
    alt: string; 
    className: string;
    onLoad?: () => void;
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    
    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img 
          src={src}
          alt={alt}
          className={className}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={(e) => {
            console.log('Image failed to load:', (e.target as HTMLImageElement).src);
            setError(true);
            setIsLoading(false);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&auto=format&fit=crop';
          }}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      </div>
    );
  };
  
  const images = getImages();
  console.log("Detail view images:", images);
  const currentImage = images[activeImageIndex]?.url;
  
  const handleImageLoaded = (imgId: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imgId]: true
    }));
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
        <DialogTitle className="sr-only">Immobiliendetails</DialogTitle>
        <DialogDescription className="sr-only">Detaillierte Informationen zur Immobilie</DialogDescription>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Left column - Image gallery */}
          <div className="md:col-span-2 relative">
            <div className="aspect-[4/3] bg-gray-100">
              {currentImage && (
                <ImageWithFallback 
                  src={getImageUrl(currentImage)}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {images.length > 1 && (
              <div className="p-4 overflow-x-auto">
                <Carousel 
                  className="w-full"
                  opts={{
                    align: 'start',
                    loop: false,
                  }}
                >
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={image.id} className="basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/7">
                        <button
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-full h-16 flex-shrink-0 rounded border-2 overflow-hidden ${
                            index === activeImageIndex 
                              ? 'border-estate' 
                              : 'border-transparent'
                          }`}
                        >
                          <ImageWithFallback
                            src={getImageUrl(image.url)}
                            alt={`Bild ${index + 1}`}
                            className="w-full h-full object-cover"
                            onLoad={() => handleImageLoaded(image.id)}
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}
          </div>
          
          {/* Right column - Property details */}
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
            
            {property.highlights.length > 0 && (
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
        
        {/* Vertically stacked sections */}
        <div className="p-4 md:p-6 space-y-8">
          {/* Details section */}
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
            
            {property.energy.certificateAvailable && (
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
            
            {property.floorPlans.length > 0 && (
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
                          <ImageWithFallback
                            src={getImageUrl(plan.url)}
                            alt={plan.name}
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Description section */}
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
          
          {/* Amenities section */}
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
          
          {/* Location section */}
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
          
          {/* Contact section */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-4">Kontakt</h3>
            <PropertyContactForm propertyTitle={property.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
