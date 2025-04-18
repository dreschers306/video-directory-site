module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");  
  // eleventyConfig.addPassthroughCopy("src/assets"); // Uncomment if you create an assets folder

  // Create a collection named "video" from files in the videos folder
  eleventyConfig.addCollection("video", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  });

  // --- START: Add stringToArray filter ---
  eleventyConfig.addFilter("stringToArray", function(str) {
    if (!str) {
      return []; // Return empty array if no tags string exists
    }
    // 1. Split the string by commas
    // 2. For each resulting item, remove leading/trailing whitespace (.trim())
    // 3. Filter out any empty items that might result from extra commas
    return str.split(',')
              .map(item => item.trim()) 
              .filter(item => item.length > 0); 
  });
  // --- END: Add stringToArray filter ---

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