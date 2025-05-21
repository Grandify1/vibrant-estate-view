
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { compressImage } from '@/utils/imageCompression';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export interface ImageUploadProps {
  onImageChange: (urls: string | string[]) => void;
  maxHeight?: number;
  multiple?: boolean;
  initialImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageChange, 
  maxHeight = 800,
  multiple = false,
  initialImage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // First, check if the bucket exists and create it if it doesn't
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
        
      const bucketExists = buckets?.some(bucket => bucket.name === 'properties');
      
      if (!bucketExists) {
        const { error: createError } = await supabase
          .storage
          .createBucket('properties', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
        if (createError) {
          console.error("Error creating bucket:", createError);
          toast.error(`Fehler beim Erstellen des Buckets: ${createError.message}`);
          setIsLoading(false);
          return;
        }
      }
      
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Prüfen ob es ein Bild ist
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} ist kein Bild.`);
          continue;
        }
        
        // Größe prüfen (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} ist zu groß (max. 10MB).`);
          continue;
        }
        
        // Bild komprimieren
        const compressedBlob = await compressImage(file, maxHeight);
        
        // Zufälligen Dateinamen generieren
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        // Zu Supabase hochladen
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, compressedBlob);
          
        if (error) {
          console.error(`Fehler beim Hochladen von ${file.name}:`, error);
          toast.error(`Fehler beim Hochladen von ${file.name}: ${error.message}`);
          continue;
        }
        
        // URL der hochgeladenen Datei abrufen
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      }
      
      if (uploadedUrls.length > 0) {
        // Bei mehreren Bildern alle URLs zurückgeben, sonst nur die erste
        onImageChange(multiple ? uploadedUrls : uploadedUrls[0]);
        toast.success(
          multiple 
            ? `${uploadedUrls.length} Bilder erfolgreich hochgeladen` 
            : `Bild erfolgreich hochgeladen`
        );
      }
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);
      toast.error('Fehler beim Hochladen der Bilder');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      {initialImage && (
        <div className="mb-2">
          <img src={initialImage} alt="Vorschau" className="w-32 h-32 object-cover rounded-md" />
        </div>
      )}
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        multiple={multiple}
        onChange={uploadImages}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={() => document.getElementById('imageUpload')?.click()}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lädt hoch...
          </span>
        ) : multiple ? (
          'Bilder hochladen'
        ) : (
          'Bild hochladen'
        )}
      </Button>
    </div>
  );
};
