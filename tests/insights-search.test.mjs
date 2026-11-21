import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchIndex, normalizeSearchText, searchLessons } from "../src/lib/insights-search.mjs";

const lessons = [
  { slug: "url-debounce", title: "Debounced search that syncs to the URL", summary: "Search without work on every keystroke.", track: "Frontend Engineering", level: "Foundation", tags: ["Search", "URL state"], publishedAt: "2026-11-21" },
  { slug: "network-failures", title: "Building for unreliable networks", summary: "Handle retries and offline states.", track: "System Design", level: "Intermediate", tags: ["Offline", "Reliability"], publishedAt: "2026-11-20" },
  { slug: "duplicate-submit", title: "Preventing duplicate submissions", summary: "Protect actions from repeated clicks.", track: "Frontend Engineering", level: "Intermediate", tags: ["Forms", "Requests"], publishedAt: "2026-11-19" }
];

test("normalizes case, accents and punctuation", () => {
  assert.equal(normalizeSearchText("URL-State: Résumé!"), "url state resume");
});
test("ranks title matches before summary matches", () => {
  const results = searchLessons(buildSearchIndex(lessons), "search", "", "");
  assert.equal(results[0].slug, "url-debounce");
});
test("combines track and level filters", () => {
  const results = searchLessons(buildSearchIndex(lessons), "", "Frontend Engineering", "Intermediate");
  assert.deepEqual(results.map((item) => item.slug), ["duplicate-submit"]);
});
test("searches tags and summaries as well as titles", () => {
  assert.equal(searchLessons(buildSearchIndex(lessons), "offline", "", "")[0].slug, "network-failures");
  assert.equal(searchLessons(buildSearchIndex(lessons), "repeated clicks", "", "")[0].slug, "duplicate-submit");
});
test("requires every search term to match", () => {
  assert.deepEqual(searchLessons(buildSearchIndex(lessons), "search offline", "", ""), []);
});
