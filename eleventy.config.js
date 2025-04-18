module.exports = function(eleventyConfig) {

  // Tell Eleventy to copy the 'admin' folder straight through
  eleventyConfig.addPassthroughCopy("admin"); 

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