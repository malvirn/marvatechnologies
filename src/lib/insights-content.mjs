import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");
const tracks = ["Frontend Engineering", "Backend Engineering", "System Design", "AI-Assisted Development"];
const levels = ["Foundation", "Intermediate", "Advanced"];

export const lessonSchema = z.object({
  title: z.string().trim().min(5),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated slug."),
  summary: z.string().trim().min(20).max(160),
  track: z.enum(tracks),
  level: z.enum(levels),
  tags: z.array(z.string().trim().min(1)),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastReviewed: z.string().datetime(),
  status: z.enum(["draft", "published"]),
  related: z.array(z.string()),
  prerequisites: z.array(z.string()),
  builtFrom: z.string().trim().min(1).optional(),
  featured: z.boolean().default(false),
  hasDemo: z.boolean().default(false)
});

export function estimateReadingTime(content) {
  const withoutCode = content.replace(/```[\s\S]*?```/g, " ");
  const words = withoutCode.replace(/<[^>]+>/g, " ").replace(/[#>*_`~|-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function parseLessonSource(source, filename = "lesson.mdx") {
  const parsed = matter(source);
  const data = lessonSchema.parse(parsed.data);
  const expectedSlug = path.basename(filename, path.extname(filename));
  if (data.slug !== expectedSlug) {
    throw new Error("Lesson slug \"" + data.slug + "\" must match filename \"" + expectedSlug + "\".");
  }
  return { ...data, content: parsed.content.trim(), readingTime: estimateReadingTime(parsed.content), filename };
}

export function validateLessonCollection(lessons) {
  const seen = new Set();
  for (const lesson of lessons) {
    if (seen.has(lesson.slug)) throw new Error("Duplicate lesson slug: " + lesson.slug);
    seen.add(lesson.slug);
  }
  for (const lesson of lessons) {
    for (const reference of [...lesson.related, ...lesson.prerequisites]) {
      if (!seen.has(reference)) throw new Error("Lesson \"" + lesson.slug + "\" references missing lesson \"" + reference + "\".");
    }
  }
  return lessons;
}

export function extractTableOfContents(content) {
  const withoutCode = content.replace(/```[\s\S]*?```/g, " ");
  const used = new Map();
  const items = [];
  for (const line of withoutCode.split(/\r?\n/)) {
    const match = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const text = match[2].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`~]/g, "").trim();
    const base = text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/[\s-]+/g, "-");
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    items.push({ id: count ? base + "-" + count : base, text, level: match[1].length });
  }
  return items;
}

export function getRelatedLessons(lesson, lessons, limit = 3) {
  const bySlug = new Map(lessons.map((item) => [item.slug, item]));
  const explicit = (lesson.related || []).map((slug) => bySlug.get(slug)).filter((item) => item && item.slug !== lesson.slug);
  const fallback = lessons
    .filter((item) => item.slug !== lesson.slug && item.track === lesson.track && !explicit.some((related) => related.slug === item.slug))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return [...explicit, ...fallback].slice(0, limit);
}

export function getLessonNavigation(lesson, lessons) {
  const sameTrack = lessons.filter((item) => item.track === lesson.track).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const index = sameTrack.findIndex((item) => item.slug === lesson.slug);
  return {
    previous: index > 0 ? sameTrack[index - 1] : null,
    next: index >= 0 && index < sameTrack.length - 1 ? sameTrack[index + 1] : null
  };
}

export function getAllLessons() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx")).sort();
  const lessons = files.map((file) => {
    const fullPath = path.join(CONTENT_DIR, file);
    return parseLessonSource(fs.readFileSync(fullPath, "utf8"), file);
  });
  return validateLessonCollection(lessons).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedLessons() {
  return getAllLessons().filter((lesson) => lesson.status === "published");
}

export function getPublishedLessonBySlug(slug) {
  return getPublishedLessons().find((lesson) => lesson.slug === slug);
}
