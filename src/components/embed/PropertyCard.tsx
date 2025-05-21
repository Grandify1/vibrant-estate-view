
import React from "react";
import { Property } from "@/types/property";
import { Bath, Bed, Ruler } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Format price with dots as thousand separators
  const formatNumber = (value: string | undefined) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Get valid image URL or fallback
  const getValidImageUrl = (url: string | undefined): string => {
    if (!url) return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
  };

  // Get featured image or first image
  const getFeaturedImage = () => {
    if (!property.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
    }
    
    const featuredImage = property.images.find(img => img.isFeatured);
    return getValidImageUrl(featuredImage?.url || property.images[0].url);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img 
          src={getFeaturedImage()} 
          alt={property.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute top-2 right-2">
          {property.status === "sold" && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
              Verkauft
            </span>
          )}
          {property.status === "archived" && (
            <span className="px-2 py-1 bg-gray-700 text-white text-xs font-bold rounded-full uppercase">
              Archiviert
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{property.address}</p>
        
        <div className="flex items-center justify-between mt-4 mb-2">
          <div className="text-estate text-lg font-bold">
            {property.details.price ? `${formatNumber(property.details.price)} €` : "Auf Anfrage"}
          </div>
        </div>
        
        <div className="mt-auto pt-3 flex justify-between text-gray-600 text-sm border-t">
          {property.details.livingArea && (
            <div className="flex items-center">
              <Ruler className="h-4 w-4 mr-1" />
              <span>{property.details.livingArea} m²</span>
            </div>
          )}
          
          {property.details.rooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.details.rooms} Zimmer</span>
            </div>
          )}
          
          {property.details.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.details.bathrooms}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
