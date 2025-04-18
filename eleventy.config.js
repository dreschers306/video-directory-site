module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin"); 
  // Optional: Good practice to copy other static assets too if you have them
  // eleventyConfig.addPassthroughCopy("src/assets"); 

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
      data: "_data" // Still useful for other global data potentially
    },
    templateFormats: ["md", "html", "njk"], 
    markdownTemplateEngine: "njk", 
    htmlTemplateEngine: "njk" 
  };
};