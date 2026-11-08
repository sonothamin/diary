
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const isBuild = process.env.ELEVENTY_RUN_MODE === "build";
const postsDir = "src/posts";

export const slugify = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const titleFrom = (slug) => slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const normTags = (t) =>
  (Array.isArray(t) ? t : t ? [t] : []).map((x) => String(x).trim()).filter(Boolean);

export function scanPosts() {
  const out = [];
  for (const rel of readdirSync(postsDir, { recursive: true })) {
    if (!String(rel).endsWith(".md")) continue;
    const { data } = matter(readFileSync(join(postsDir, String(rel)), "utf8"));
    if (data.draft && isBuild) continue;
    out.push({ file: String(rel), data });
  }
  return out;
}