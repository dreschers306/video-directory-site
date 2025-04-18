// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) {

  console.log("[CONFIG] Starting eleventy.config.js execution"); // Log: Config Start

  // --- Dynamically import slugify ---
  const slugifyPackage = await import('@sindresorhus/slugify');
  const slugify = slugifyPackage.default;
  console.log("[CONFIG] Slugify imported successfully"); // Log: Import done
  // --- End dynamic import ---

  // --- START: Define Helper Function Once ---
  function stringToArrayHelper(input) {
    console.log("[HELPER] stringToArrayHelper received:", input, `(Type: ${typeof input})`);
    if (Array.isArray(input)) {
      let result = input.map(item => String(item || '').trim()).filter(item => item.length > 0);
       // If the array element itself might be comma-separated (like ['tag1,tag2'])
       if (result.length === 1 && result[0].includes(',')) {
           result = result[0].split(',').map(s => s.trim()).filter(s => s.length > 0);
       }
      console.log("[HELPER] Processed array input:", result);
      return result;
    }
    if (typeof input === 'string') {
      let result = input.split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
      console.log("[HELPER] Processed string input:", result);
      return result;
    }
    console.log("[HELPER] Returning empty array for input:", input);
    return [];
  }
  console.log("[CONFIG] Helper function defined"); // Log: Helper defined
  // --- END: Define Helper Function Once ---

  // --- Passthrough Copies ---
  try {
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    console.log("[CONFIG] Passthroughs added"); // Log: Passthroughs done
  } catch(e) { console.error("[CONFIG] Error adding passthroughs:", e); }
  // --- End Passthrough Copies ---

  // --- Collections ---
  try {
    eleventyConfig.addCollection("video", function(collectionApi) {
      console.log("[CONFIG] Building 'video' collection"); // Log: Video collection start
      let videos = collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
      console.log(`[CONFIG] 'video' collection found ${videos.length} items.`); // Log: Video collection end
      return videos;
    });

    // --- Active tagList Collection with INTENSE LOGGING ---
    eleventyConfig.addCollection("tagList", function(collectionApi) {
      console.log("\n[CONFIG] ---- Building 'tagList' Collection ----"); // Log: tagList start
      let tagSet = new Set();
      let videos;
      try {
          videos = collectionApi.getAllSorted(); // Get all items processed by Eleventy
          console.log(`[CONFIG] tagList: getAllSorted() found ${videos.length} total items.`);

          // Filter specifically for items from our video folder
          let videoItems = videos.filter(item => 
              item.inputPath && item.inputPath.includes('/src/_content/videos/')
          );
          console.log(`[CONFIG] tagList: Filtered down to ${videoItems.length} video items.`);
          
          videoItems.forEach((item, index) => {
            console.log(`[CONFIG] tagList[${index+1}]: Processing ${item.inputPath}`);
            // Check if data and data.tags exist
            if (item.data && item.data.tags) {
              console.log(`[CONFIG] tagList[${index+1}]: Raw tags data:`, JSON.stringify(item.data.tags), `(Type: ${typeof item.data.tags})`);
              let tags = stringToArrayHelper(item.data.tags);
              console.log(`[CONFIG] tagList[${index+1}]: Processed tags:`, tags);
              if (tags && tags.length > 0) {
                  tags.forEach(tag => tagSet.add(tag));
              } else {
                  console.log(`[CONFIG] tagList[${index+1}]: No individual tags extracted after processing.`);
              }
            } else {
              console.log(`[CONFIG] tagList[${index+1}]: No item.data.tags found.`);
            }
          });

      } catch (e) {
          console.error("[CONFIG] tagList: Error processing video items", e);
          return []; // Return empty if error getting/processing items
      }
      console.log("[CONFIG] tagList: Final tagSet:", tagSet);
      const sortedTags = [...tagSet].sort();
      console.log("[CONFIG] tagList: Returning sorted tags:", sortedTags);
      console.log("[CONFIG] ---- Finished 'tagList' Collection ----\n");
      return sortedTags;
    });
    // --- End tagList Collection ---
    console.log("[CONFIG] Collections added"); // Log: Collections done
  } catch(e) { console.error("[CONFIG] Error adding collections:", e); }

  // --- Filters ---
  try {
    eleventyConfig.addFilter("stringToArray", stringToArrayHelper);
    eleventyConfig.addFilter("slugify", function(str) {
      if (!str) { return ""; }
      return slugify(str, { lower: true, strict: true });
    });
    console.log("[CONFIG] Filters added"); // Log: Filters done
  } catch(e) { console.error("[CONFIG] Error adding filters:", e); }
  // --- End Filters ---

  // Return Eleventy options
  console.log("[CONFIG] Returning options object"); // Log: Return start
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "html", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}; // End module.exports async function