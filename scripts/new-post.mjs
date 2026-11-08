// npm run new -- "My post title" building
import { writeFileSync, existsSync, readFileSync } from "node:fs";

const [title, category = "building"] = process.argv.slice(2);
if (!title) {
  console.error('Usage: npm run new -- "Post title" [category]');
  process.exit(1);
}
const cats = JSON.parse(readFileSync("src/_data/categoryInfo.json", "utf8")).map((c) => c.slug);
if (!cats.includes(category)) {
  console.log(`Note: "${category}" is a new category. It will be created automatically.`);
}
const slug = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const file = `src/posts/${slug}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}
const date = new Date().toISOString().slice(0, 10);
writeFileSync(file, `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndate: ${date}\ncategory: ${category}\nsummary: ""\ndraft: true\n---\n\nWrite here.\n`);
console.log("created", file, "(draft: true, remove it when ready to publish)");
