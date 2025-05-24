
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
  
  // Bestimme den richtigen Bucket basierend auf dem Kontext
  const getBucketName = () => {
    // Für Makler verwende agent-images bucket
    if (window.location.pathname.includes('/admin') && window.location.hash?.includes('agents')) {
      return 'agent-images';
    }
    // Standard: properties bucket
    return 'properties';
  };
  
  // Check if the bucket exists when the component mounts
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const bucketName = getBucketName();
        const { data: buckets } = await supabase
          .storage
          .listBuckets();
          
        const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
        setBucketChecked(true);
        
        if (!bucketExists) {
          console.log(`${bucketName} bucket doesn't exist yet.`);
          // Bucket sollte bereits durch SQL Migration erstellt worden sein
        }
      } catch (error) {
        console.error("Error checking buckets:", error);
        setBucketChecked(true); // Weiter machen auch bei Fehlern
      }
    };
    
    checkBucket();
  }, []);
  
  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    const bucketName = getBucketName();
    
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
        
        console.log(`Compressing image: ${file.name} (${Math.round(file.size / 1024)} KB)`);
        
        try {
          // Bild komprimieren
          const compressedBlob = await compressImage(file, maxHeight);
          console.log(`Compressed to ${Math.round(compressedBlob.size / 1024)} KB (${Math.round((compressedBlob.size / file.size) * 100)}%)`);
          
          // Zufälligen Dateinamen generieren
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.webp`;
          const filePath = `images/${fileName}`;
          
          // Zu Supabase hochladen
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, compressedBlob, {
              contentType: 'image/webp',
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.error(`Fehler beim Hochladen von ${file.name}:`, uploadError);
            toast.error(`Fehler beim Hochladen von ${file.name}: ${uploadError.message}`);
            continue;
          }
          
          // URL der hochgeladenen Datei abrufen
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
              
          uploadedUrls.push(publicUrl);
          console.log(`Successfully uploaded to ${bucketName}: ${publicUrl}`);
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
        disabled={isLoading}
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
