import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload, FloorPlanUpload } from "./ImageUpload";
import { Property, PropertyHighlight, initialProperty, propertyTypes, propertyConditions, heatingTypes, energySources, energyEfficiencyClasses, certificateTypes } from "@/types/property";
import { toast } from "sonner";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export default function PropertyForm({ property = initialProperty, onSubmit, onCancel, isEditing = false, isSubmitting = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<Omit<Property, "id" | "createdAt" | "updatedAt">>({
    title: property.title,
    address: property.address,
    status: property.status,
    highlights: [...property.highlights],
    images: [...property.images],
    floorPlans: [...property.floorPlans],
    details: { ...property.details },
    energy: { ...property.energy },
    description: property.description,
    amenities: property.amenities,
    location: property.location
  });
  
  const [newHighlight, setNewHighlight] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData(prev => {
        if (section === "details") {
          return {
            ...prev,
            details: {
              ...prev.details,
              [field]: value
            }
          };
        } else if (section === "energy") {
          return {
            ...prev,
            energy: {
              ...prev.energy,
              [field]: value
            }
          };
        } 
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [section, subField] = field.split(".");
      if (section === "details") {
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            [subField]: value
          }
        }));
      } else if (section === "energy") {
        setFormData(prev => ({
          ...prev,
          energy: {
            ...prev.energy,
            [subField]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleSwitchChange = (field: string, checked: boolean) => {
    const [section, subField] = field.split(".");
    if (section === "energy") {
      setFormData(prev => ({
        ...prev,
        energy: {
          ...prev.energy,
          [subField]: checked
        }
      }));
    }
  };
  
  const handleImageChange = (images: Array<any>) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };
  
  const handleFloorPlanChange = (floorPlans: Array<any>) => {
    setFormData(prev => ({
      ...prev,
      floorPlans
    }));
  };
  
  const addHighlight = () => {
    if (!newHighlight.trim()) {
      toast.warning("Bitte geben Sie einen Highlight-Text ein");
      return;
    }
    
    if (formData.highlights.length >= 6) {
      toast.warning("Maximal 6 Highlights erlaubt");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      highlights: [
        ...prev.highlights, 
        { id: Date.now().toString(), name: newHighlight.trim() }
      ]
    }));
    
    setNewHighlight("");
  };
  
  const removeHighlight = (id: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(highlight => highlight.id !== id)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.warning("Bitte geben Sie einen Titel ein");
      return;
    }
    
    if (!formData.address.trim()) {
      toast.warning("Bitte geben Sie eine Adresse ein");
      return;
    }
    
    if (formData.images.length === 0) {
      toast.warning("Bitte laden Sie mindestens ein Bild hoch");
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
          <TabsTrigger value="basic">Grunddaten</TabsTrigger>
          <TabsTrigger value="images">Bilder</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="energy">Energieausweis</TabsTrigger>
          <TabsTrigger value="description">Beschreibungen</TabsTrigger>
          <TabsTrigger value="location">Lage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="z.B. Moderne Villa mit Meerblick"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="z.B. Musterstraße 1, 12345 Berlin"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Label>Highlights (max. 6)</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {formData.highlights.map((highlight) => (
                  <div 
                    key={highlight.id} 
                    className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    <span>{highlight.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeHighlight(highlight.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="z.B. Swimmingpool"
                  maxLength={30}
                />
                <Button 
                  type="button" 
                  onClick={addHighlight} 
                  disabled={formData.highlights.length >= 6}
                  className="shrink-0"
                >
                  Hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ImageUpload
                images={formData.images}
                onChange={handleImageChange}
                label="Immobilienfotos"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <FloorPlanUpload
                floorPlans={formData.floorPlans}
                onChange={handleFloorPlanChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="details.price">Kaufpreis (€)</Label>
                  <Input 
                    id="details.price" 
                    name="details.price" 
                    value={formData.details.price} 
                    onChange={handleChange} 
                    placeholder="z.B. 450.000"
                  />
                </div>
                <div>
                  <Label htmlFor="details.livingArea">Wohnfläche (m²)</Label>
                  <Input 
                    id="details.livingArea" 
                    name="details.livingArea" 
                    value={formData.details.livingArea} 
                    onChange={handleChange} 
                    placeholder="z.B. 120"
                  />
                </div>
                <div>
                  <Label htmlFor="details.plotArea">Grundstück (m²)</Label>
                  <Input 
                    id="details.plotArea" 
                    name="details.plotArea" 
                    value={formData.details.plotArea} 
                    onChange={handleChange} 
                    placeholder="z.B. 500"
                  />
                </div>
                <div>
                  <Label htmlFor="details.rooms">Zimmer</Label>
                  <Input 
                    id="details.rooms" 
                    name="details.rooms" 
                    value={formData.details.rooms} 
                    onChange={handleChange} 
                    placeholder="z.B. 4"
                  />
                </div>
                <div>
                  <Label htmlFor="details.bathrooms">Badezimmer</Label>
                  <Input 
                    id="details.bathrooms" 
                    name="details.bathrooms" 
                    value={formData.details.bathrooms} 
                    onChange={handleChange} 
                    placeholder="z.B. 2"
                  />
                </div>
                <div>
                  <Label htmlFor="details.bedrooms">Schlafzimmer</Label>
                  <Input 
                    id="details.bedrooms" 
                    name="details.bedrooms" 
                    value={formData.details.bedrooms} 
                    onChange={handleChange} 
                    placeholder="z.B. 3"
                  />
                </div>
                <div>
                  <Label htmlFor="details.propertyType">Immobilientyp</Label>
                  <Select 
                    value={formData.details.propertyType}
                    onValueChange={(value) => handleSelectChange("details.propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="details.availableFrom">Bezugsfrei ab</Label>
                  <Input 
                    id="details.availableFrom" 
                    name="details.availableFrom" 
                    value={formData.details.availableFrom} 
                    onChange={handleChange} 
                    placeholder="z.B. sofort oder 01.01.2023"
                  />
                </div>
                <div>
                  <Label htmlFor="details.maintenanceFee">Hausgeld (€)</Label>
                  <Input 
                    id="details.maintenanceFee" 
                    name="details.maintenanceFee" 
                    value={formData.details.maintenanceFee} 
                    onChange={handleChange} 
                    placeholder="z.B. 250"
                  />
                </div>
                <div>
                  <Label htmlFor="details.constructionYear">Baujahr</Label>
                  <Input 
                    id="details.constructionYear" 
                    name="details.constructionYear" 
                    value={formData.details.constructionYear} 
                    onChange={handleChange} 
                    placeholder="z.B. 2010"
                  />
                </div>
                <div>
                  <Label htmlFor="details.condition">Objektzustand</Label>
                  <Select 
                    value={formData.details.condition}
                    onValueChange={(value) => handleSelectChange("details.condition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyConditions.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="details.heatingType">Heizungsart</Label>
                  <Select 
                    value={formData.details.heatingType}
                    onValueChange={(value) => handleSelectChange("details.heatingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {heatingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="details.energySource">Energieträger</Label>
                  <Select 
                    value={formData.details.energySource}
                    onValueChange={(value) => handleSelectChange("details.energySource", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {energySources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-6">
                <Switch 
                  id="energy.certificateAvailable"
                  checked={formData.energy.certificateAvailable} 
                  onCheckedChange={(checked) => handleSwitchChange("energy.certificateAvailable", checked)}
                />
                <Label htmlFor="energy.certificateAvailable">Energieausweis liegt vor</Label>
              </div>
              
              {formData.energy.certificateAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="energy.certificateType">Energieausweis Typ</Label>
                    <Select 
                      value={formData.energy.certificateType}
                      onValueChange={(value) => handleSelectChange("energy.certificateType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificateTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="energy.energyConsumption">Endenergieverbrauch (kWh/(m²·a))</Label>
                    <Input 
                      id="energy.energyConsumption" 
                      name="energy.energyConsumption" 
                      value={formData.energy.energyConsumption} 
                      onChange={handleChange} 
                      placeholder="z.B. 75"
                    />
                  </div>
                  <div>
                    <Label htmlFor="energy.energyEfficiencyClass">Energieeffizienzklasse</Label>
                    <Select 
                      value={formData.energy.energyEfficiencyClass}
                      onValueChange={(value) => handleSelectChange("energy.energyEfficiencyClass", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyEfficiencyClasses.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="energy.constructionYear">Baujahr laut Energieausweis</Label>
                    <Input 
                      id="energy.constructionYear" 
                      name="energy.constructionYear" 
                      value={formData.energy.constructionYear} 
                      onChange={handleChange} 
                      placeholder="z.B. 2010"
                    />
                  </div>
                  <div>
                    <Label htmlFor="energy.validUntil">Energieausweis gültig bis</Label>
                    <Input 
                      id="energy.validUntil" 
                      name="energy.validUntil" 
                      value={formData.energy.validUntil} 
                      onChange={handleChange} 
                      placeholder="z.B. 31.12.2030"
                    />
                  </div>
                  <div>
                    <Label htmlFor="energy.createdAt">Energieausweis erstellt am</Label>
                    <Input 
                      id="energy.createdAt" 
                      name="energy.createdAt" 
                      value={formData.energy.createdAt} 
                      onChange={handleChange} 
                      placeholder="z.B. 01.01.2020"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Objektbeschreibung</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Ausführliche Beschreibung der Immobilie..."
                    className="min-h-[200px]"
                  />
                </div>
                <div>
                  <Label htmlFor="amenities">Ausstattungsbeschreibung</Label>
                  <Textarea 
                    id="amenities" 
                    name="amenities" 
                    value={formData.amenities} 
                    onChange={handleChange} 
                    placeholder="Detaillierte Beschreibung der Ausstattung..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="location">Lagebeschreibung</Label>
                <Textarea 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="Beschreibung der Lage und Umgebung..."
                  className="min-h-[300px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Abbrechen</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Wird gespeichert...' : isEditing ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
