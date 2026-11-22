import type { Metadata } from "next";
import NoteComposer from "@/components/insights/NoteComposer";
import { getAllLessons } from "@/lib/insights-content.mjs";

// Owner tool: not linked from the site, not in the sitemap, and asks search engines to skip it.
export const metadata: Metadata = {
  title: "Add a note | Marva Technologies",
  robots: { index: false, follow: false }
};

export default function AddNotePage() {
  const slugs = (getAllLessons() as { slug: string }[]).map((lesson) => lesson.slug);
  return (
    <main id="main-content" tabIndex={-1} className="in-page bn-page bn-add-note">
      <div className="shell"><NoteComposer asPage existingSlugs={slugs} /></div>
    </main>
  );
}
