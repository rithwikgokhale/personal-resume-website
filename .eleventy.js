module.exports = function(eleventyConfig) {
  // Passthrough copy existing static assets from current site
  eleventyConfig.addPassthroughCopy({
    "resume-website/assets": "assets",
    "resume-website/images": "images",
    "resume-website/documents": "documents"
  });

  // Watch these for changes
  eleventyConfig.addWatchTarget("resume-website/assets");
  eleventyConfig.addWatchTarget("resume-website/images");

  // Create blog collection
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });

  // Ensure docs are processed
  eleventyConfig.addCollection("docs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/docs/*.md");
  });

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};

