   // Wait for the HTML document to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    
    const gridContainer = document.querySelector('.video-grid');
    
    if (gridContainer) {
  
      // --- Initialize Hover Previews (Code from previous step) ---
      // Now that items are shuffled, find them again or use the shuffled 'items' array
      const videoItems = gridContainer.querySelectorAll('.video-item'); // Or just use the 'items' array directly
  
      videoItems.forEach(item => {
        const thumbnailContainer = item.querySelector('.thumbnail-container');
        const imgStatic = thumbnailContainer?.querySelector('img.static-thumb')
        const imgPreview = thumbnailContainer?.querySelector('img.img-preview');
  
        // Check if both images are found this time
        if (!thumbnailContainer || !imgStatic || !imgPreview) {
            // Only log warning if the preview image is expected but not found
            if (!imgPreview && item.querySelector('[src*=".webp"]')) { // Basic check if preview URL existed
                console.warn('Could not find necessary img elements in video item for hover:', item);
            }
            return; 
          }
  
          thumbnailContainer.addEventListener('mouseenter', () => {
            // console.log('Mouse Enter - Showing preview image:', imgPreview.src);
            imgStatic.style.opacity = '0'; // Hide static image
            imgPreview.style.opacity = '1'; // Show preview image
            // No .play() needed
          });
  
          thumbnailContainer.addEventListener('mouseleave', () => {
            // console.log('Mouse Leave - Hiding preview image:', imgPreview.src);
            imgPreview.style.opacity = '0'; // Hide preview image
            imgStatic.style.opacity = '1'; // Show static image
            // No .pause() needed
          });
        }); // End of forEach loop
  
    } else {
      console.warn('Video grid container not found.');
    }
  
  });