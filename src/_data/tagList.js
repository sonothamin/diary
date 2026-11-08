import { readFileSync } from "node:fs";
import { scanPosts, slugify, titleFrom, normTags } from "../../lib/posts.js";

const info = JSON.parse(readFileSync("src/_data/tagInfo.json", "utf8"));
const RESERVED = ["all", "diary"]; // Eleventy turns tags into collections; these names are taken

export default function () {
  const map = new Map();

  for (const { file, data } of scanPosts()) {
    const when = data.date ? new Date(data.date).getTime() : 0;
    for (const raw of normTags(data.tags)) {
      const slug = slugify(raw);
      if (!slug) continue;
      if (RESERVED.includes(slug)) throw new Error(`Tag "${raw}" in "${file}" is reserved. Pick another name.`);
      let t = map.get(slug);
      if (!t) {
        const meta = info[slug] || {};
        t = { slug, title: meta.title || (raw === slug ? titleFrom(slug) : raw), blurb: meta.blurb || "", count: 0, latest: 0 };
        map.set(slug, t);
      }
      t.count++;
      t.latest = Math.max(t.latest, when);
    }
  }

  return [...map.values()].sort((a, b) => b.latest - a.latest || a.title.localeCompare(b.title));
}
