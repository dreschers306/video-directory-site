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

// --- START: Updated tagList Collection ---
eleventyConfig.addCollection("tagList", function(collectionApi) {
  let tagSet = new Set(); 

  // Helper function still needed if called elsewhere or by filter
  function stringToArrayHelper(input) { 
    if (Array.isArray(input)) {
      let extractedTags = [];
      input.forEach(item => {
        if (typeof item === 'string') {
          extractedTags = extractedTags.concat(
            item.split(',')
                .map(subItem => subItem.trim())
                .filter(subItem => subItem.length > 0)
          );
        }
      });
      return extractedTags;
    }
    if (typeof input === 'string') {
      return input.split(',')
                .map(item => item.trim()) 
                .filter(item => item.length > 0); 
    }
    return []; 
  }

  // Process videos to get all unique tags
  collectionApi.getAllSorted().forEach(item => { 
    if (item.inputPath && item.inputPath.includes('/src/_content/videos/') && item.data.tags) {
      let tags = stringToArrayHelper(item.data.tags); 
      tags.forEach(tag => tagSet.add(tag));
    }
  });

  // Get the full sorted list and total count
  const sortedTags = [...tagSet].sort();
  const totalTagCount = sortedTags.length;

  // --- Slice here for display limit ---
  const limitedTags = sortedTags.slice(0, 15); // <-- SET TO 3 FOR TESTING

  // Optional log to confirm slicing
  console.log(`[CONFIG] tagList: Total unique tags = ${totalTagCount}, Returning first ${limitedTags.length}`);

  // Return an object containing both the limited list and the total count
  return {
    items: limitedTags,
    totalCount: totalTagCount
}; 
});
// --- END: Updated tagList Collection ---

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