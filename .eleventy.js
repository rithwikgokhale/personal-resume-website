const { DateTime } = require("luxon");

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

  // ========================================
  // Collections
  // ========================================

  // Blog collection - sorted by date descending
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Tags collection - generates a collection per tag
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => {
          if (tag !== "blog") { // Exclude the "blog" tag used for collection
            tagSet.add(tag);
          }
        });
      }
    });
    return [...tagSet].sort();
  });

  // ========================================
  // Filters
  // ========================================

  // Date formatting filter
  eleventyConfig.addFilter("formatDate", function(date) {
    if (!date) return "";
    const dt = DateTime.fromJSDate(new Date(date));
    return dt.toFormat("MMMM d, yyyy"); // e.g., "August 1, 2025"
  });

  // Short date format for feeds
  eleventyConfig.addFilter("dateToRfc3339", function(date) {
    if (!date) return "";
    return DateTime.fromJSDate(new Date(date)).toISO();
  });

  // Filter to calculate duration between dates (for experience)
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

  // Limit filter for arrays (useful for showing latest N posts)
  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  // Slugify filter for tag URLs
  eleventyConfig.addFilter("slugify", function(value) {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  // Slugify filter for tag URLs
  eleventyConfig.addFilter("slugify", function(value) {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  // ========================================
  // Shortcodes
  // ========================================

  // Current year shortcode for copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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
