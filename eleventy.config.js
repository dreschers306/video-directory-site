module.exports = function(eleventyConfig) {
    // Return your Object options:
    return {
      dir: {
        input: "src", // Input directory
        output: "_site", // Output directory
        includes: "_includes", // Directory for reusable components/layouts
        data: "_data" // Directory for global data files (like our videos.json later)
      },
      // Template formats to process (we'll start with Markdown and HTML)
      templateFormats: ["md", "html", "njk"], // Added Nunjucks (.njk)
      markdownTemplateEngine: "njk", // Use Nunjucks for Markdown files
      htmlTemplateEngine: "njk" // Use Nunjucks for HTML files too
    };
  };