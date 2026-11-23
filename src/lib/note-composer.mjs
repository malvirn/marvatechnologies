// Pure helpers for the owner-only Note Composer. Kept framework-free so they can be unit-tested
// and so the rules below stay in lockstep with lessonSchema in insights-content.mjs.
export const COMPOSER_TRACKS = ["Frontend Engineering", "Backend Engineering", "System Design", "AI-Assisted Development"];
export const COMPOSER_LEVELS = ["Foundation", "Intermediate", "Advanced"];
// Typing one of these in the Build Notes search sends the owner to the (login-protected) studio page.
export const STUDIO_COMMANDS = ["/addnewnotes", "/addnote"];
const KNOWN_COMPONENTS = ["Callout", "CodeBlock", "Steps", "Checklist", "BeforeAfter", "PromptBlock", "Demo"];

export function isStudioCommand(value) {
  return STUDIO_COMMANDS.includes(String(value || "").trim().toLowerCase());
}

export function slugify(title) {
  return String(title || "")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80)
    .replace(/-+$/g, "");
}

export function parseTags(value) {
  const seen = new Set();
  return String(value || "").split(",").map((tag) => tag.trim()).filter((tag) => {
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function imageExtension(mime) {
  return mime === "image/webp" ? "webp" : mime === "image/png" ? "png" : "jpg";
}
export function imageUrlPath(slug, filename) {
  return "/insights/images/" + slug + "/" + filename;
}
export function imageRepoPath(slug, filename) {
  return "public" + imageUrlPath(slug, filename);
}
export function imageMarkdown(alt, urlPath) {
  const safeAlt = String(alt || "").replace(/[\[\]\n\r]/g, " ").trim();
  return "\n\n![" + safeAlt + "](" + urlPath + ")\n\n";
}

export function starterBody() {
  return [
    "## TL;DR", "", "One or two sentences a busy developer can act on.", "",
    "## The real scenario", "", "What was built, and what went wrong?", "",
    "## Why it matters", "", "",
    "## When to use it (and when not to)", "", "",
    "## How to implement it", "", "",
    "## Common mistakes", "", "",
    "## From my builds", "", ""
  ].join("\n");
}

// Remove fenced and inline code so the MDX risk check only looks at prose.
function stripCode(body) {
  return String(body || "").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

export function findMdxRisks(body) {
  const prose = stripCode(body);
  const risks = [];
  if (/[{}]/.test(prose)) risks.push("Curly braces { } outside code break MDX. Put them inside `code` or a fenced block.");
  const tags = prose.match(/<\/?([A-Za-z][A-Za-z0-9]*)/g) || [];
  const unknown = tags.map((t) => t.replace(/<\/?/, "")).filter((name) => !KNOWN_COMPONENTS.includes(name));
  if (unknown.length) risks.push("Unsupported tag <" + unknown[0] + ">. Use Markdown, or wrap it in `code`.");
  else if (/<(?![A-Za-z/])/.test(prose)) risks.push("A bare < outside code can break MDX. Write &lt; or put it in `code`.");
  return risks;
}

// Build a 20-160 character summary from the first sentences of the note body.
export function deriveSummary(body) {
  const text = String(body || "")
    .replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+.*$/gm, " ").replace(/[`*_>#-]/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[ ,;:.-]+$/, "") + "…";
}

// Fill the optional fields so the form only needs a title, a category and the note itself.
export function resolveNote(input) {
  return {
    ...input,
    summary: String(input.summary || "").trim() || deriveSummary(input.body),
    level: input.level || "Foundation",
    tags: String(input.tags || "").trim() || input.track || ""
  };
}

export function validateNote(rawInput, existingSlugs = []) {
  const input = resolveNote(rawInput);
  const errors = {};
  const title = String(input.title || "").trim();
  const summary = String(input.summary || "").trim();
  if (title.length < 5) errors.title = "Title needs at least 5 characters.";
  const slug = slugify(title);
  if (!errors.title && !slug) errors.title = "Title must contain letters or numbers.";
  if (slug && existingSlugs.includes(slug)) errors.title = "A published note already uses the slug \"" + slug + "\". Change the title.";
  if (summary.length < 20) errors.summary = "Write a little more in the note, or add a summary under More options.";
  if (summary.length > 160) errors.summary = "Summary is " + summary.length + " characters. The limit is 160.";
  if (!COMPOSER_TRACKS.includes(input.track)) errors.track = "Choose a track.";
  if (!COMPOSER_LEVELS.includes(input.level)) errors.level = "Choose a level.";
  if (String(input.body || "").trim().length < 40) errors.body = "Write the note body (at least a few sentences).";
  const risks = findMdxRisks(input.body);
  return { errors, warnings: risks, slug, valid: Object.keys(errors).length === 0 };
}

export function buildNoteFile(rawInput, now = new Date()) {
  const input = resolveNote(rawInput);
  const slug = slugify(input.title);
  const iso = now.toISOString();
  const lines = [
    "---",
    "title: " + JSON.stringify(String(input.title).trim()),
    "slug: " + JSON.stringify(slug),
    "summary: " + JSON.stringify(String(input.summary).trim().replace(/\s+/g, " ")),
    "track: " + JSON.stringify(input.track),
    "level: " + JSON.stringify(input.level)
  ];
  const tags = parseTags(input.tags);
  lines.push(tags.length ? "tags:" : "tags: []");
  tags.forEach((tag) => lines.push("  - " + JSON.stringify(tag)));
  lines.push(
    "publishedAt: " + JSON.stringify(iso),
    "updatedAt: " + JSON.stringify(iso),
    "lastReviewed: " + JSON.stringify(iso),
    "status: " + JSON.stringify(input.status === "published" ? "published" : "draft"),
    "related: []",
    "prerequisites: []"
  );
  if (String(input.builtFrom || "").trim()) lines.push("builtFrom: " + JSON.stringify(String(input.builtFrom).trim()));
  lines.push("featured: false", "hasDemo: false", "---", "");
  return { slug, filename: slug + ".mdx", repoPath: "content/insights/" + slug + ".mdx", mdx: lines.join("\n") + "\n" + String(input.body).trim() + "\n" };
}
