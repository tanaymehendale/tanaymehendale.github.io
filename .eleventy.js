module.exports = function(eleventyConfig) {
  // Pass through assets verbatim — no Eleventy processing
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("emailjs_config.js");
  eleventyConfig.addPassthroughCopy("mapbox_config.js");

  // Preserve the customer-churn Tableau dashboard (standalone HTML)
  eleventyConfig.addPassthroughCopy({
    "projects/customer-churn/dashboard.html": "projects/customer-churn/dashboard.html"
  });

  // Two-digit filter for project index numbers
  eleventyConfig.addFilter("twoDigit", function(n) {
    return String(n).padStart(2, "0");
  });

  // Human-readable category label
  eleventyConfig.addFilter("categoryLabel", function(cat) {
    const labels = {
      "ai-ml": "AI & Machine Learning",
      "data-engg": "Data Engineering",
      "data-analytics": "Data Analytics",
      "pm": "Product Management",
    };
    return labels[cat] || cat;
  });

  // Filter projects array to featured only
  eleventyConfig.addFilter("featuredOnly", function(projects) {
    return (projects || []).filter(p => p.featured);
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
