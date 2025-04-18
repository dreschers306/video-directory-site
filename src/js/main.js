// Function to shuffle an array in place (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  }
  
  // Wait for the HTML document to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    
    const gridContainer = document.querySelector('.video-grid');
    
    if (gridContainer) {
      // Get all direct children (video items) of the grid
      const items = Array.from(gridContainer.children); 
  
      // Shuffle the array of items
      shuffleArray(items);
  
      // Re-append the items to the grid container in the new shuffled order
      items.forEach(item => gridContainer.appendChild(item));
  
      console.log(`Randomized ${items.length} grid items.`);
  
      // --- Initialize Hover Previews (Code from previous step) ---
      // Now that items are shuffled, find them again or use the shuffled 'items' array
      const videoItems = gridContainer.querySelectorAll('.video-item'); // Or just use the 'items' array directly
  
      videoItems.forEach(item => {
        const thumbnailContainer = item.querySelector('.thumbnail-container');
        const img = thumbnailContainer?.querySelector('img');
        const video = thumbnailContainer?.querySelector('video.video-preview');
  
        if (!thumbnailContainer || !img || !video) {
          console.warn('Could not find necessary elements in video item for hover:', item);
          return; 
        }
  
        thumbnailContainer.addEventListener('mouseenter', () => {
          img.style.opacity = '0'; 
          video.style.opacity = '1'; 
          video.play().catch(e => { /* Ignore playback errors for now */ }); 
        });
  
        thumbnailContainer.addEventListener('mouseleave', () => {
          video.pause();
          video.style.opacity = '0'; 
          img.style.opacity = '1'; 
        });
      });
      // --- End of Hover Preview Initialization ---
  
    } else {
      console.warn('Video grid container not found.');
    }
  
  });