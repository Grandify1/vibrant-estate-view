
/**
 * Utilities for compressing and optimizing images
 */

/**
 * Compresses an image and converts it to WebP or JPEG format.
 * 
 * @param blob Original image blob
 * @param maxWidth Maximum width for the resized image
 * @param quality Compression quality (0-1)
 * @returns Promise with the compressed image blob
 */
export async function compressImage(
  blob: Blob,
  maxWidth = 1200,
  quality = 0.8
): Promise<Blob> {
  // Validate blob
  if (!blob || !(blob instanceof Blob)) {
    console.error("Invalid blob provided to compressImage");
    throw new Error("Invalid image blob");
  }

  try {
    // Create an image element to load the blob
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
    
    // Calculate new dimensions maintaining aspect ratio
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      const aspectRatio = height / width;
      width = maxWidth;
      height = Math.round(width * aspectRatio);
    }
    
    // Create canvas for resizing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // If we can't get context, return original blob
      URL.revokeObjectURL(url);
      console.error("Could not get canvas context");
      return blob;
    }
    
    // Draw image on canvas (resizing it)
    ctx.fillStyle = '#FFFFFF'; // White background
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    
    // Force WebP format with higher priority and better error handling
    try {
      // Check if browser supports WebP
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (supportsWebP) {
        console.log("Using WebP compression");
        const webpBlob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(resolve, 'image/webp', quality);
        });
        
        if (webpBlob) {
          console.log("WebP compression successful, size:", Math.round(webpBlob.size / 1024), "KB");
          return webpBlob;
        } else {
          console.warn("WebP compression returned null, falling back to JPEG");
        }
      } else {
        console.warn("Browser doesn't support WebP, falling back to JPEG");
      }
    } catch (error) {
      console.warn("WebP compression failed, falling back to JPEG:", error);
    }
    
    // Fall back to JPEG
    console.log("Using JPEG compression");
    const jpegBlob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
    
    if (jpegBlob) {
      console.log("JPEG compression successful, size:", Math.round(jpegBlob.size / 1024), "KB");
      return jpegBlob;
    }
    
    // If all conversions fail, return original
    console.warn("All compression attempts failed, returning original");
    return blob;
  } catch (error) {
    console.error("Error in image compression:", error);
    // Return original blob as fallback
    return blob;
  }
}
