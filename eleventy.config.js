// Make the main function async to allow 'await' for imports
module.exports = async function(eleventyConfig) { 

  // --- Dynamically import slugify ---
  const slugifyPackage = await import('@sindresorhus/slugify'); 
  const slugify = slugifyPackage.default; 
  // --- End dynamic import ---

  // --- START: Define Helper Function Once ---
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

// --- START: Replace tagList Collection ---
eleventyConfig.addCollection("tagList", function(collectionApi) {
  let tagSet = new Set(); 

  // Helper function specifically for processing tags within this collection
  function processItemTags(tagData) { 
    let tags = [];
    if (Array.isArray(tagData)) {
      // If it's an array, process each string element within it
      tagData.forEach(item => {
        if (typeof item === 'string') {
          tags = tags.concat(
            item.split(',')
                .map(subItem => subItem.trim())
                .filter(subItem => subItem.length > 0)
          );
        }
      });
    } else if (typeof tagData === 'string') {
      // If it's already a string, process it directly
      tags = tagData.split(',')
                  .map(item => item.trim()) 
                  .filter(item => item.length > 0); 
    }
    return tags; 
  }

  collectionApi.getFilteredByGlob("src/_content/videos/**/*.md").forEach(item => {
    if (item.data.tags) {
      // Use the specific processing logic for the tag data
      let processedTags = processItemTags(item.data.tags); 
      processedTags.forEach(tag => tagSet.add(tag));
    }
  });
  // Return the unique tags as a sorted array
  return [...tagSet].sort(); 
});
// --- END: Replace tagList Collection ---

  // --- Filters ---
  eleventyConfig.addFilter("stringToArray", stringToArrayHelper); 
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str) { return ""; } 
    return slugify(str, { lower: true, strict: true });
  });
  // --- End Filters ---

  // Return Eleventy options
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "html", "njk"], 
    markdownTemplateEngine: "njk", 
    htmlTemplateEngine: "njk" 
  };
};