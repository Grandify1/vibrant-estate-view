
import React from 'react';
import { Property } from '@/types/property';
import { formatPrice } from '@/utils/formatUtils';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Finde das Hauptbild für die Karte
  const mainImage = property.images?.find(img => img.isFeatured) || property.images?.[0];
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        {mainImage ? (
          <img 
            src={mainImage.url} 
            alt={property.title} 
            className="object-cover w-full h-full" 
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Kein Bild</span>
          </div>
        )}
        
        {property.status === 'sold' && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
            Verkauft
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
        
        <p className="text-gray-600 text-sm mb-2 truncate">{property.address}</p>
        
        {property.details?.price && (
          <p className="font-bold text-primary">{formatPrice(Number(property.details.price))} €</p>
        )}
        
        <div className="flex mt-2 text-sm text-gray-600">
          {property.details?.livingArea && (
            <div className="mr-3">
              <span className="font-medium">{property.details.livingArea}</span> m²
            </div>
          )}
          
          {property.details?.rooms && (
            <div>
              <span className="font-medium">{property.details.rooms}</span> {property.details.rooms === "1" ? "Zimmer" : "Zimmer"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
