const MONTHS = {
  ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/well-known": ".well-known" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  // Data ISO (pentru atributul <time datetime>)
  eleventyConfig.addFilter("isoDate", (d) => {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toISOString().slice(0, 10);
  });

  // Data lizibila per limba: "25 septembrie 2026" / "September 25, 2026"
  eleventyConfig.addFilter("blogDate", (d, lang) => {
    const dt = d instanceof Date ? d : new Date(d);
    const m = (MONTHS[lang] || MONTHS.ro)[dt.getMonth()];
    return lang === "en"
      ? `${m} ${dt.getDate()}, ${dt.getFullYear()}`
      : `${dt.getDate()} ${m} ${dt.getFullYear()}`;
  });

  // Timp estimat de citire (minute) din HTML-ul articolului
  eleventyConfig.addFilter("readingMin", (html) => {
    const text = String(html || "").replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
