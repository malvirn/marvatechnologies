import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyCredentials, validatePayload, publishNote } from "../src/lib/notes-api.mjs";

const salt = "00112233445566778899aabbccddeeff";
const env = async () => ({ NOTES_USERNAME: "owner", NOTES_PASSWORD_SALT: salt, NOTES_PASSWORD_HASH: await hashPassword("correct horse battery", salt) });
const mdx = '---\ntitle: "Retry with backoff"\nslug: "retry-with-backoff"\nstatus: "published"\n---\n\nRetry failed calls, but wait longer each time.\n';

test("credentials: right pair passes, wrong user or password fails", async () => {
  const e = await env();
  assert.equal(await verifyCredentials(e, "owner", "correct horse battery"), true);
  assert.equal(await verifyCredentials(e, " OWNER ", "correct horse battery"), true);
  assert.equal(await verifyCredentials(e, "owner", "wrong"), false);
  assert.equal(await verifyCredentials(e, "someone", "correct horse battery"), false);
  assert.equal(await verifyCredentials(e, "", ""), false);
  assert.equal(await verifyCredentials(e, 1, 2), false);
});

test("payload: accepts a valid note and rejects path tricks and oversized pictures", () => {
  const ok = validatePayload({ slug: "retry-with-backoff", mdx, images: [{ name: "retry-with-backoff-1.webp", base64: "AAAA" }] });
  assert.equal(ok.ok, true);
  assert.equal(ok.status, "published");
  assert.equal(validatePayload({ slug: "../etc/passwd", mdx, images: [] }).ok, false);
  assert.equal(validatePayload({ slug: "other-slug", mdx, images: [] }).ok, false);
  assert.equal(validatePayload({ slug: "retry-with-backoff", mdx, images: [{ name: "../../x.webp", base64: "AAAA" }] }).ok, false);
  assert.equal(validatePayload({ slug: "retry-with-backoff", mdx, images: [{ name: "retry-with-backoff-1.webp", base64: "A".repeat(4_000_000) }] }).ok, false);
  assert.equal(validatePayload({ slug: "retry-with-backoff", mdx: "not a note", images: [] }).ok, false);
});

test("publish: writes pictures then the note, and refuses duplicates and missing token", async () => {
  const calls = [];
  const fetchOk = async (url, init = {}) => { calls.push((init.method || "GET") + " " + url.split("/contents/")[1].split("?")[0]); return init.method === "PUT" ? { ok: true, status: 201 } : { ok: false, status: 404 }; };
  const note = { slug: "retry-with-backoff", mdx, images: [{ name: "retry-with-backoff-1.webp", base64: "AAAA" }] };
  const done = await publishNote({ env: { GITHUB_TOKEN: "t" }, note, fetchImpl: fetchOk });
  assert.equal(done.status, 200);
  assert.deepEqual(calls.filter((c) => c.startsWith("PUT")), ["PUT public/insights/images/retry-with-backoff/retry-with-backoff-1.webp", "PUT content/insights/retry-with-backoff.mdx"]);
  const dup = await publishNote({ env: { GITHUB_TOKEN: "t" }, note, fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ sha: "x" }) }) });
  assert.equal(dup.status, 409);
  assert.equal((await publishNote({ env: {}, note, fetchImpl: fetchOk })).body.code, "not_configured");
  const denied = await publishNote({ env: { GITHUB_TOKEN: "t" }, note: { ...note, images: [] }, fetchImpl: async (url, init = {}) => ({ ok: false, status: init.method ? 403 : 404 }) });
  assert.equal(denied.status, 502);
});
