import type { Metadata } from "next";
import StudioApp from "@/components/studio/StudioApp";
import { getAllLessons } from "@/lib/insights-content.mjs";

// Owner tool: not linked from the site, not in the sitemap, and asks search engines to skip it.
export const metadata: Metadata = {
  title: "Marva Studio",
  robots: { index: false, follow: false }
};

export default function AddNotePage() {
  const slugs = (getAllLessons() as { slug: string }[]).map((lesson) => lesson.slug);
  return <StudioApp existingSlugs={slugs} />;
}
