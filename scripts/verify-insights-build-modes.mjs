import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const contentDirectory = path.join(root, "content", "insights");
const outDirectory = path.join(root, "out");
const siteUrl = process.env.SITE_URL || "https://marvatechnologies.pages.dev";
const lessonFile = path.join(contentDirectory, "audit-before-you-modify.mdx");
const lessonSlug = "audit-before-you-modify";

function fail(message) {
  throw new Error(message);
}

function readExportedPage() {
  for (const candidate of [path.join(outDirectory, "insights.html"), path.join(outDirectory, "insights", "index.html")]) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  fail("The exported /insights hub HTML was not found in out/.");
}

function assertHubImageExists() {
  const html = readExportedPage();
  const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  if (!match) fail("The /insights hub HTML does not contain an og:image metadata URL.");
  const imageUrl = new URL(match[1].replace(/&amp;/g, "&"), siteUrl);
  const imageFile = path.join(outDirectory, imageUrl.pathname.replace(/^\/+/, ""));
  if (!fs.existsSync(imageFile)) {
    fail("Hub metadata references " + imageUrl.pathname + " but the matching exported file is missing at " + imageFile + ".");
  }
  const signature = fs.readFileSync(imageFile).subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") fail("The exported hub social image is not a PNG: " + imageFile);
  console.log("Verified hub social image: " + imageUrl.pathname);
}

function runBuild(label) {
  console.log("\n=== Static build: " + label + " ===");
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(command, ["run", "build"], { cwd: root, env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) fail("npm run build failed for " + label + " with exit code " + result.status + ".");
}

function assertZeroPublishedOutput() {
  const feedPath = path.join(outDirectory, "insights", "rss.xml");
  const sitemapPath = path.join(outDirectory, "sitemap.xml");
  if (!fs.existsSync(feedPath)) fail("RSS export is missing: " + feedPath);
  if (!fs.existsSync(sitemapPath)) fail("Sitemap export is missing: " + sitemapPath);
  const feed = fs.readFileSync(feedPath, "utf8");
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (feed.includes(lessonSlug) || sitemap.includes(lessonSlug)) fail("The zero-published build unexpectedly exposed a draft lesson.");
}

function assertOnePublishedOutput() {
  const feed = fs.readFileSync(path.join(outDirectory, "insights", "rss.xml"), "utf8");
  const sitemap = fs.readFileSync(path.join(outDirectory, "sitemap.xml"), "utf8");
  if (!feed.includes(lessonSlug)) fail("The one-published build did not include the lesson in RSS.");
  if (!sitemap.includes(lessonSlug)) fail("The one-published build did not include the lesson in the sitemap.");

  const pageCandidates = [
    path.join(outDirectory, "insights", lessonSlug + ".html"),
    path.join(outDirectory, "insights", lessonSlug, "index.html")
  ];
  if (!pageCandidates.some((candidate) => fs.existsSync(candidate))) {
    fail("The published lesson HTML was not exported for " + lessonSlug + ".");
  }

  const imagePath = path.join(outDirectory, "insights", lessonSlug, "opengraph-image.png");
  if (!fs.existsSync(imagePath)) fail("The published lesson social image is missing: " + imagePath);
  const signature = fs.readFileSync(imagePath).subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") fail("The published lesson social image is not a PNG.");
  console.log("Verified published lesson page, RSS, sitemap and social image for " + lessonSlug + ".");
}

const lessonFiles = fs.readdirSync(contentDirectory).filter((name) => name.endsWith(".mdx"));
const original = fs.readFileSync(lessonFile, "utf8");
if (!/^status:\s*["']draft["']\s*$/m.test(original)) {
  fail("Expected " + lessonSlug + " to be a draft before the one-published build check.");
}
for (const name of lessonFiles) {
  const source = fs.readFileSync(path.join(contentDirectory, name), "utf8");
  if (!/^status:\s*["']draft["']\s*$/m.test(source)) {
    fail("Expected a zero-published baseline. " + name + " is not a draft.");
  }
}

assertHubImageExists();
assertZeroPublishedOutput();

try {
  const published = original.replace(/^status:\s*["']draft["']\s*$/m, 'status: "published"');
  fs.writeFileSync(lessonFile, published, "utf8");
  runBuild("one temporarily published lesson");
  assertHubImageExists();
  assertOnePublishedOutput();
} finally {
  fs.writeFileSync(lessonFile, original, "utf8");
}

console.log("\nBoth static export modes passed. The lesson frontmatter was restored to its original draft status.");
