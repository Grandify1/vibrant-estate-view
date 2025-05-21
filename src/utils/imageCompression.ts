
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
  console.log(`Compressing image, original size: ${Math.round(blob.size / 1024)}KB`);
  
  // Create an image element to load the blob
  const img = document.createElement('img');
  const url = URL.createObjectURL(blob);
  
  // Wait for image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
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
  
  console.log(`Resizing image from ${img.width}x${img.height} to ${width}x${height}`);
  
  // Create canvas for resizing
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // If we can't get context, return original blob
    URL.revokeObjectURL(url);
    console.log("Could not get canvas context, returning original image");
    return { compressedBlob: blob, format: blob.type.split('/')[1] || 'jpeg' };
  }
  
  // Draw image on canvas (resizing it)
  ctx.fillStyle = '#FFFFFF'; // White background
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);
  
  // Try AVIF first (check browser support)
  try {
    if ('toBlob' in canvas && supportsAvif()) {
      console.log("Browser supports AVIF, trying AVIF conversion");
      const avifBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/avif', quality);
      });
      
      if (avifBlob) {
        console.log(`Image compressed to AVIF: ${Math.round(avifBlob.size / 1024)}KB`);
        return { compressedBlob: avifBlob, format: 'avif' };
      }
    }
  } catch (error) {
    console.log('AVIF conversion failed, falling back:', error);
  }
  
  // Try WebP as fallback
  try {
    console.log("Trying WebP conversion");
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });
    
    if (webpBlob) {
      console.log(`Image compressed to WebP: ${Math.round(webpBlob.size / 1024)}KB`);
      return { compressedBlob: webpBlob, format: 'webp' };
    }
  } catch (error) {
    console.log('WebP conversion failed, falling back to JPEG:', error);
  }
  
  // Final fallback to JPEG
  console.log("Trying JPEG conversion as final fallback");
  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
  
  if (jpegBlob) {
    console.log(`Image compressed to JPEG: ${Math.round(jpegBlob.size / 1024)}KB`);
    return { compressedBlob: jpegBlob, format: 'jpeg' };
  }
  
  // If all conversions fail, return original
  console.log('All conversions failed, using original image');
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
