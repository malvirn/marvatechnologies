import test from "node:test";
import assert from "node:assert/strict";
import { isStudioCommand, deriveSummary, resolveNote, slugify, validateNote, buildNoteFile, findMdxRisks, imageMarkdown } from "../src/lib/note-composer.mjs";
import { parseLessonSource } from "../src/lib/insights-content.mjs";

const base = {
  title: "Idempotent webhooks & retries", summary: "Make webhook handlers safe to run twice so retries never double-charge a customer.",
  track: "Backend Engineering", level: "Intermediate", tags: "Webhooks, Payments, webhooks", builtFrom: "", status: "draft",
  body: "## TL;DR\n\nStore the event id before you act on it, and ignore repeats of the same id.\n", images: []
};

test("slugify produces schema-safe slugs", () => {
  assert.equal(slugify("Idempotent webhooks & retries"), "idempotent-webhooks-and-retries");
  assert.equal(slugify("  Café — Ünïcode!! "), "cafe-unicode");
  assert.match(slugify("a".repeat(200)), /^[a-z0-9]+$/);
});

test("a generated note is accepted by the real lesson schema", () => {
  const file = buildNoteFile(base, new Date("2026-11-22T10:00:00.000Z"));
  const lesson = parseLessonSource(file.mdx, file.filename);
  assert.equal(lesson.slug, "idempotent-webhooks-and-retries");
  assert.equal(lesson.status, "draft");
  assert.deepEqual(lesson.tags, ["Webhooks", "Payments"]);
  assert.equal(lesson.track, "Backend Engineering");
});

test("titles with quotes and colons stay valid YAML", () => {
  const file = buildNoteFile({ ...base, title: 'Why "optimistic": UI? needs rollback' });
  assert.equal(parseLessonSource(file.mdx, file.filename).title, 'Why "optimistic": UI? needs rollback');
});

test("validation reports the same limits the build enforces", () => {
  const bad = validateNote({ ...base, title: "Hi", summary: "x".repeat(161), track: "", body: "short" }, []);
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.title && bad.errors.summary && bad.errors.track && bad.errors.body);
  assert.equal(validateNote(base, ["idempotent-webhooks-and-retries"]).valid, false);
  assert.equal(validateNote(base, []).valid, true);
});

test("MDX risks flag braces and unknown tags outside code only", () => {
  assert.equal(findMdxRisks("Use `{a}` and\n```js\nconst x = {};\n<div/>\n```\n").length, 0);
  assert.ok(findMdxRisks("Value is {x}").length > 0);
  assert.ok(findMdxRisks("<div>hi</div>").length > 0);
  assert.equal(findMdxRisks("<Callout variant=\"tip\">ok</Callout>").length, 0);
});

test("image markdown strips characters that would break the alt text", () => {
  assert.equal(imageMarkdown("A [bad]\nalt", "/insights/images/x/a.jpg"), "\n\n![A  bad  alt](/insights/images/x/a.jpg)\n\n");
});

test("optional fields are filled in so only title, category and note are required", () => {
  const minimal = { title: "Retry with backoff", track: "Backend Engineering", status: "published", body: "## TL;DR\n\nRetry failed calls, but wait longer each time so you never hammer a struggling server.\n", images: [] };
  const resolved = resolveNote(minimal);
  assert.equal(resolved.level, "Foundation");
  assert.equal(resolved.tags, "Backend Engineering");
  assert.ok(resolved.summary.length >= 20 && resolved.summary.length <= 160);
  assert.equal(validateNote(minimal, []).valid, true);
  const file = buildNoteFile(minimal);
  assert.equal(parseLessonSource(file.mdx, file.filename).status, "published");
});

test("deriveSummary strips markdown, code and images and stays within 160 characters", () => {
  const body = "## Heading\n\n![pic](/x.jpg)\n\n```js\nconst a = 1;\n```\n\n" + "Word ".repeat(80);
  const summary = deriveSummary(body);
  assert.ok(summary.length <= 160);
  assert.ok(!summary.includes("const a"));
  assert.ok(!summary.includes("Heading"));
  assert.ok(summary.endsWith("…"));
});

test("the studio command is matched exactly, case-insensitively", () => {
  assert.equal(isStudioCommand("/addnewnotes"), true);
  assert.equal(isStudioCommand("  /AddNewNotes "), true);
  assert.equal(isStudioCommand("/addnote"), true);
  assert.equal(isStudioCommand("/addnew"), false);
  assert.equal(isStudioCommand("debounce"), false);
});
