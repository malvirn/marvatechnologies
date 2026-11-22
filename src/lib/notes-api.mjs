// Server-side logic for the owner-only note studio. Used by functions/api/add-note.js (Cloudflare Pages
// Function) and unit-tested directly. The GitHub token never reaches the browser: it lives in the
// GITHUB_TOKEN secret of the Cloudflare project.
export const DEFAULT_USERNAME = "marva";
// PBKDF2-SHA256 hash of the studio password. A long random password makes this safe to keep in a public
// repo. Override with NOTES_USERNAME / NOTES_PASSWORD_SALT / NOTES_PASSWORD_HASH to rotate without a commit.
export const DEFAULT_SALT = "8d9fd5e05f39381efcdca7309988693e";
export const DEFAULT_HASH = "6b813df964835f1f9ea7df0694076f1dee2d1e9f8456b113070720b0388ef712";
export const PBKDF2_ITERATIONS = 100000; // Cloudflare Workers caps PBKDF2 at 100,000

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_MDX = 200_000;
const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 2_500_000;

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
const unhex = (value) => Uint8Array.from(String(value).match(/.{1,2}/g) || [], (h) => parseInt(h, 16));

export async function hashPassword(password, saltHex, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(String(password)), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(saltHex), iterations }, key, 256);
  return hex(new Uint8Array(bits));
}

function constantTimeEqual(a, b) {
  const x = new TextEncoder().encode(String(a));
  const y = new TextEncoder().encode(String(b));
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

export async function verifyCredentials(env, username, password) {
  if (typeof username !== "string" || typeof password !== "string" || !username || !password || password.length > 200) return false;
  const expectedUser = env.NOTES_USERNAME || DEFAULT_USERNAME;
  const salt = env.NOTES_PASSWORD_SALT || DEFAULT_SALT;
  const expectedHash = env.NOTES_PASSWORD_HASH || DEFAULT_HASH;
  const actual = await hashPassword(password, salt);
  const userOk = constantTimeEqual(username.trim().toLowerCase(), expectedUser.toLowerCase());
  const passOk = constantTimeEqual(actual, expectedHash);
  return userOk && passOk;
}

function decodedBytes(base64) {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

// Paths are derived from the slug here, never taken from the browser.
export function validatePayload(note) {
  if (!note || typeof note !== "object") return { ok: false, error: "Missing note." };
  const { slug, mdx, images = [] } = note;
  if (typeof slug !== "string" || !SLUG.test(slug) || slug.length > 80) return { ok: false, error: "Invalid note slug." };
  if (typeof mdx !== "string" || mdx.length < 60 || mdx.length > MAX_MDX) return { ok: false, error: "Note is empty or too large." };
  if (!mdx.startsWith("---\n") || !mdx.includes('\nslug: "' + slug + '"\n')) return { ok: false, error: "Note header does not match its slug." };
  if (!Array.isArray(images) || images.length > MAX_IMAGES) return { ok: false, error: "At most " + MAX_IMAGES + " pictures per note." };
  const nameRule = new RegExp("^" + slug + "-\\d{1,2}\\.(webp|jpg|png)$");
  for (const image of images) {
    if (!image || !nameRule.test(image.name || "")) return { ok: false, error: "Invalid picture name." };
    if (typeof image.base64 !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.base64)) return { ok: false, error: "Invalid picture data." };
    if (decodedBytes(image.base64) > MAX_IMAGE_BYTES) return { ok: false, error: "A picture is too large (max 2.5 MB after shrinking)." };
  }
  const status = /\nstatus: "published"\n/.test(mdx) ? "published" : "draft";
  return { ok: true, slug, mdx, images, status };
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

class GithubError extends Error { constructor(message, status) { super(message); this.status = status; } }

async function githubPut({ token, repo, branch, path, base64, message, overwrite, fetchImpl }) {
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/");
  const headers = { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "marva-note-studio" };
  const existing = await fetchImpl(url + "?ref=" + encodeURIComponent(branch), { headers });
  let sha;
  if (existing.ok) {
    if (!overwrite) throw new GithubError("A note with this title already exists. Change the title.", 409);
    sha = (await existing.json()).sha;
  } else if (existing.status === 401 || existing.status === 403) {
    throw new GithubError("GitHub rejected the server token. Check GITHUB_TOKEN has Contents: Read and write on the repo.", 502);
  } else if (existing.status !== 404) {
    throw new GithubError("GitHub returned " + existing.status + ".", 502);
  }
  const put = await fetchImpl(url, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message, content: base64, branch, sha }) });
  if (!put.ok) throw new GithubError("GitHub could not save " + path + " (" + put.status + ").", 502);
}

export async function publishNote({ env, note, fetchImpl = fetch }) {
  if (!env.GITHUB_TOKEN) return { status: 500, body: { ok: false, error: "Not set up yet: add the GITHUB_TOKEN secret in Cloudflare Pages.", code: "not_configured" } };
  const checked = validatePayload(note);
  if (!checked.ok) return { status: 400, body: { ok: false, error: checked.error } };
  const repo = env.GITHUB_REPO || "malvirn/marvatechnologies";
  const branch = env.GITHUB_BRANCH || "main";
  const base = { token: env.GITHUB_TOKEN, repo, branch, fetchImpl };
  try {
    // Check the note file first so a duplicate title never leaves orphan pictures behind.
    const probe = "https://api.github.com/repos/" + repo + "/contents/content/insights/" + checked.slug + ".mdx?ref=" + encodeURIComponent(branch);
    const exists = await fetchImpl(probe, { headers: { Authorization: "Bearer " + env.GITHUB_TOKEN, Accept: "application/vnd.github+json", "User-Agent": "marva-note-studio" } });
    if (exists.ok) return { status: 409, body: { ok: false, error: "A note with this title already exists. Change the title." } };
    for (const image of checked.images) {
      await githubPut({ ...base, path: "public/insights/images/" + checked.slug + "/" + image.name, base64: image.base64, message: "Add picture for note: " + checked.slug, overwrite: true });
    }
    await githubPut({ ...base, path: "content/insights/" + checked.slug + ".mdx", base64: utf8ToBase64(checked.mdx), message: "Add note: " + checked.slug, overwrite: false });
    return { status: 200, body: { ok: true, slug: checked.slug, noteStatus: checked.status } };
  } catch (error) {
    return { status: error.status || 502, body: { ok: false, error: error.message || "Could not save the note." } };
  }
}
