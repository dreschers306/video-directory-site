// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) {

  console.log("[CONFIG] Starting eleventy.config.js execution"); // Log: Config Start

  // --- Dynamically import slugify ---
  const slugifyPackage = await import('@sindresorhus/slugify');
  const slugify = slugifyPackage.default;
  console.log("[CONFIG] Slugify imported successfully"); // Log: Import done
  // --- End dynamic import ---

  // --- START: Define Helper Functions Once ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function stringToArrayHelper(input) {
    // console.log("[HELPER] stringToArrayHelper received:", input, `(Type: ${typeof input})`); // Optional log
    if (Array.isArray(input)) {
      let extractedTags = [];
      input.forEach(item => {
        if (typeof item === 'string') {
          extractedTags = extractedTags.concat(
            item.split(',').map(subItem => subItem.trim()).filter(subItem => subItem.length > 0)
          );
        }
      });
      return extractedTags;
    }
    if (typeof input === 'string') {
      return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  }
  console.log("[CONFIG] Helper functions defined"); // Log: Helper defined
  // --- END: Define Helper Functions Once ---

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
    // Video Collection (Shuffled)
    eleventyConfig.addCollection("video", function(collectionApi) {
      console.log("[CONFIG] Building 'video' collection");
      let videoItems = collectionApi.getAllSorted().filter(item =>
          item.inputPath && item.inputPath.includes('/src/_content/videos/')
      );
      console.log(`[CONFIG] 'video' collection found ${videoItems.length} items.`);
      //shuffleArray(videoItems); // Shuffle in place
      //console.log(`[CONFIG] 'video' collection shuffled ${videoItems.length} items.`);
      return videoItems;
    });

    // Tag List Collection (Sliced, returns Object)
    eleventyConfig.addCollection("tagList", function(collectionApi) {
      // console.log("\n[CONFIG] ---- Building 'tagList' Collection ----"); // Optional log
      let tagSet = new Set();
      collectionApi.getAllSorted().forEach(item => {
        if (item.inputPath && item.inputPath.includes('/src/_content/videos/') && item.data.tags) {
          let tags = stringToArrayHelper(item.data.tags); // Use helper defined above
          tags.forEach(tag => tagSet.add(tag));
        }
      });
      const sortedTags = [...tagSet].sort();
      const totalTagCount = sortedTags.length;
      const limitedTags = sortedTags.slice(0, 15); // Restore limit to 15
      // console.log(`[CONFIG] tagList: Total unique tags = ${totalTagCount}, Returning first ${limitedTags.length}`); // Optional log
      return { items: limitedTags, totalCount: totalTagCount };
    });
    console.log("[CONFIG] Collections added"); // Log: Collections done
  } catch(e) { console.error("[CONFIG] Error adding collections:", e); }
  // --- End Collections ---

  // --- Filters ---
  try {
    // stringToArray Filter (uses helper)
    eleventyConfig.addFilter("stringToArray", stringToArrayHelper);

    // slugify Filter (uses dynamic import)
    eleventyConfig.addFilter("slugify", function(str) {
      if (!str) { return ""; }
      return slugify(str, { lower: true, strict: true });
    });

    // filterBySourceGroup Filter (uses shuffle helper internally)
    eleventyConfig.addFilter("filterBySourceGroup", function(videoList, currentGroupId, currentUrl, limit = 10) { // Updated limit to 10
      if (!currentGroupId || !videoList) { return []; }
      const filtered = videoList.filter(item =>
          item.data?.sourceGroupId === currentGroupId && item.url !== currentUrl
      );
      const shuffled = shuffleArray([...filtered]); // Shuffle a copy
      const sliced = shuffled.slice(0, limit);
      return sliced;
    });

    // REMOVED separate shuffle filter
    // eleventyConfig.addFilter("shuffle", function(array) { ... }); 

    console.log("[CONFIG] Filters added"); // Log: Filters done
  } catch(e) { console.error("[CONFIG] Error adding filters:", e); }

// --- START: Replace filterOutUrl with version that includes slicing ---
eleventyConfig.addFilter("filterOutUrl", function(videoList, urlToExclude, limit = 8) { // Added limit parameter, default 5
  // console.log(`\n--- [FILTER filterOutUrl] Running ---`); // Keep logs if you want
  // console.log(`  Received urlToExclude: ${urlToExclude}`);
  // console.log(`  Received videoList length: ${videoList?.length}`);
  // console.log(`  Received limit: ${limit}`);

  if (!videoList) { return []; } // Handle missing list

  // 1. Filter
  const filtered = videoList.filter(item => item.url !== urlToExclude);
  // 2. Shuffle the filtered list (a copy)
  const shuffled = shuffleArray([...filtered]); 
  // 3. Slice
  const sliced = shuffled.slice(0, limit);
  return sliced; // Return the final filtered, shuffled, sliced list
});
// --- END Updated filterOutUrl ---

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