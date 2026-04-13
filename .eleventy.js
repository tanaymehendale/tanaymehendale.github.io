module.exports = function(eleventyConfig) {
  // Pass through assets verbatim — no Eleventy processing
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("emailjs_config.js");

  // Preserve the customer-churn Tableau dashboard (standalone HTML)
  eleventyConfig.addPassthroughCopy({
    "projects/customer-churn/dashboard.html": "projects/customer-churn/dashboard.html"
  });

  // Two-digit filter for project index numbers
  eleventyConfig.addFilter("twoDigit", function(n) {
    return String(n).padStart(2, "0");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
