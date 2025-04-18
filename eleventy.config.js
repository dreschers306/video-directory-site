const slugify = require("@sindresorhus/slugify");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");  
  // eleventyConfig.addPassthroughCopy("src/assets"); // Uncomment if you create an assets folder

// --- START: Add Slugify Filter ---
eleventyConfig.addFilter("slugify", function(str) {
  if (!str) { return ""; } // Handle empty input
  return slugify(str, {
    lower: true, // convert to lower case
    strict: true // remove characters like !, ., ', etc.
  });
});
// --- END: Add Slugify Filter ---

  // --- START: Add Tag Collection Logic ---

// Helper function to split/trim tags string (should already be here)
eleventyConfig.addFilter("stringToArray", function(str) {
  if (!str) { return []; }
  return str.split(',')
            .map(item => item.trim()) 
            .filter(item => item.length > 0); 
});

// Create a distinct list of all tags, sorted alphabetically
eleventyConfig.addCollection("tagList", function(collectionApi) {
  let tagSet = new Set(); // Using a Set automatically handles duplicates
  // Access the video collection we already defined
  collectionApi.getFilteredByGlob("src/_content/videos/**/*.md").forEach(item => {
    if (item.data.tags) {
      // Use our filter to get tags as an array
      let tags = eleventyConfig.getFilter("stringToArray")(item.data.tags); 
      tags.forEach(tag => tagSet.add(tag));
    }
  });
  // Return the unique tags as a sorted array
  return [...tagSet].sort(); 
});
// --- END: Add Tag Collection Logic ---

  // Create a collection named "video" from files in the videos folder
  eleventyConfig.addCollection("video", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  });

  // Return your Object options:
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
};