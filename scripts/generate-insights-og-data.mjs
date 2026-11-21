import fs from "node:fs";
import path from "node:path";
import { getPublishedLessons } from "../src/lib/insights-content.mjs";

const destination = path.join(process.cwd(), "src", "generated", "insights-og-data.mjs");
const directory = path.dirname(destination);
fs.mkdirSync(directory, { recursive: true });
const lessons = getPublishedLessons().map(({ slug, title, summary, track }) => ({ slug, title, summary, track }));
fs.writeFileSync(destination, "export const publishedOgLessons = " + JSON.stringify(lessons, null, 2) + ";\n", "utf8");
console.log("Prepared social image data for " + lessons.length + " published Build Notes lessons.");
