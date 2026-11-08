import { readFileSync } from "node:fs";
import { scanPosts, titleFrom } from "../../lib/posts.js";

const info = JSON.parse(readFileSync("src/_data/categoryInfo.json", "utf8"));

export default function () {
  const used = new Set();
  for (const { file, data } of scanPosts()) {
    if (!data.category) throw new Error(`Post "${file}" has no \`category:\` in its front matter.`);
    used.add(String(data.category).trim());
  }

  const known = info.map((c) => c.slug);
  const extra = [...used].filter((s) => !known.includes(s)).sort();

  return [...info, ...extra.map((slug) => ({ slug, title: titleFrom(slug), blurb: "" }))];
}
