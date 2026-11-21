import test from "node:test";
import assert from "node:assert/strict";
import { estimateReadingTime, parseLessonSource, validateLessonCollection } from "../src/lib/insights-content.mjs";

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
