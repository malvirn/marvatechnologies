import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const routes = [
  ["Home", new URL("../src/app/page.tsx", import.meta.url)],
  ["About", new URL("../src/app/about/page.tsx", import.meta.url)],
  ["Services", new URL("../src/app/services/page.tsx", import.meta.url)]
];

async function readMetadata([name, url]) {
  const source = await readFile(url, "utf8");
  const title = source.match(/const pageTitle = "([^"]+)";/)?.[1];
  const description = source.match(/const pageDescription = "([^"]+)";/)?.[1];
  assert.ok(title, name + " route must define a page-specific title");
  assert.ok(description, name + " route must define a page-specific description");
  assert.match(source, /alternates:\s*\{\s*canonical:\s*normalizeSiteUrl\(\)/, name + " route must use the SITE_URL helper for its canonical URL");
  assert.match(source, /openGraph:\s*\{[\s\S]*?title:\s*pageTitle,[\s\S]*?description:\s*pageDescription/, name + " route must mirror its metadata in Open Graph");
  assert.match(source, /twitter:\s*\{[\s\S]*?title:\s*pageTitle,[\s\S]*?description:\s*pageDescription/, name + " route must mirror its metadata in Twitter cards");
  return { name, title, description };
}

test("public Home, About and Services routes have unique SEO titles and descriptions", async () => {
  const metadata = await Promise.all(routes.map(readMetadata));
  const titles = metadata.map((item) => item.title);
  const descriptions = metadata.map((item) => item.description);

  assert.equal(new Set(titles).size, titles.length, "public routes must not share titles");
  assert.equal(new Set(descriptions).size, descriptions.length, "public routes must not share descriptions");

  for (const item of metadata) {
    assert.ok(item.description.length >= 150 && item.description.length <= 160,
      item.name + " description must be 150 to 160 characters, got " + item.description.length);
  }
});
