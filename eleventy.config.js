/*
  Diary: Eleventy config.

  Markdown in src/posts/  ->  static HTML at /Diary/posts/<slug>/
  The site lives under /Diary/ on sonothamin.dev (project page of the "Diary" repo),
  so every internal link goes through Eleventy's `url` filter, which adds that prefix.
  Override with PATH_PREFIX=/ if you ever move it to its own domain or subdomain.
*/
import { slugify, normTags } from "./lib/posts.js";

const isBuild = process.env.ELEVENTY_RUN_MODE === "build";
const pathPrefix = process.env.PATH_PREFIX ?? "/diary/";

export default function (eleventyConfig) {
  /* ---------- static files ---------- */
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  // images and other files kept next to a post (src/posts/my-post/photo.jpg)
  eleventyConfig.addPassthroughCopy("src/posts/**/*.{png,jpg,jpeg,gif,webp,avif,svg,mp4,webm,pdf,zip}");

  /* ---------- markdown ---------- */
  eleventyConfig.amendLibrary("md", (md) => md.set({ html: true, linkify: true, typographer: true }));

  /* ---------- collection: every post, newest first (drafts hidden in production builds) ---------- */
  eleventyConfig.addCollection("diary", (api) =>
    api
      .getFilteredByGlob("src/posts/**/*.md")
      .filter((p) => !(isBuild && p.data.draft))
      .sort((a, b) => b.date - a.date)
  );

  /* ---------- filters ---------- */
  eleventyConfig.addFilter("fmtDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("inCategory", (posts, slug) => posts.filter((p) => p.data.category === slug));
  eleventyConfig.addFilter("byYear", (posts) => {
    const groups = [];
    for (const p of posts) {
      const year = new Date(p.date).getUTCFullYear();
      let g = groups.find((x) => x.year === year);
      if (!g) groups.push((g = { year, posts: [] }));
      g.posts.push(p);
    }
    return groups;
  });
  // tags
  const tagSlugs = (post) => normTags(post.data.tags).map(slugify);
  eleventyConfig.addFilter("inTag", (posts, slug) => posts.filter((p) => tagSlugs(p).includes(slug)));
  eleventyConfig.addFilter("tagsOf", (raw, tagList) =>
    [...new Set(normTags(raw).map(slugify))].map((s) => tagList.find((t) => t.slug === s)).filter(Boolean)
  );
  eleventyConfig.addFilter("tagOthers", (posts, url, slug, n) =>
    posts.filter((p) => p.url !== url && tagSlugs(p).includes(slug)).slice(0, n)
  );

  // RSS helpers
  eleventyConfig.addFilter("head", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("rfc822", (d) => new Date(d).toUTCString());
  eleventyConfig.addFilter("cdata", (s) => `<![CDATA[${String(s).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`);
  // make relative and root-relative links/images in post HTML absolute, for feed readers
  eleventyConfig.addFilter("absolutize", (html, origin, pageUrl) =>
    String(html).replace(/(\s(?:href|src)=")([^"]*)"/g, (m, attr, val) => {
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(val)) return m; // http:, mailto:, data:, #anchor, //host
      const abs = val.startsWith("/") ? origin + val : new URL(val, origin + pageUrl).href;
      return `${attr}${abs}"`;
    })
  );
  // fails the build on a typo in a post's `category`, instead of publishing a broken page
  eleventyConfig.addFilter("catBySlug", (cats, slug) => {
    const c = cats.find((x) => x.slug === slug);
    if (!c) throw new Error(`Unknown category "${slug}". Check the post's front matter.`);
    return c;
  });
  // newer / older neighbours and "more in category" for a post page
  eleventyConfig.addFilter("postContext", (posts, url, slug) => {
    const list = posts.filter((p) => p.data.category === slug);
    const at = list.findIndex((p) => p.url === url);
    return {
      newer: at > 0 ? list[at - 1] : null,
      older: at >= 0 ? list[at + 1] || null : null,
      others: list.filter((p) => p.url !== url).slice(0, 4),
    };
  });

  return {
    pathPrefix,
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
