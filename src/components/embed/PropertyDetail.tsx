
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("details");
  
  if (!property) return null;
  
  const formatNumber = (value: string) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  const getFeaturedImage = () => {
    const featuredImg = property.images.find(img => img.isFeatured);
    return featuredImg ? featuredImg.url : (property.images[0]?.url || '');
  };
  
  const getImages = () => {
    // Put featured image first, then the rest
    const featured = property.images.find(img => img.isFeatured);
    if (!featured) return property.images;
    
    return [
      featured,
      ...property.images.filter(img => !img.isFeatured)
    ];
  };
  
  const images = getImages();
  const currentImage = images[activeImageIndex]?.url || getFeaturedImage();
  
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
          {/* Left column - Image gallery */}
          <div className="md:col-span-2 relative">
            <div className="aspect-[4/3] bg-gray-100">
              <img 
                src={currentImage} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="p-2 overflow-x-auto whitespace-nowrap">
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden ${
                        index === activeImageIndex 
                          ? 'border-estate' 
                          : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image.url} 
                        alt={`Bild ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
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
        
        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="description">Beschreibung</TabsTrigger>
              <TabsTrigger value="amenities">Ausstattung</TabsTrigger>
              <TabsTrigger value="location">Lage</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
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
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-4">Energieausweis</h3>
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
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-4">Grundrisse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.floorPlans.map(plan => (
                        <div key={plan.id} className="border rounded-lg overflow-hidden">
                          <div className="p-2 bg-gray-50 border-b">
                            <h4 className="font-medium">{plan.name}</h4>
                          </div>
                          <div className="aspect-property bg-gray-100">
                            <img 
                              src={plan.url} 
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
            </TabsContent>
            
            <TabsContent value="description">
              {property.description ? (
                <div className="prose max-w-none">
                  {property.description.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Beschreibung verfügbar.</p>
              )}
            </TabsContent>
            
            <TabsContent value="amenities">
              {property.amenities ? (
                <div className="prose max-w-none">
                  {property.amenities.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Ausstattungsinformationen verfügbar.</p>
              )}
            </TabsContent>
            
            <TabsContent value="location">
              {property.location ? (
                <div className="prose max-w-none">
                  {property.location.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Lageinformationen verfügbar.</p>
              )}
            </TabsContent>
            
            <TabsContent value="contact">
              <PropertyContactForm propertyTitle={property.title} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
