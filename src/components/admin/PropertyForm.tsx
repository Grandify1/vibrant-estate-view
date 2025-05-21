
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { 
  Property, 
  initialProperty, 
  propertyTypes, 
  propertyConditions, 
  heatingTypes, 
  energySources, 
  energyEfficiencyClasses, 
  certificateTypes,
  propertyStatuses
} from "@/types/property";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useAgents } from "@/hooks/useAgents";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const { agents } = useAgents();
  
  // Form state
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: property || initialProperty
  });
  
  // Watch fields from the form
  const watchEnergyAvailable = watch("energy.certificateAvailable");
  const watchImages = watch("images") || [];
  const watchFloorPlans = watch("floorPlans") || [];
  const watchHighlights = watch("highlights") || [];
  const watchAgentId = watch("agent_id");
  
  // Highlights handling
  const [newHighlight, setNewHighlight] = useState("");
  
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    
    const highlight = {
      id: uuidv4(),
      name: newHighlight.trim()
    };
    
    setValue("highlights", [...watchHighlights, highlight]);
    setNewHighlight("");
  };
  
  const removeHighlight = (id: string) => {
    setValue("highlights", watchHighlights.filter(h => h.id !== id));
  };
  
  // Image handling
  const handleAddImages = (urls: string[]) => {
    const newImages = urls.map(url => ({
      id: uuidv4(),
      url,
      isFeatured: watchImages.length === 0 // First image is featured by default
    }));
    
    setValue("images", [...watchImages, ...newImages]);
  };
  
  const removeImage = (id: string) => {
    setValue("images", watchImages.filter(img => img.id !== id));
  };
  
  const setFeaturedImage = (id: string) => {
    setValue("images", watchImages.map(img => ({
      ...img,
      isFeatured: img.id === id
    })));
  };
  
  // Floor plan handling
  const handleAddFloorPlan = (url: string, name: string) => {
    const floorPlan = {
      id: uuidv4(),
      url,
      name: name || `Grundriss ${watchFloorPlans.length + 1}`
    };
    
    setValue("floorPlans", [...watchFloorPlans, floorPlan]);
  };
  
  const removeFloorPlan = (id: string) => {
    setValue("floorPlans", watchFloorPlans.filter(plan => plan.id !== id));
  };
  
  // Form submission
  const handleFormSubmit = async (data: any) => {
    try {
      // Ensure at least one image is featured
      if (data.images && data.images.length > 0 && !data.images.some(img => img.isFeatured)) {
        data.images[0].isFeatured = true;
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ein Fehler ist aufgetreten");
    }
  };
  
  // Function to handle select field changes
  const handleSelectChange = (field: string, value: string) => {
    setValue(field, value);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-8">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="basic">Grunddaten</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Medien</TabsTrigger>
            <TabsTrigger value="energy">Energieausweis</TabsTrigger>
            <TabsTrigger value="agent">Makler</TabsTrigger>
          </TabsList>
          
          {/* Grunddaten Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input 
                  id="title" 
                  placeholder="z.B. Moderne Villa mit Seeblick" 
                  {...register("title", { required: "Titel ist erforderlich" })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input 
                  id="address" 
                  placeholder="z.B. Musterstraße 1, 12345 Musterstadt" 
                  {...register("address", { required: "Adresse ist erforderlich" })}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  defaultValue={property?.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Highlights</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newHighlight} 
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="z.B. Tiefgarage, Balkon, Garten"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addHighlight}>
                    Hinzufügen
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchHighlights.map((highlight) => (
                    <div 
                      key={highlight.id} 
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      <span>{highlight.name}</span>
                      <button 
                        type="button"
                        onClick={() => removeHighlight(highlight.id)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea 
                  id="description" 
                  placeholder="Ausführliche Beschreibung der Immobilie"
                  className="min-h-[150px]"
                  {...register("description")}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amenities">Ausstattung</Label>
                  <Textarea 
                    id="amenities" 
                    placeholder="Details zur Ausstattung"
                    className="min-h-[100px]"
                    {...register("amenities")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Lage</Label>
                  <Textarea 
                    id="location" 
                    placeholder="Beschreibung der Lage"
                    className="min-h-[100px]"
                    {...register("location")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="details.price">Preis (€)</Label>
                <Input 
                  id="details.price" 
                  placeholder="z.B. 250000" 
                  {...register("details.price")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.propertyType">Objekttyp</Label>
                <Select 
                  defaultValue={property?.details?.propertyType || ""}
                  onValueChange={(value) => handleSelectChange("details.propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Objekttyp wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.livingArea">Wohnfläche (m²)</Label>
                <Input 
                  id="details.livingArea" 
                  placeholder="z.B. 120" 
                  {...register("details.livingArea")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.plotArea">Grundstücksfläche (m²)</Label>
                <Input 
                  id="details.plotArea" 
                  placeholder="z.B. 500" 
                  {...register("details.plotArea")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.rooms">Zimmer</Label>
                <Input 
                  id="details.rooms" 
                  placeholder="z.B. 4" 
                  {...register("details.rooms")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.bedrooms">Schlafzimmer</Label>
                <Input 
                  id="details.bedrooms" 
                  placeholder="z.B. 2" 
                  {...register("details.bedrooms")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.bathrooms">Badezimmer</Label>
                <Input 
                  id="details.bathrooms" 
                  placeholder="z.B. 2" 
                  {...register("details.bathrooms")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.availableFrom">Verfügbar ab</Label>
                <Input 
                  id="details.availableFrom" 
                  placeholder="z.B. sofort oder 01.01.2024" 
                  {...register("details.availableFrom")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.maintenanceFee">Hausgeld/Nebenkosten (€)</Label>
                <Input 
                  id="details.maintenanceFee" 
                  placeholder="z.B. 250" 
                  {...register("details.maintenanceFee")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.constructionYear">Baujahr</Label>
                <Input 
                  id="details.constructionYear" 
                  placeholder="z.B. 1990" 
                  {...register("details.constructionYear")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.condition">Zustand</Label>
                <Select 
                  defaultValue={property?.details?.condition || ""}
                  onValueChange={(value) => handleSelectChange("details.condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Zustand wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.heatingType">Heizungsart</Label>
                <Select 
                  defaultValue={property?.details?.heatingType || ""}
                  onValueChange={(value) => handleSelectChange("details.heatingType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Heizungsart wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {heatingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details.energySource">Energieträger</Label>
                <Select 
                  defaultValue={property?.details?.energySource || ""}
                  onValueChange={(value) => handleSelectChange("details.energySource", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Energieträger wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {energySources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          {/* Medien Tab */}
          <TabsContent value="media" className="space-y-8">
            {/* Bilder */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bilder</h3>
              
              <ImageUpload 
                multiple={true} 
                onImageChange={handleAddImages} 
                maxHeight={800}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {watchImages.map((image, index) => (
                  <div 
                    key={image.id} 
                    className={`relative rounded-lg overflow-hidden border ${image.isFeatured ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}`}
                  >
                    <div className="aspect-[4/3] bg-gray-100">
                      <img 
                        src={image.url} 
                        alt={`Bild ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute top-2 right-2 space-x-1">
                      <button 
                        type="button"
                        onClick={() => setFeaturedImage(image.id)}
                        className={`p-1 rounded ${image.isFeatured ? 'bg-blue-500 text-white' : 'bg-gray-800/70 text-white hover:bg-blue-500'}`}
                        title={image.isFeatured ? "Titelbild" : "Als Titelbild setzen"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-1 rounded bg-gray-800/70 text-white hover:bg-red-500"
                        title="Bild entfernen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {watchImages.length === 0 && (
                <p className="text-gray-500 italic">Keine Bilder hochgeladen</p>
              )}
            </div>
            
            {/* Grundrisse */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Grundrisse</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grundriss hochladen</Label>
                  <ImageUpload 
                    onImageChange={(urls) => {
                      if (urls.length > 0) {
                        const planName = prompt("Name des Grundrisses:", `Grundriss ${watchFloorPlans.length + 1}`);
                        handleAddFloorPlan(urls[0], planName || "");
                      }
                    }} 
                    maxHeight={600}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {watchFloorPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="relative rounded-lg overflow-hidden border border-gray-200"
                  >
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <span className="font-medium">{plan.name}</span>
                    </div>
                    <div className="aspect-[1/1] bg-gray-100">
                      <img 
                        src={plan.url} 
                        alt={plan.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <button 
                        type="button"
                        onClick={() => removeFloorPlan(plan.id)}
                        className="p-1 rounded bg-gray-800/70 text-white hover:bg-red-500"
                        title="Grundriss entfernen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {watchFloorPlans.length === 0 && (
                <p className="text-gray-500 italic">Keine Grundrisse hochgeladen</p>
              )}
            </div>
          </TabsContent>
          
          {/* Energieausweis Tab */}
          <TabsContent value="energy" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="energy.certificateAvailable" 
                  checked={watchEnergyAvailable}
                  onCheckedChange={(checked) => setValue("energy.certificateAvailable", checked as boolean)}
                />
                <Label htmlFor="energy.certificateAvailable" className="font-medium">
                  Energieausweis vorhanden
                </Label>
              </div>
              
              {watchEnergyAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="energy.certificateType">Ausweistyp</Label>
                    <Select 
                      defaultValue={property?.energy?.certificateType || ""}
                      onValueChange={(value) => handleSelectChange("energy.certificateType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Typ wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificateTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="energy.energyEfficiencyClass">Energieeffizienzklasse</Label>
                    <Select 
                      defaultValue={property?.energy?.energyEfficiencyClass || ""}
                      onValueChange={(value) => handleSelectChange("energy.energyEfficiencyClass", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Klasse wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyEfficiencyClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="energy.energyConsumption">Energieverbrauch (kWh/(m²·a))</Label>
                    <Input 
                      id="energy.energyConsumption" 
                      placeholder="z.B. 120" 
                      {...register("energy.energyConsumption")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="energy.constructionYear">Baujahr lt. Ausweis</Label>
                    <Input 
                      id="energy.constructionYear" 
                      placeholder="z.B. 1990" 
                      {...register("energy.constructionYear")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="energy.validUntil">Gültig bis</Label>
                    <Input 
                      id="energy.validUntil" 
                      placeholder="z.B. 31.12.2030" 
                      {...register("energy.validUntil")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="energy.createdAt">Ausstellungsdatum</Label>
                    <Input 
                      id="energy.createdAt" 
                      placeholder="z.B. 01.01.2020" 
                      {...register("energy.createdAt")}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Makler Tab */}
          <TabsContent value="agent" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent_id">Zuständiger Makler</Label>
                <Select 
                  defaultValue={property?.agent_id || ""}
                  onValueChange={(value) => handleSelectChange("agent_id", value === "none" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Makler auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keinen Makler zuweisen</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.first_name} {agent.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {watchAgentId && agents.length > 0 && (
                <div className="mt-4">
                  {agents.filter(a => a.id === watchAgentId).map(agent => (
                    <div key={agent.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {agent.image_url ? (
                          <img src={agent.image_url} alt={`${agent.first_name} ${agent.last_name}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-medium text-gray-600">
                            {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{agent.first_name} {agent.last_name}</h4>
                        <p className="text-gray-600 text-sm">{agent.position || ''}</p>
                        <p className="text-gray-600 text-sm">{agent.email}</p>
                        {agent.phone && <p className="text-gray-600 text-sm">{agent.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!agents.length && (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
                  <p>Es sind noch keine Makler angelegt. Gehen Sie zum "Makler"-Tab, um Makler zu erstellen.</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">Hinweis</h4>
                <p className="text-gray-700 text-sm">
                  Ein zugewiesener Makler wird auf der Immobiliendetailseite angezeigt und 
                  erhält automatisch Anfragen über das Kontaktformular an seine E-Mail-Adresse.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Abbrechen
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                Speichern...
              </span>
            ) : isEditing ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
