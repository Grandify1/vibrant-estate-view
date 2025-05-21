
import React from 'react';
import { ImageUpload } from './ImageUpload';

// Diese Komponente dient nur als Wrapper, um den Typfehler zu beheben
interface ImageUploadWrapperProps {
  onUploaded: (urls: string[]) => void;
  maxFiles?: number;
  buttonText?: string;
  accept?: string;
}

const ImageUploadWrapper: React.FC<ImageUploadWrapperProps> = ({ 
  onUploaded, 
  maxFiles, 
  buttonText, 
  accept 
}) => {
  // Vor dem Übergeben an die ImageUpload-Komponente wandeln wir das Format der Datei
  const handleUploaded = (files: any[]) => {
    // Extrahieren von URLs aus den hochgeladenen Dateien
    const urls = files.map(file => {
      if (typeof file === 'string') {
        return file;
      }
      // Wenn es sich um ein Blob-Objekt handelt, erstellen wir eine URL
      if (file instanceof Blob) {
        return URL.createObjectURL(file);
      }
      // Wenn es ein komprimiertes Bild-Objekt ist
      if (file.compressedBlob) {
        return URL.createObjectURL(file.compressedBlob);
      }
      return '';
    }).filter(url => url !== '');
    
    onUploaded(urls);
  };

  return (
    <ImageUpload
      onUploaded={handleUploaded}
      maxFiles={maxFiles}
      buttonText={buttonText}
      accept={accept}
    />
  );
};

export default ImageUploadWrapper;
