
import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  images: { id: string; url: string }[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, open, onClose }: LightboxProps) {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  
  React.useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, open]);
  
  React.useEffect(() => {
    if (open) {
      // Prevent scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      // Handle arrow keys
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
      };
      
      window.addEventListener('keydown', handleEsc);
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, activeIndex, images.length]);
  
  if (!open) return null;
  
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-white hover:bg-gray-800 z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      {/* Image navigation */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-gray-800 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-gray-800 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
          </>
        )}
        
        {/* Main image */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <img
            src={images[activeIndex]?.url}
            alt={`Bild ${activeIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
