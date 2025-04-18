document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item');
  
    videoItems.forEach(item => {
      const thumbnailContainer = item.querySelector('.thumbnail-container');
      const img = thumbnailContainer?.querySelector('img');
      const video = thumbnailContainer?.querySelector('video.video-preview');
  
      if (!thumbnailContainer || !img || !video) {
        // Skip if elements aren't found
        console.warn('Could not find necessary elements in video item:', item);
        return; 
      }
  
      thumbnailContainer.addEventListener('mouseenter', () => {
        // console.log('Mouse Enter - Attempting to play:', video.src);
        img.style.opacity = '0'; // Hide image
        video.style.opacity = '1'; // Show video
        video.play().catch(e => {
          // Autoplay might be blocked by browser initially, ignore error for now
          // console.error('Play failed (expected with placeholder):', e.name); 
        }); 
      });
  
      thumbnailContainer.addEventListener('mouseleave', () => {
        // console.log('Mouse Leave - Attempting to pause:', video.src);
        video.pause();
        // Optional: Reset time? video.currentTime = 0; 
        video.style.opacity = '0'; // Hide video
        img.style.opacity = '1'; // Show image
      });
    });
  
    console.log(`Hover previews initialized for ${videoItems.length} items.`);
  });