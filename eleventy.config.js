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

// --- START: Replace tagList Collection with LOGGING version ---
eleventyConfig.addCollection("tagList", function(collectionApi) {
  console.log("\n--- Building tagList Collection ---"); // LOG START
  let tagSet = new Set(); 

  // Helper function inside collection scope for this test
  function processItemTags(tagData) { 
    let tags = [];
    if (Array.isArray(tagData)) {
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
      tags = tagData.split(',')
                  .map(item => item.trim()) 
                  .filter(item => item.length > 0); 
    }
    return tags; 
  }

  const videos = collectionApi.getFilteredByGlob("src/_content/videos/**/*.md");
  console.log(`Found ${videos.length} video files.`); // LOG COUNT

  videos.forEach((item, index) => {
    console.log(`[<span class="math-inline">\{index\+1\}/</span>{videos.length}] Processing file: ${item.inputPath}`); // LOG FILENAME
    // Log the raw tags data and its type
    console.log(`  Raw item.data.tags:`, item.data.tags); 
    console.log(`  Type of item.data.tags: ${typeof item.data.tags}`); 

    if (item.data.tags) { 
        let processedTags = processItemTags(item.data.tags); 
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