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
        console.log(`Hover previews initialized for ${videoItems.length} items.`);
        // --- End Hover Preview Logic ---

    } else {
      console.warn('Video grid container not found.');
    }

  // --- START: Copy Link Button Logic ---
  const copyButton = document.getElementById('copy-link-button');
  const copyFeedback = document.getElementById('copy-link-feedback');
  
  if (copyButton && copyFeedback) {
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // Success feedback
          copyFeedback.textContent = 'Link Copied!';
          copyButton.disabled = true; // Briefly disable button
          // Clear feedback after a delay
          setTimeout(() => {
            copyFeedback.textContent = '';
            copyButton.disabled = false;
          }, 2000); // 2 seconds
        })
        .catch(err => {
          // Error feedback (rare for modern browsers)
          copyFeedback.textContent = 'Copy failed!';
          console.error('Failed to copy link: ', err);
           setTimeout(() => { copyFeedback.textContent = ''; }, 3000);
        });
    });
  }
  // --- END: Copy Link Button Logic ---    

    // Initialize Pagefind UI
try {
  // Check if PagefindUI is available (it's loaded via script tag)
  if (typeof PagefindUI !== 'undefined') {
    new PagefindUI({ 
      element: "#search", // Target the form element
      showSubResults: true // Optional: show matches within pages
      // Add other config options here if needed later
    });
    console.log("Pagefind UI initialized onto #search.");
  } else {
    console.warn("PagefindUI not loaded, search will not work.");
  }
} catch (e) {
  console.error("Error initializing Pagefind UI:", e);
}

    
  });