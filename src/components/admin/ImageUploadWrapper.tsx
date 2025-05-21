import React from 'react';
import { ImageUpload } from './ImageUpload';

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
  // Convert the handler to match what ImageUpload expects
  const handleImageChange = (urls: string | string[]) => {
    // Ensure we're always dealing with an array of URLs
    const urlArray = Array.isArray(urls) ? urls : [urls];
    onUploaded(urlArray);
  };

  return (
    <ImageUpload
      onImageChange={handleImageChange}
      multiple={maxFiles !== undefined && maxFiles > 1}
      maxHeight={800}
    />
  );
};

export default ImageUploadWrapper;
