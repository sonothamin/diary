/*
  Categories are discovered from the posts themselves: any `category:` used in a post's
  front matter gets a home-page column and a /category/<slug>/ page.

  src/_data/categoryInfo.json is optional. Add an entry there to give a category a nicer
  title, a description, or to control the order (listed ones come first, in file order;
  new ones follow alphabetically).
*/
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
