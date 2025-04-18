// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) {

  // --- Dynamically import slugify ---
  const slugifyPackage = await import('@sindresorhus/slugify');
  const slugify = slugifyPackage.default;
  // --- End dynamic import ---

  // --- START: Define Helper Function Once ---
  // We still need this helper for the stringToArray filter
  function stringToArrayHelper(input) {
    if (Array.isArray(input)) {
      return input.map(item => String(item || '').trim()).filter(item => item.length > 0);
    }
    if (typeof input === 'string') {
      return input.split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
    }
    return [];
  }
  // --- END: Define Helper Function Once ---

  // --- Passthrough Copies ---
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  // --- End Passthrough Copies ---

  // --- Collections ---
  // Video collection remains the same
  eleventyConfig.addCollection("video", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  });

  /* --- START: Complex tagList Collection (COMMENTED OUT FOR TESTING) ---
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    console.log("\n--- Building tagList Collection ---"); // LOG START
    let tagSet = new Set(); 
    
    // Helper function inside collection scope for this test (now defined outside)
    // function processItemTags(tagData) { ... } // Logic moved to stringToArrayHelper

    const videos = collectionApi.getFilteredByGlob("src/_content/videos/**/     //*.md");
    console.log(`Found ${videos.length} video files.`); // LOG COUNT

    videos.forEach((item, index) => {
      console.log(`[${index+1}/${videos.length}] Processing file: ${item.inputPath}`); // LOG FILENAME
      console.log(`  Raw item.data.tags:`, item.data.tags); 
      console.log(`  Type of item.data.tags: ${typeof item.data.tags}`); 

      if (item.data.tags) { 
          let processedTags = stringToArrayHelper(item.data.tags); // Use main helper
          console.log(`  Processed tags array:`, processedTags); // LOG PROCESSED TAGS
          processedTags.forEach(tag => tagSet.add(tag));
      } else {
        console.log("  No tags found or tags field empty in front matter."); // LOG if no tags field
      }
    });
    console.log("Final tagSet before sorting:", tagSet); // LOG FINAL SET
    const sortedTags = [...tagSet].sort();
    console.log("Sorted tagList being returned:", sortedTags); // LOG RETURN VALUE
    console.log("--- Finished tagList Collection ---\n");
    return sortedTags; 
  };
  //--- END: Complex tagList Collection (COMMENTED OUT FOR TESTING) --- */

  // --- START: Minimal Test for tagList ---
  // This is the only active tagList collection definition now
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    // Add a single log to see if THIS function runs
    console.log("--- Running MINIMAL tagList Collection ---");
    // Just return a hardcoded array for testing
    return ["test-tag-1", "test-tag-2", "sample-tag"];
  });
  // --- END: Minimal Test for tagList ---

  // --- End Collections ---


  // --- Filters ---
  // Use the helper function for the filter definition
  eleventyConfig.addFilter("stringToArray", stringToArrayHelper);

  // Slugify Filter (uses the dynamically imported 'slugify')
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str) { return ""; }
    return slugify(str, {
      lower: true,
      strict: true
    });
  });
  // --- End Filters ---


  // Return Eleventy options
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "html", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
; // End module.exports async function