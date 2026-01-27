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

  // Filter to calculate duration between dates
  eleventyConfig.addFilter("calculateDuration", function(startDate, endDate) {
    if (!startDate) return "";
    
    const start = new Date(startDate + "-01");
    const end = endDate ? new Date(endDate + "-01") : new Date();
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Handle case where we're in the same month
    if (months === 0 && years === 0) {
      return "Less than 1 mo";
    }
    
    let duration = "";
    if (years > 0) {
      duration += years + (years === 1 ? " yr" : " yrs");
    }
    if (months > 0) {
      if (duration) duration += " ";
      duration += months + (months === 1 ? " mo" : " mos");
    }
    
    return duration;
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

