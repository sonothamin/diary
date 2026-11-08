const isBuild = process.env.ELEVENTY_RUN_MODE === "build";

export default {
  layout: "layouts/post.njk",
  // my-post.md  or  my-post/index.md  ->  /posts/my-post/
  permalink: (data) => (data.draft && isBuild ? false : `/posts/${data.page.fileSlug}/`),
  eleventyComputed: {
    // reading time from the raw Markdown unless the post sets `read` itself
    read: (data) => {
      if (data.read) return data.read;
      const words = (data.page.rawInput || "").split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 200));
    },
  },
};
