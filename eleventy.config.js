// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) { // <--- START OF FUNCTION SCOPE

  // --- Dynamically import slugify ---
  const slugifyPackage = await import('@sindresorhus/slugify');
  const slugify = slugifyPackage.default;
  // --- End dynamic import ---

  // --- START: Define Helper Function Once (inside module.exports scope) ---
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
    // ... complex logic commented out ...
  }); // Note: removed semicolon from inside comment
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

}; // <-- *** THIS IS THE CORRECT CLOSING BRACE AND SEMICOLON ***