// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) { 

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
  eleventyConfig.addCollection("video", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  });

  eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagSet = new Set(); 
    collectionApi.getFilteredByGlob("src/_content/videos/**/*.md").forEach(item => {
      if (item.data.tags) {
        // Call the helper function defined above
        let tags = stringToArrayHelper(item.data.tags); // Use helper
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet].sort(); 
  });
  // --- End Collections ---

  // --- Filters ---
  // Use the helper function for the filter definition
  eleventyConfig.addFilter("stringToArray", stringToArrayHelper); // Use helper

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
}; // End module.exports async function