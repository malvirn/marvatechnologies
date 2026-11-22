import test from "node:test";
import assert from "node:assert/strict";
import { estimateReadingTime, parseLessonSource, validateLessonCollection, extractTableOfContents, getRelatedLessons, getLessonNavigation, getAllLessons } from "../src/lib/insights-content.mjs";

const base = {
  title: "A useful test lesson",
  slug: "a-useful-test-lesson",
  summary: "A sufficiently detailed summary for a lesson that explains one useful engineering practice.",
  track: "Frontend Engineering",
  level: "Foundation",
  tags: ["Testing"],
  publishedAt: "2026-11-21T00:00:00.000Z",
  updatedAt: "2026-11-21T00:00:00.000Z",
  lastReviewed: "2026-11-21T00:00:00.000Z",
  status: "draft",
  related: [],
  prerequisites: [],
  featured: false,
  hasDemo: false
};

function sourceFor(data) {
  const yaml = Object.entries(data).map(([key, value]) => key + ": " + JSON.stringify(value)).join("\n");
  return "---\n" + yaml + "\n---\n\nA short body for testing."; 
}

test("parses and validates lesson frontmatter", () => {
  const lesson = parseLessonSource(sourceFor(base), "a-useful-test-lesson.mdx");
  assert.equal(lesson.slug, "a-useful-test-lesson");
  assert.equal(lesson.status, "draft");
  assert.equal(lesson.readingTime, 1);
});

test("rejects summaries longer than 160 characters", () => {
  assert.throws(() => parseLessonSource(sourceFor({ ...base, summary: "x".repeat(161) }), "a-useful-test-lesson.mdx"), /at most 160/);
});

test("rejects a slug that does not match its filename", () => {
  assert.throws(() => parseLessonSource(sourceFor(base), "different-file-name.mdx"), /must match filename/);
});

test("rejects duplicate slugs", () => {
  const first = parseLessonSource(sourceFor(base), "a-useful-test-lesson.mdx");
  assert.throws(() => validateLessonCollection([first, { ...first }]), /Duplicate lesson slug/);
});

test("rejects broken related and prerequisite references", () => {
  const lesson = parseLessonSource(sourceFor({ ...base, related: ["missing-note"] }), "a-useful-test-lesson.mdx");
  assert.throws(() => validateLessonCollection([lesson]), /references missing lesson/);
});

test("estimates reading time from prose and ignores fenced code", () => {
  const prose = Array.from({ length: 230 }, () => "word").join(" ");
  const content = prose + "\n\n```ts\nconst ignored = true;\n```";
  assert.equal(estimateReadingTime(content), 2);
});

test("extracts h2 and h3 headings while ignoring fenced code", () => {
  const toc = extractTableOfContents("# Page title\n\n## Why it matters\n### When to use it\n\n```md\n## Not a real heading\n```\n\n## Why it matters");
  assert.deepEqual(toc.map(({ id, level }) => [id, level]), [
    ["bn-why-it-matters", 2],
    ["bn-when-to-use-it", 3],
    ["bn-why-it-matters-1", 2]
  ]);
});

test("uses explicit related lessons first and same-track notes as fallback", () => {
  const current = { ...base, related: ["another-track"] };
  const explicit = { ...base, slug: "another-track", track: "Backend Engineering" };
  const fallback = { ...base, slug: "same-track", publishedAt: "2026-11-22T00:00:00.000Z" };
  assert.deepEqual(getRelatedLessons(current, [current, explicit, fallback]).map((item) => item.slug), ["another-track", "same-track"]);
});

test("returns previous and next lessons from the same track only", () => {
  const older = { ...base, slug: "older", publishedAt: "2026-11-19T00:00:00.000Z" };
  const current = { ...base, slug: "current", publishedAt: "2026-11-20T00:00:00.000Z" };
  const newer = { ...base, slug: "newer", publishedAt: "2026-11-21T00:00:00.000Z" };
  const other = { ...base, slug: "other-track", track: "System Design" };
  const nav = getLessonNavigation(current, [newer, other, current, older]);
  assert.equal(nav.previous.slug, "older");
  assert.equal(nav.next.slug, "newer");
});


test("contains the six-lesson launch set as drafts; notes added later are allowed", () => {
  const launch = [
    "audit-before-you-modify",
    "building-unreliable-networks",
    "database-transactions-ledger-consistency",
    "debounced-search-url-state",
    "plan-before-you-code",
    "preventing-duplicate-submissions"
  ];
  const lessons = getAllLessons();
  const launchLessons = lessons.filter((lesson) => launch.includes(lesson.slug));
  assert.deepEqual(launchLessons.map((lesson) => lesson.slug).sort(), launch);
  assert.ok(launchLessons.every((lesson) => lesson.status === "draft"));
  assert.ok(launchLessons.every((lesson) => lesson.content.includes("TODO(author)")));
  assert.equal(launchLessons.filter((lesson) => lesson.hasDemo).length, 3);
});

test("the three declared lazy demos match the launch lesson content", () => {
  const lessons = getAllLessons();
  const types = lessons.map((lesson) => lesson.content.match(/<Demo type="([^"]+)"/)?.[1]).filter(Boolean).sort();
  assert.deepEqual(types, ["debounce", "duplicate-requests", "optimistic-ui"]);
});

test("teaching examples use BeforeAfter and PromptBlock without adding services", () => {
  const lessons = getAllLessons();
  assert.ok(lessons.some((lesson) => lesson.content.includes("<BeforeAfter")));
  assert.ok(lessons.some((lesson) => lesson.content.includes("<PromptBlock")));
  assert.ok(lessons.every((lesson) => !/https?:\/\//.test(lesson.content)));
});


test("lesson bodies do not introduce a second page-level h1", () => {
  const lessons = getAllLessons();
  for (const lesson of lessons) {
    const body = lesson.content.replace(/```[\s\S]*?```/g, "");
    assert.doesNotMatch(body, /^#\s/m, lesson.slug + " should use h2 for its first section");
  }
});
