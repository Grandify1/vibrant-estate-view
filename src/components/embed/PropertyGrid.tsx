
import { useState } from "react";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Bath, Bed, Home, MapPin, Ruler } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  // Get featured image or first image with proper URL handling
  const getMainImage = (property: Property) => {
    const featuredImage = property.images.find(img => img.isFeatured);
    let imageUrl = featuredImage ? featuredImage.url : (property.images[0]?.url || '');
    
    // Handle blob URLs and empty URLs
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop';
    }
    
    // Check if image URL is a valid URL
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (e) {
      return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop';
    }
  };
  
  // Format number with thousand separator
  const formatNumber = (value: string) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Progressive loading for images with placeholders
  const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
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
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            setError(true);
            setIsLoading(false);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&auto=format&fit=crop';
          }}
          style={{ opacity: isLoading ? 0 : 1 }}
          loading="eager" // Eager loading for faster display
        />
      </div>
    );
  };
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Keine Immobilien verfügbar</h3>
        <p className="text-muted-foreground mt-2">Es sind aktuell keine Immobilien verfügbar.</p>
      </div>
    );
  }
  
  const getPropertyDetailUrl = (propertyId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/property/${propertyId}`;
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="property-card overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <a 
              href={getPropertyDetailUrl(property.id)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer block"
            >
              <div className="h-48 w-full relative">
                <ImageWithFallback
                  src={getMainImage(property)}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded font-medium text-estate">
                  {property.details.price ? `${formatNumber(property.details.price)} €` : "Auf Anfrage"}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg truncate">{property.title}</h3>
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4">
                    {property.details.livingArea && (
                      <div className="flex items-center text-sm">
                        <Ruler className="h-4 w-4 mr-1" />
                        {property.details.livingArea} m²
                      </div>
                    )}
                    {property.details.rooms && (
                      <div className="flex items-center text-sm">
                        <Home className="h-4 w-4 mr-1" />
                        {property.details.rooms} Zi.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
