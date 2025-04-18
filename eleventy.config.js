// Remove the old 'require' from the top (if it's still there)
// const slugify = require("@sindresorhus/slugify"); // REMOVE/COMMENT OUT THIS LINE

// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) { 

  // --- Dynamically import slugify ---
  // Import the ESM package using await import()
  const slugifyPackage = await import('@sindresorhus/slugify'); 
  // Access the actual slugify function from the imported module
  const slugify = slugifyPackage.default; 
  // --- End dynamic import ---

  // --- Passthrough Copies ---
  eleventyConfig.addPassthroughCopy("admin"); 
  eleventyConfig.addPassthroughCopy("src/css"); 
  eleventyConfig.addPassthroughCopy("src/js"); 
  // --- End Passthrough Copies ---

  // --- Collections ---
  // Create a collection named "video" from files in the videos folder
  eleventyConfig.addCollection("video", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  });

  // Create a distinct list of all tags, sorted alphabetically
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagSet = new Set(); 
    collectionApi.getFilteredByGlob("src/_content/videos/**/*.md").forEach(item => {
      if (item.data.tags) {
        // Use the filter directly here for consistency
        let tags = eleventyConfig.getFilter("stringToArray")(item.data.tags); 
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet].sort(); 
  });
  // --- End Collections ---

  // --- Filters ---
  // Helper function to split/trim tags string
  eleventyConfig.addFilter("stringToArray", function(str) {
    if (!str) { return []; }
    return str.split(',')
              .map(item => item.trim()) 
              .filter(item => item.length > 0); 
  });

  // Slugify Filter (now uses the dynamically imported 'slugify')
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str) { return ""; } 
    // Use the slugify function we loaded via import()
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
}; // End module.exports async function