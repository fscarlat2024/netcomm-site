// Default data for all EN articles in src/blog/en/
// Each .md here becomes /en/blog/<slug>/ and joins the "blogEn" collection.
module.exports = {
  layout: "article.njk",
  lang: "en",
  pageId: "article",
  templateEngineOverride: "md",
  tags: ["blogEn"],
  permalink: (data) => `/en/blog/${data.page.fileSlug}/`,
  eleventyComputed: {
    seoTitle: (data) => `${data.title} | ${data.site.brandName}`,
    seoDesc: (data) => data.description,
    blogHrefRo: (data) => `/blog/${data.page.fileSlug}/`,
    blogHrefEn: (data) => `/en/blog/${data.page.fileSlug}/`,
  },
};
