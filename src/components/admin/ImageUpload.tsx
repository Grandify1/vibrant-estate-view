
import React, { useState, useEffect } from 'react';
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
  const [bucketChecked, setBucketChecked] = useState(false);
  
  // Check if the bucket exists when the component mounts
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const { data: buckets } = await supabase
          .storage
          .listBuckets();
          
        const bucketExists = buckets?.some(bucket => bucket.name === 'properties');
        setBucketChecked(true);
        
        if (!bucketExists) {
          // If bucket doesn't exist, we'll try to create it during upload
          console.log("Properties bucket doesn't exist yet.");
        }
      } catch (error) {
        console.error("Error checking buckets:", error);
      }
    };
    
    checkBucket();
  }, []);
  
  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      let uploadedUrls: string[] = [];
      
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
        
        try {
          // Zu Supabase hochladen
          const { data, error } = await supabase.storage
            .from('properties')
            .upload(filePath, compressedBlob);
            
          if (error) {
            console.error(`Fehler beim Hochladen von ${file.name}:`, error);
            
            // Special handling for bucket not found
            if (error.message.includes("bucket not found") || error.message.includes("bucket_not_found")) {
              toast.error("Bucket nicht gefunden. Bitte kontaktieren Sie den Administrator.");
            } else {
              toast.error(`Fehler beim Hochladen von ${file.name}: ${error.message}`);
            }
            continue;
          }
          
          // URL der hochgeladenen Datei abrufen
          const { data: { publicUrl } } = supabase.storage
            .from('properties')
            .getPublicUrl(filePath);
            
          uploadedUrls.push(publicUrl);
        } catch (uploadError) {
          console.error(`Exception beim Hochladen von ${file.name}:`, uploadError);
          toast.error(`Unerwarteter Fehler beim Hochladen von ${file.name}`);
        }
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
        disabled={isLoading || !bucketChecked}
        onClick={() => document.getElementById('imageUpload')?.click()}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lädt hoch...
          </span>
        ) : !bucketChecked ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initialisiere...
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
