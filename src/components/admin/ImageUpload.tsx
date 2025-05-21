
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyImage, FloorPlan } from "@/types/property";
import { Trash2, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 20,
  label = "Bilder" 
}: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    if (images.length + newFiles.length > maxImages) {
      toast.warning(`Sie können maximal ${maxImages} Bilder hochladen.`);
      return;
    }
    
    const newImages = newFiles.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        url,
        isFeatured: images.length === 0 // First image is featured by default
      };
    });
    
    onChange([...images, ...newImages]);
    toast.success(`${newFiles.length} Bilder hochgeladen`);
  };
  
  const removeImage = (id: string) => {
    const updatedImages = images.filter(image => image.id !== id);
    
    // If we removed the featured image, mark the first one as featured
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isFeatured)) {
      updatedImages[0].isFeatured = true;
    }
    
    onChange(updatedImages);
  };
  
  const setFeaturedImage = (id: string) => {
    const updatedImages = images.map(image => ({
      ...image,
      isFeatured: image.id === id
    }));
    
    onChange(updatedImages);
    toast.success("Titelbild festgelegt");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{label}</h3>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            {images.length}/{maxImages} Bilder
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={images.length >= maxImages}
          >
            Bilder hochladen
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div 
              key={image.id} 
              className={`relative group aspect-property rounded-md overflow-hidden border ${
                image.isFeatured ? 'ring-2 ring-estate' : ''
              }`}
            >
              <img
                src={image.url}
                alt="Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  {!image.isFeatured && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => setFeaturedImage(image.id)}
                      title="Als Titelbild festlegen"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => removeImage(image.id)}
                    title="Bild löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {image.isFeatured && (
                <div className="absolute top-2 right-2 bg-estate text-white text-xs px-2 py-1 rounded">
                  Titelbild
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-gray-500">Keine Bilder vorhanden. Klicken Sie auf "Bilder hochladen", um Bilder hinzuzufügen.</p>
        </div>
      )}
    </div>
  );
}

interface FloorPlanUploadProps {
  floorPlans: FloorPlan[];
  onChange: (floorPlans: FloorPlan[]) => void;
  maxFloorPlans?: number;
}

export function FloorPlanUpload({ 
  floorPlans, 
  onChange, 
  maxFloorPlans = 10 
}: FloorPlanUploadProps) {
  const [newPlanName, setNewPlanName] = useState("");
  
  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    if (floorPlans.length + newFiles.length > maxFloorPlans) {
      toast.warning(`Sie können maximal ${maxFloorPlans} Grundrisse hochladen.`);
      return;
    }
    
    const newFloorPlans = newFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        url,
        name: newPlanName || `Grundriss ${floorPlans.length + index + 1}`
      };
    });
    
    onChange([...floorPlans, ...newFloorPlans]);
    setNewPlanName("");
    toast.success(`${newFiles.length} Grundrisse hochgeladen`);
  };
  
  const removeFloorPlan = (id: string) => {
    onChange(floorPlans.filter(plan => plan.id !== id));
  };
  
  const updateFloorPlanName = (id: string, name: string) => {
    onChange(floorPlans.map(plan => 
      plan.id === id ? { ...plan, name } : plan
    ));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Grundrisse</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Grundriss Name"
            className="px-3 py-1 border rounded text-sm"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => document.getElementById("floorplan-upload")?.click()}
            disabled={floorPlans.length >= maxFloorPlans}
          >
            Grundriss hochladen
          </Button>
          <input
            id="floorplan-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFloorPlanUpload}
          />
        </div>
      </div>
      
      {floorPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {floorPlans.map(plan => (
            <div 
              key={plan.id} 
              className="relative group border rounded-md p-2"
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  className="px-2 py-1 border rounded text-sm w-full"
                  value={plan.name}
                  onChange={(e) => updateFloorPlanName(plan.id, e.target.value)}
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="ml-2"
                  onClick={() => removeFloorPlan(plan.id)}
                  title="Grundriss löschen"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="aspect-property rounded overflow-hidden">
                <img
                  src={plan.url}
                  alt={plan.name}
                  className="w-full h-full object-contain bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-gray-500">Keine Grundrisse vorhanden. Klicken Sie auf "Grundriss hochladen", um Grundrisse hinzuzufügen.</p>
        </div>
      )}
    </div>
  );
}
