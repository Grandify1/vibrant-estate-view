
/**
 * Utilities for compressing and optimizing images
 */

/**
 * Compresses an image and converts it to WebP or JPEG format.
 * 
 * @param blob Original image blob
 * @param maxWidth Maximum width for the resized image
 * @param quality Compression quality (0-1)
 * @returns Promise with the compressed image blob and format
 */
export async function compressImage(
  blob: Blob,
  maxWidth = 1200,
  quality = 0.8
): Promise<{ compressedBlob: Blob; format: string }> {
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
      return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
    }
    
    // Draw image on canvas (resizing it)
    ctx.fillStyle = '#FFFFFF'; // White background
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    
    // Try WebP format first
    try {
      const webpBlob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/webp', quality);
      });
      
      if (webpBlob) {
        return { compressedBlob: webpBlob, format: 'webp' };
      }
    } catch (error) {
      console.warn("WebP compression failed, falling back to JPEG");
    }
    
    // Fall back to JPEG
    const jpegBlob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
    
    if (jpegBlob) {
      return { compressedBlob: jpegBlob, format: 'jpeg' };
    }
    
    // If all conversions fail, return original
    return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
  } catch (error) {
    console.error("Error in image compression:", error);
    // Return original blob as fallback
    return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
  }
}
