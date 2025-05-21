
/**
 * Utilities for compressing and optimizing images
 */

/**
 * Compresses an image and converts it to AVIF format if supported.
 * Falls back to WebP or JPEG for better compatibility.
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
  // Create an image element to load the blob
  const img = document.createElement('img');
  const url = URL.createObjectURL(blob);
  
  // Wait for image to load
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  } catch (error) {
    URL.revokeObjectURL(url);
    return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
  }
  
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
    return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
  }
  
  // Draw image on canvas (resizing it)
  ctx.fillStyle = '#FFFFFF'; // White background
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);
  
  // Try AVIF first (check browser support)
  try {
    const avifSupported = supportsAvif();
    
    if ('toBlob' in canvas && avifSupported) {
      const avifBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/avif', quality);
      });
      
      if (avifBlob) {
        return { compressedBlob: avifBlob, format: 'avif' };
      }
    }
  } catch (error) {
    // Fall back to WebP
  }
  
  // Try WebP as fallback
  try {
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });
    
    if (webpBlob) {
      return { compressedBlob: webpBlob, format: 'webp' };
    }
  } catch (error) {
    // Fall back to JPEG
  }
  
  // Final fallback to JPEG
  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
  
  if (jpegBlob) {
    return { compressedBlob: jpegBlob, format: 'jpeg' };
  }
  
  // If all conversions fail, return original
  return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
}

/**
 * Detects if browser supports AVIF format
 */
function supportsAvif(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch (error) {
    return false;
  }
}
