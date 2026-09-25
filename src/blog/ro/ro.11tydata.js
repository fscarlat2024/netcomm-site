// Date implicite pentru toate articolele RO din src/blog/ro/
// Fiecare .md de aici devine /blog/<slug>/ si intra in colectia "blogRo".
module.exports = {
  layout: "article.njk",
  lang: "ro",
  pageId: "article",
  templateEngineOverride: "md", // corpul articolului = markdown pur (fara njk in text)
  tags: ["blogRo"],
  permalink: (data) => `/blog/${data.page.fileSlug}/`,
  eleventyComputed: {
    seoTitle: (data) => `${data.title} | ${data.site.brandName}`,
    seoDesc: (data) => data.description,
    blogHrefRo: (data) => `/blog/${data.page.fileSlug}/`,
    blogHrefEn: (data) => `/en/blog/${data.page.fileSlug}/`,
  },
};
