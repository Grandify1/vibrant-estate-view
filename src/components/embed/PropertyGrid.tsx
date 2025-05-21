
import { useState } from "react";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Bath, Bed, Home, MapPin, Ruler } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

export default function PropertyGrid({ properties, onPropertyClick }: PropertyGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Get featured image or first image with proper URL handling
  const getMainImage = (property: Property) => {
    const featuredImage = property.images.find(img => img.isFeatured);
    let imageUrl = featuredImage ? featuredImage.url : (property.images[0]?.url || '');
    
    // Handle blob URLs and empty URLs
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      console.log('Invalid image URL detected for property', property.id, ', using placeholder');
      return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop';
    }
    
    // Check if image URL is a valid URL
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (e) {
      console.log('Invalid image URL format:', imageUrl);
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
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Keine Immobilien verfügbar</h3>
        <p className="text-muted-foreground mt-2">Es sind aktuell keine Immobilien verfügbar.</p>
      </div>
    );
  }
  
  console.log("Properties in grid:", properties);
  properties.forEach(property => {
    console.log(`Property ${property.id} images:`, property.images);
    property.images.forEach(img => {
      console.log(`Image URL: ${img.url}, is blob: ${img.url?.startsWith('blob:')}, isFeatured: ${img.isFeatured}`);
    });
  });
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Unsere Immobilien</h2>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
          <TabsList>
            <TabsTrigger value="grid">
              <span className="sr-only">Rasteransicht</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </TabsTrigger>
            <TabsTrigger value="list">
              <span className="sr-only">Listenansicht</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="property-card overflow-hidden">
              <div onClick={() => onPropertyClick(property)} className="cursor-pointer">
                <div className="h-48 w-full relative">
                  <ImageWithFallback
                    src={getMainImage(property)}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
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
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Card key={property.id} className="property-card overflow-hidden">
              <div 
                onClick={() => onPropertyClick(property)} 
                className="cursor-pointer flex flex-col sm:flex-row"
              >
                <div className="sm:w-1/3 h-48 sm:h-auto relative">
                  <ImageWithFallback
                    src={getMainImage(property)}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:w-2/3 flex flex-col">
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">{property.title}</h3>
                    <p className="text-muted-foreground text-sm flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </p>
                    <div className="mt-2">
                      {property.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {property.highlights.slice(0, 3).map((highlight) => (
                            <span key={highlight.id} className="estate-badge bg-estate/10 text-estate">
                              {highlight.name}
                            </span>
                          ))}
                          {property.highlights.length > 3 && (
                            <span className="estate-badge bg-gray-100 text-gray-500">
                              +{property.highlights.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between mt-4">
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
                          {property.details.rooms} Zimmer
                        </div>
                      )}
                      {property.details.bedrooms && (
                        <div className="flex items-center text-sm">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.details.bedrooms} Schlafzimmer
                        </div>
                      )}
                      {property.details.bathrooms && (
                        <div className="flex items-center text-sm">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.details.bathrooms} Bäder
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0 font-medium text-estate">
                      {property.details.price ? `${formatNumber(property.details.price)} €` : "Auf Anfrage"}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
