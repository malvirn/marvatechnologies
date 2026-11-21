import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSiteUrl,
  escapeXml,
  plainTextFromMdx,
  buildRssFeed,
  getSitemapEntries,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionJsonLd,
  serializeJsonLd
} from "../src/lib/insights-seo.mjs";

const published = {
  title: "Reliable requests & safe retries",
  slug: "reliable-requests-safe-retries",
  summary: "A practical note about handling repeated requests safely.",
  track: "Backend Engineering",
  level: "Intermediate",
  tags: ["Building software", "Reliability"],
  publishedAt: "2026-11-20T00:00:00.000Z",
  updatedAt: "2026-11-21T00:00:00.000Z",
  status: "published",
  content: "# Why it matters\n\nA safe retry keeps one **business action** from being repeated.\n\n```ts\nconst secret = \"not included\";\n```"
};

const draft = {
  ...published,
  title: "Private draft",
  slug: "private-draft",
  status: "draft"
};

test("normalizes the configured site URL", () => {
  assert.equal(normalizeSiteUrl("https://example.test///"), "https://example.test");
});

test("escapes XML special characters", () => {
  assert.equal(escapeXml("A & B < C"), "A &amp; B &lt; C");
});

test("extracts readable text without code fences or MDX tags", () => {
  assert.equal(plainTextFromMdx("# Heading\n\nUseful **plain text**.\n\n```js\nsecret()\n```"), "Heading Useful plain text.");
});

test("RSS includes published lessons and excludes drafts", () => {
  const feed = buildRssFeed([published, draft], "https://example.test/");
  assert.match(feed, /<rss version="2.0"/);
  assert.match(feed, /Reliable requests &amp; safe retries/);
  assert.match(feed, /A practical note about handling repeated requests safely/);
  assert.match(feed, /reliable-requests-safe-retries/);
  assert.doesNotMatch(feed, /private-draft|Private draft/);
  assert.match(feed, /<atom:link/);
});

test("sitemap includes static pages and only published lesson URLs", () => {
  const entries = getSitemapEntries([published, draft], "https://example.test");
  const urls = entries.map((entry) => entry.url);
  assert.ok(urls.includes("https://example.test/insights"));
  assert.ok(urls.includes("https://example.test/insights/reliable-requests-safe-retries"));
  assert.ok(!urls.some((url) => url.includes("private-draft")));
});

test("Article and BreadcrumbList JSON-LD use published lesson metadata", () => {
  const article = buildArticleJsonLd(published, "https://example.test");
  const breadcrumb = buildBreadcrumbJsonLd(published, "https://example.test");
  assert.equal(article["@type"], "Article");
  assert.equal(article.headline, published.title);
  assert.equal(article.datePublished, published.publishedAt);
  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.equal(breadcrumb.itemListElement.length, 4);
  assert.equal(buildCollectionJsonLd("https://example.test").url, "https://example.test/insights");
});

test("JSON-LD serialization escapes markup characters", () => {
  const serialized = serializeJsonLd({ headline: "</script><script>alert(1)</script>", value: "A & B" });
  assert.doesNotMatch(serialized, /<\/script>/);
  assert.match(serialized, /\\u003c/);
  assert.match(serialized, /\\u0026/);
});
